import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "crypto";
import { QueryResultRow } from "pg";
import { DatabaseService } from "../database.service";
import { UsersService } from "../users/users.service";
import { CreateRecordDto } from "./dto/create-record.dto";

interface RecordRow extends QueryResultRow {
  id: string;
  item_name: string;
  category_id: string;
  category_name: string;
  points: number;
  status: string;
  created_at: Date;
}

export interface DisposalRecord {
  id: string;
  date: string;
  categoryId: string;
  category: string;
  name: string;
  points: number;
  status: string;
}

const DEFAULT_CATEGORY_POINTS: Record<string, number> = {
  plastic: 10,
  paper: 10,
  glass: 20,
  can: 15,
  food: 10,
  styrofoam: 10,
  clothes: 15,
  lamp: 20,
  battery: 25,
};

/**
 * Manages disposal records and triggers point/badge updates.
 */
@Injectable()
export class RecordsService {
  constructor(
    private readonly database: DatabaseService,
    private readonly usersService: UsersService,
  ) {}

  async createRecord(userId: string, createRecordDto: CreateRecordDto): Promise<DisposalRecord> {
    await this.ensureCategoryExists(createRecordDto.categoryId);
    const points =
      createRecordDto.points ?? DEFAULT_CATEGORY_POINTS[createRecordDto.categoryId] ?? 10;
    const status = createRecordDto.status ?? "success";
    const recordId = randomUUID();
    const { rows } = await this.database.query<RecordRow>(
      `INSERT INTO disposal_records (id, user_id, category_id, item_name, points, status, emoji)
       VALUES ($1, $2, $3, $4, $5, $6, NULL)
       RETURNING id, item_name, category_id, points, status, created_at,
         (SELECT name FROM waste_categories WHERE id = $3) AS category_name`,
      [recordId, userId, createRecordDto.categoryId, createRecordDto.itemName, points, status],
    );
    if (status === "success") {
      await this.database.query(
        `INSERT INTO point_transactions (user_id, amount, description, record_id)
         VALUES ($1, $2, $3, $4)`,
        [userId, points, `${rows[0].category_name} 분리배출`, recordId],
      );
      await this.usersService.evaluateBadges(userId);
    }
    return this.mapRecord(rows[0]);
  }

  async findUserRecords(userId: string): Promise<DisposalRecord[]> {
    const { rows } = await this.database.query<RecordRow>(
      `SELECT dr.id, dr.item_name, dr.category_id, dr.points, dr.status, dr.created_at,
              wc.name AS category_name
       FROM disposal_records dr
       JOIN waste_categories wc ON wc.id = dr.category_id
       WHERE dr.user_id = $1
       ORDER BY dr.created_at DESC
       LIMIT 50`,
      [userId],
    );
    return rows.map(row => this.mapRecord(row));
  }

  private async ensureCategoryExists(categoryId: string): Promise<void> {
    const { rows } = await this.database.query<{ id: string }>(
      "SELECT id FROM waste_categories WHERE id = $1",
      [categoryId],
    );
    if (!rows[0]) {
      throw new NotFoundException(`Category not found: ${categoryId}`);
    }
  }

  private mapRecord(row: RecordRow): DisposalRecord {
    const date = row.created_at;
    const formattedDate = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
    return {
      id: row.id,
      date: formattedDate,
      categoryId: row.category_id,
      category: row.category_name,
      name: row.item_name,
      points: row.points,
      status: row.status,
    };
  }
}
