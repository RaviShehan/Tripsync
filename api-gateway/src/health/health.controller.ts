import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  @Public()
  @Get()
  getHealth() {
    return {
      status: 'UP',
      service: 'tripsync-api-gateway',
      timestamp: new Date().toISOString(),
    };
  }
}
