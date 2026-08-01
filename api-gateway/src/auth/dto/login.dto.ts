import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class LoginDto {
  @ApiProperty({ example: 'user-123' })
  @IsString()
  @MinLength(1)
  userId: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ example: 'CUSTOMER', enum: ['CUSTOMER', 'ADMIN'] })
  @IsOptional()
  @IsString()
  role?: 'CUSTOMER' | 'ADMIN';
}
