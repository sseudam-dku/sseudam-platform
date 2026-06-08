import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppController } from "./app.controller";
import { AuthModule } from "./auth/auth.module";
import { CameraModule } from "./camera/camera.module";
import { ChatModule } from "./chat/chat.module";
import { CacheModule } from "./core/cache/cache.module";
import { DatabaseModule } from "./database.module";
import { MigrationModule } from "./migration/migration.module";
import { RecordsModule } from "./records/records.module";
import { UsersModule } from "./users/users.module";
import { WasteSortingModule } from "./waste-sorting/waste-sorting.module";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MigrationModule,
    CacheModule,
    DatabaseModule,
    AuthModule,
    UsersModule,
    WasteSortingModule,
    ChatModule,
    CameraModule,
    RecordsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
