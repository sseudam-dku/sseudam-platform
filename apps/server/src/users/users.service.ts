import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma.service";
import { CreateUserDto } from "./create-user.dto";

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }
}
