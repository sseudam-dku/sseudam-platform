import { Injectable } from "@nestjs/common";
import { randomUUID } from "crypto";
import { QueryResultRow } from "pg";
import { DatabaseService } from "../database.service";
import { CreateUserDto } from "./create-user.dto";

export interface UserRow extends QueryResultRow {
  id: string;
  email: string;
  name: string | null;
  createdAt: Date;
  updatedAt: Date;
}

@Injectable()
export class UsersService {
  constructor(private readonly database: DatabaseService) {}

  async findAll() {
    const { rows } = await this.database.query<UserRow>(
      'SELECT id, email, name, "createdAt", "updatedAt" FROM "User" ORDER BY "createdAt" DESC',
    );

    return rows;
  }

  async create(createUserDto: CreateUserDto) {
    const { rows } = await this.database.query<UserRow>(
      'INSERT INTO "User" (id, email, name, "createdAt", "updatedAt") VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id, email, name, "createdAt", "updatedAt"',
      [randomUUID(), createUserDto.email, createUserDto.name ?? null],
    );

    return rows[0];
  }
}
