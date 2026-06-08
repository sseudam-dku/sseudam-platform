import { Injectable, NotFoundException } from "@nestjs/common";
import { QueryResultRow } from "pg";
import { InMemoryCacheService } from "../core/cache/in-memory-cache.service";
import { DatabaseService } from "../database.service";
import { UpdateLocationDto } from "./dto/update-location.dto";

interface LocationRow extends QueryResultRow {
  city: string | null;
  district: string | null;
}

interface BadgeDefinitionRow extends QueryResultRow {
  id: string;
  condition_type: string;
  condition_value: number;
  reward_points: number;
}

export interface UserLocation {
  city: string;
  district: string;
  displayName: string;
}

export interface UserStats {
  totalRecords: number;
  totalPoints: number;
  monthlyRecords: number;
  streakDays: number;
  categoryBreakdown: Array<{
    name: string;
    percent: number;
    color: string;
  }>;
}

export interface UserBadge {
  id: string;
  name: string;
  emoji: string;
  image: string;
  description: string;
  reward: string;
  earned: boolean;
}

export interface PointHistoryItem {
  id: string;
  date: string;
  category: string;
  points: number;
}

const CATEGORY_COLORS: Record<string, string> = {
  plastic: "bg-orange-400",
  paper: "bg-blue-400",
  glass: "bg-teal-400",
  can: "bg-yellow-400",
  food: "bg-green-400",
  styrofoam: "bg-purple-400",
  clothes: "bg-pink-400",
  lamp: "bg-amber-400",
  battery: "bg-red-400",
};

const USER_STATS_CACHE_TTL_MS = 3 * 60 * 1000;
const USER_POINTS_CACHE_TTL_MS = 60 * 1000;

/**
 * Manages user profile, location, stats, badges, and points.
 */
@Injectable()
export class UsersService {
  constructor(
    private readonly database: DatabaseService,
    private readonly cache: InMemoryCacheService,
  ) {}

  async updateLocation(
    userId: string,
    updateLocationDto: UpdateLocationDto,
  ): Promise<UserLocation> {
    const { rows } = await this.database.query<LocationRow>(
      `UPDATE users
       SET city = $1, district = $2, updated_at = NOW()
       WHERE id = $3
       RETURNING city, district`,
      [updateLocationDto.city, updateLocationDto.district, userId],
    );
    if (!rows[0]?.city || !rows[0]?.district) {
      throw new NotFoundException("User not found");
    }
    this.cache.invalidateUser(userId);
    return this.mapLocation(rows[0].city, rows[0].district);
  }

  async getLocation(userId: string): Promise<UserLocation> {
    const { rows } = await this.database.query<LocationRow>(
      "SELECT city, district FROM users WHERE id = $1",
      [userId],
    );
    if (!rows[0]) {
      throw new NotFoundException("User not found");
    }
    const city = rows[0].city ?? "서울";
    const district = rows[0].district ?? "중구";
    return this.mapLocation(city, district);
  }

  async getStats(userId: string): Promise<UserStats> {
    const cacheKey = `user-stats:${userId}`;
    const cached = this.cache.get<UserStats>(cacheKey);
    if (cached) {
      return cached;
    }
    const stats = await this.loadStats(userId);
    this.cache.set(cacheKey, stats, USER_STATS_CACHE_TTL_MS, userId);
    return stats;
  }

  async getBadges(userId: string): Promise<UserBadge[]> {
    const { rows } = await this.database.query<{
      id: string;
      name: string;
      emoji: string;
      image: string;
      description: string;
      reward_points: number;
      earned: boolean;
    }>(
      `SELECT b.id, b.name, b.emoji, b.image, b.description, b.reward_points,
              (ub.badge_id IS NOT NULL) AS earned
       FROM badges b
       LEFT JOIN user_badges ub ON ub.badge_id = b.id AND ub.user_id = $1
       ORDER BY b.id`,
      [userId],
    );
    return rows.map(row => ({
      id: row.id,
      name: row.name,
      emoji: row.emoji,
      image: row.image,
      description: row.description,
      reward: `+${row.reward_points}P`,
      earned: row.earned,
    }));
  }

  async getPointHistory(userId: string): Promise<PointHistoryItem[]> {
    const cacheKey = `user-points:${userId}`;
    const cached = this.cache.get<PointHistoryItem[]>(cacheKey);
    if (cached) {
      return cached;
    }
    const { rows } = await this.database.query<{
      id: string;
      description: string;
      amount: number;
      created_at: Date;
    }>(
      `SELECT id, description, amount, created_at
       FROM point_transactions
       WHERE user_id = $1
       ORDER BY created_at DESC
       LIMIT 50`,
      [userId],
    );
    const history = rows.map(row => ({
      id: row.id,
      date: this.formatDate(row.created_at),
      category: row.description,
      points: row.amount,
    }));
    this.cache.set(cacheKey, history, USER_POINTS_CACHE_TTL_MS, userId);
    return history;
  }

  invalidateUserDataCaches(userId: string): void {
    this.cache.invalidateUserScope(userId, "user-stats:");
    this.cache.invalidateUserScope(userId, "user-records:");
    this.cache.invalidateUserScope(userId, "user-points:");
  }

