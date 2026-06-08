import { Module } from "@nestjs/common";
import { DatabaseModule } from "../database.module";
import { SeoulWasteApiService } from "./seoul-waste-api.service";
import { WasteSortingController } from "./waste-sorting.controller";
import { WasteSortingService } from "./waste-sorting.service";

@Module({
  imports: [DatabaseModule],
  controllers: [WasteSortingController],
  providers: [WasteSortingService, SeoulWasteApiService],
  exports: [WasteSortingService],
})
export class WasteSortingModule {}
