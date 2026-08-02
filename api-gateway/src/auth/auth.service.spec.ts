import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: { signAsync: jest.Mock };

  beforeEach(() => {
    jwtService = {
      signAsync: jest.fn().mockResolvedValue('signed-token'),
    };
    service = new AuthService(jwtService as unknown as JwtService);
  });

  it('registers a user and returns a JWT', async () => {
    const result = await service.register({
      name: 'Ada Lovelace',
      email: 'ada@example.com',
      password: 'Secret123!',
    });

    expect(result.accessToken).toBe('signed-token');
    expect(result.user.email).toBe('ada@example.com');
    expect(result.user.name).toBe('Ada Lovelace');
  });

  it('logs in an existing user with the correct password', async () => {
    await service.register({
      name: 'Grace Hopper',
      email: 'grace@example.com',
      password: 'SecurePass123!',
    });

    const result = await service.login({
      email: 'grace@example.com',
      password: 'SecurePass123!',
    });

    expect(result.accessToken).toBe('signed-token');
    expect(result.user.email).toBe('grace@example.com');
  });

  it('rejects an invalid password', async () => {
    await service.register({
      name: 'Linus Torvalds',
      email: 'linus@example.com',
      password: 'StrongPass123!',
    });

    await expect(
      service.login({
        email: 'linus@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toThrow(UnauthorizedException);
  });
});