  async evaluateBadges(userId: string): Promise<void> {
    const { rows: badges } = await this.database.query<BadgeDefinitionRow>(
      "SELECT id, condition_type, condition_value, reward_points FROM badges",
    );
    const { rows: earnedRows } = await this.database.query<{ badge_id: string }>(
      "SELECT badge_id FROM user_badges WHERE user_id = $1",
      [userId],
    );
    const earnedSet = new Set(earnedRows.map(row => row.badge_id));
    const streakDays = await this.calculateStreakDays(userId);
    const categoryCounts = await this.loadCategoryCounts(userId);
    const distinctCategoryCount = categoryCounts.size;
    for (const badge of badges) {
      if (earnedSet.has(badge.id)) {
        continue;
      }
      const qualifies = this.checkBadgeConditionInMemory(
        badge,
        streakDays,
        distinctCategoryCount,
        categoryCounts,
      );
      if (!qualifies) {
        continue;
      }
      await this.database.query(
        "INSERT INTO user_badges (user_id, badge_id) VALUES ($1, $2) ON CONFLICT DO NOTHING",
        [userId, badge.id],
      );
      await this.database.query(
        "INSERT INTO point_transactions (user_id, amount, description) VALUES ($1, $2, $3)",
        [userId, badge.reward_points, `뱃지 획득: ${badge.id}`],
      );
    }
  }

  private async loadStats(userId: string): Promise<UserStats> {
    const { rows } = await this.database.query<{
      total_records: string;
      monthly_records: string;
      total_points: string | null;
    }>(
      `SELECT
         (SELECT COUNT(*)::text FROM disposal_records WHERE user_id = $1 AND status = 'success') AS total_records,
         (SELECT COUNT(*)::text FROM disposal_records
          WHERE user_id = $1 AND status = 'success' AND created_at >= date_trunc('month', NOW())) AS monthly_records,
         (SELECT SUM(amount)::text FROM point_transactions WHERE user_id = $1) AS total_points`,
      [userId],
    );
    const [streakDays, categoryBreakdown] = await Promise.all([
      this.calculateStreakDays(userId),
      this.getCategoryBreakdown(userId),
    ]);
    return {
      totalRecords: Number(rows[0]?.total_records ?? 0),
      totalPoints: Number(rows[0]?.total_points ?? 0),
      monthlyRecords: Number(rows[0]?.monthly_records ?? 0),
      streakDays,
      categoryBreakdown,
    };
  }

  private mapLocation(city: string, district: string): UserLocation {
    return {
      city,
      district,
      displayName: `${city} ${district}`,
    };
  }

  private async loadCategoryCounts(userId: string): Promise<Map<string, number>> {
    const { rows } = await this.database.query<{ category_id: string; count: string }>(
      `SELECT category_id, COUNT(*)::text AS count
       FROM disposal_records
       WHERE user_id = $1 AND status = 'success'
       GROUP BY category_id`,
      [userId],
    );
    return new Map(rows.map(row => [row.category_id, Number(row.count)]));
  }

  private checkBadgeConditionInMemory(
    badge: BadgeDefinitionRow,
    streakDays: number,
    distinctCategoryCount: number,
    categoryCounts: Map<string, number>,
  ): boolean {
    if (badge.condition_type === "streak_days") {
      return streakDays >= badge.condition_value;
    }
    if (badge.condition_type === "all_categories") {
      return distinctCategoryCount >= badge.condition_value;
    }
    if (badge.condition_type === "category_count") {
      const categoryId = this.resolveBadgeCategory(badge.id);
      if (!categoryId) {
        return false;
      }
      return (categoryCounts.get(categoryId) ?? 0) >= badge.condition_value;
    }
    return false;
  }

  private async calculateStreakDays(userId: string): Promise<number> {
    const { rows } = await this.database.query<{ record_date: string }>(
      `SELECT DISTINCT created_at::date::text AS record_date
       FROM disposal_records
       WHERE user_id = $1 AND status = 'success'
       ORDER BY record_date DESC
       LIMIT 30`,
      [userId],
    );
    if (rows.length === 0) {
      return 0;
    }
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    for (let i = 0; i < rows.length; i++) {
      const expected = new Date(today);
      expected.setDate(expected.getDate() - i);
      const expectedStr = expected.toISOString().slice(0, 10);
      if (rows[i].record_date !== expectedStr) {
        break;
      }
      streak++;
    }
    return streak;
  }

  private async getCategoryBreakdown(userId: string): Promise<UserStats["categoryBreakdown"]> {
    const { rows } = await this.database.query<{
      name: string;
      category_id: string;
      count: string;
    }>(
      `SELECT wc.name, dr.category_id, COUNT(*)::text AS count
       FROM disposal_records dr
       JOIN waste_categories wc ON wc.id = dr.category_id
       WHERE dr.user_id = $1 AND dr.status = 'success'
       GROUP BY wc.name, dr.category_id
       ORDER BY count DESC`,
      [userId],
    );
    const total = rows.reduce((sum, row) => sum + Number(row.count), 0);
    if (total === 0) {
      return [];
    }
    return rows.map(row => ({
      name: row.name,
      percent: Math.round((Number(row.count) / total) * 100),
      color: CATEGORY_COLORS[row.category_id] ?? "bg-neutral-400",
    }));
  }

  private resolveBadgeCategory(badgeId: string): string | null {
    const mapping: Record<string, string> = {
      "plastic-collector": "plastic",
      "paper-collector": "paper",
      "vinyl-collector": "plastic",
    };
    return mapping[badgeId] ?? null;
  }

  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}.${month}.${day}`;
  }
}
