import { Injectable, Logger, OnModuleInit } from "@nestjs/common";
import { readFileSync, readdirSync } from "fs";
import { join } from "path";
import { DatabaseService } from "../database.service";

interface MigrationRow {
  version: string;
}

/**
 * Applies versioned SQL migrations from the sql directory on startup.
 */
@Injectable()
export class MigrationService implements OnModuleInit {
  private readonly logger = new Logger(MigrationService.name);

  constructor(private readonly database: DatabaseService) {}

  async onModuleInit(): Promise<void> {
    await this.runMigrations();
  }

  private async runMigrations(): Promise<void> {
    await this.database.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        version TEXT PRIMARY KEY,
        applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
      )
    `);
    const sqlDir = join(__dirname, "..", "..", "sql");
    const files = readdirSync(sqlDir)
      .filter(file => file.endsWith(".sql"))
      .sort();

    for (const file of files) {
      const version = file.replace(".sql", "");
      const { rows } = await this.database.query<MigrationRow>(
        "SELECT version FROM schema_migrations WHERE version = $1",
        [version],
      );
      if (rows.length > 0) {
        continue;
      }
      const sql = readFileSync(join(sqlDir, file), "utf-8");
      await this.database.query("BEGIN");
      try {
        await this.database.query(sql);
        await this.database.query("INSERT INTO schema_migrations (version) VALUES ($1)", [version]);
        await this.database.query("COMMIT");
        this.logger.log(`Applied migration: ${version}`);
      } catch (error: unknown) {
        await this.database.query("ROLLBACK");
        throw error;
      }
    }
  }
}
