import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database.module";
import { UsersModule } from "../users/users.module";
import { RecordsController } from "./records.controller";
import { RecordsService } from "./records.service";

@Module({
  imports: [DatabaseModule, UsersModule],
  controllers: [RecordsController],
  providers: [RecordsService],
})
export class RecordsModule {}
