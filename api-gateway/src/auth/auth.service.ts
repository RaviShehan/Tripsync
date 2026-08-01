import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { LoginDto } from './dto/login.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async login(dto: LoginDto): Promise<{ accessToken: string; user: { id: string; email: string; role: string } }> {
    const payload: JwtPayload = {
      sub: dto.userId,
      email: dto.email,
      role: dto.role ?? 'CUSTOMER',
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user: { id: payload.sub, email: payload.email, role: payload.role },
    };
  }

  validatePayload(payload: JwtPayload): JwtPayload {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return payload;
  }
}
