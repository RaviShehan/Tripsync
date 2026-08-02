import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { createHash, pbkdf2Sync, randomBytes } from 'crypto';
import { LoginDto, RegisterDto } from './dto/login.dto';

export interface JwtPayload {
  sub: string;
  email: string;
  name: string;
  role: string;
}

interface UserRecord {
  id: string;
  name: string;
  email: string;
  passwordHash: string;
  salt: string;
  role: string;
}

@Injectable()
export class AuthService {
  private readonly users = new Map<string, UserRecord>();

  constructor(private readonly jwtService: JwtService) {}

  async register(dto: RegisterDto): Promise<{ accessToken: string; user: { id: string; email: string; name: string; role: string } }> {
    const existing = this.users.get(dto.email.toLowerCase());
    if (existing) {
      throw new UnauthorizedException('A user with that email already exists');
    }

    const salt = randomBytes(16).toString('hex');
    const passwordHash = this.hashPassword(dto.password, salt);
    const user: UserRecord = {
      id: `user-${this.users.size + 1}`,
      name: dto.name,
      email: dto.email.toLowerCase(),
      passwordHash,
      salt,
      role: 'CUSTOMER',
    };

    this.users.set(user.email, user);
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: user.role },
    };
  }

  async login(dto: LoginDto): Promise<{ accessToken: string; user: { id: string; email: string; name: string; role: string } }> {
    const user = this.users.get(dto.email.toLowerCase());
    if (!user || !this.verifyPassword(dto.password, user.passwordHash, user.salt)) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      name: user.name,
      role: dto.role ?? user.role,
    };

    const accessToken = await this.jwtService.signAsync(payload);
    return {
      accessToken,
      user: { id: user.id, email: user.email, name: user.name, role: payload.role },
    };
  }

  validatePayload(payload: JwtPayload): JwtPayload {
    if (!payload || !payload.sub) {
      throw new UnauthorizedException('Invalid token payload');
    }
    return payload;
  }

  private hashPassword(password: string, salt: string): string {
    return pbkdf2Sync(password, salt, 100_000, 64, 'sha512').toString('hex');
  }

  private verifyPassword(password: string, passwordHash: string, salt: string): boolean {
    return this.hashPassword(password, salt) === passwordHash;
  }
}
