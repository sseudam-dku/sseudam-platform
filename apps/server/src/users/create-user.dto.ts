import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'user@sseudam.app' })
  @IsEmail()
  email!: string;

  @ApiPropertyOptional({ example: 'Sseudam User' })
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;
}
