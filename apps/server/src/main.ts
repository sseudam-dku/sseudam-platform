import { ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import cookieParser from "cookie-parser";
import { AppModule } from "./app.module";

function buildSwaggerDocument(configService: ConfigService, port: number) {
  const builder = new DocumentBuilder()
    .setTitle("쓰담 API")
    .setDescription("쓰담 분리배출 가이드 API")
    .setVersion("0.1.0")
    .addServer(`http://localhost:${port}`, "Local");

  const prodServerUrl = configService.get<string>("SWAGGER_PROD_SERVER_URL");
  if (prodServerUrl) {
    builder.addServer(prodServerUrl, "Production");
  }

  return builder
    .addBearerAuth(
      {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "POST /api/auth/google 응답의 accessToken",
      },
      "access-token",
    )
    .build();
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get<number>("PORT", 4000);

  app.enableCors({
    origin: configService.get<string>("WEB_ORIGIN", "http://localhost:3000"),
    credentials: true,
  });
  app.use(cookieParser());
  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  const swaggerConfig = buildSwaggerDocument(configService, port);
  const document = SwaggerModule.createDocument(app, swaggerConfig);
  SwaggerModule.setup("docs", app, document);

  await app.listen(port);
}

void bootstrap();
