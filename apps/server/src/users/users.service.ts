import { Injectable, NotFoundException } from "@nestjs/common";
import { QueryResultRow } from "pg";
import { DatabaseService } from "../database.service";
import { UpdateLocationDto } from "./dto/update-location.dto";

interface LocationRow extends QueryResultRow {
  city: string | null;
  district: string | null;
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

/**
 * Manages user profile, location, stats, badges, and points.
 */
@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

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
    const totalRecords = await this.countRecords(userId);
    const totalPoints = await this.sumPoints(userId);
    const monthlyRecords = await this.countMonthlyRecords(userId);
    const streakDays = await this.calculateStreakDays(userId);
    const categoryBreakdown = await this.getCategoryBreakdown(userId);
    return {
      totalRecords,
      totalPoints,
      monthlyRecords,
      streakDays,
      categoryBreakdown,
    };
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
    return rows.map(row => ({
      id: row.id,
      date: this.formatDate(row.created_at),
      category: row.description,
      points: row.amount,
    }));
  }

  async evaluateBadges(userId: string): Promise<void> {
    const badges = await this.database.query<{
      id: string;
      condition_type: string;
      condition_value: number;
      reward_points: number;
    }>("SELECT id, condition_type, condition_value, reward_points FROM badges");
    for (const badge of badges.rows) {
      const earned = await this.hasBadge(userId, badge.id);
      if (earned) {
        continue;
      }
      const qualifies = await this.checkBadgeCondition(
        userId,
        badge.condition_type,
        badge.condition_value,
        badge.id,
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

  private mapLocation(city: string, district: string): UserLocation {
    return {
      city,
      district,
      displayName: `${city} ${district}`,
    };
  }

  private async countRecords(userId: string): Promise<number> {
    const { rows } = await this.database.query<{ count: string }>(
      "SELECT COUNT(*)::text AS count FROM disposal_records WHERE user_id = $1 AND status = 'success'",
      [userId],
    );
    return Number(rows[0]?.count ?? 0);
  }

  private async sumPoints(userId: string): Promise<number> {
    const { rows } = await this.database.query<{ total: string | null }>(
      "SELECT SUM(amount)::text AS total FROM point_transactions WHERE user_id = $1",
      [userId],
    );
    return Number(rows[0]?.total ?? 0);
  }

  private async countMonthlyRecords(userId: string): Promise<number> {
    const { rows } = await this.database.query<{ count: string }>(
      `SELECT COUNT(*)::text AS count
       FROM disposal_records
       WHERE user_id = $1
         AND status = 'success'
         AND created_at >= date_trunc('month', NOW())`,
      [userId],
    );
    return Number(rows[0]?.count ?? 0);
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

  private async hasBadge(userId: string, badgeId: string): Promise<boolean> {
    const { rows } = await this.database.query<{ exists: boolean }>(
      "SELECT EXISTS(SELECT 1 FROM user_badges WHERE user_id = $1 AND badge_id = $2) AS exists",
      [userId, badgeId],
    );
    return rows[0]?.exists ?? false;
  }

  private async checkBadgeCondition(
    userId: string,
    conditionType: string,
    conditionValue: number,
    badgeId: string,
  ): Promise<boolean> {
    if (conditionType === "streak_days") {
      const streak = await this.calculateStreakDays(userId);
      return streak >= conditionValue;
    }
    if (conditionType === "all_categories") {
      const { rows } = await this.database.query<{ count: string }>(
        `SELECT COUNT(DISTINCT category_id)::text AS count
         FROM disposal_records
         WHERE user_id = $1 AND status = 'success'`,
        [userId],
      );
      return Number(rows[0]?.count ?? 0) >= conditionValue;
    }
    if (conditionType === "category_count") {
      const categoryId = this.resolveBadgeCategory(badgeId);
      if (!categoryId) {
        return false;
      }
      const { rows } = await this.database.query<{ count: string }>(
        `SELECT COUNT(*)::text AS count
         FROM disposal_records
         WHERE user_id = $1 AND category_id = $2 AND status = 'success'`,
        [userId, categoryId],
      );
      return Number(rows[0]?.count ?? 0) >= conditionValue;
    }
    return false;
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
