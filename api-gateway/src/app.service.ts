import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getRootInfo(): { service: string; message: string } {
    return {
      service: 'tripsync-api-gateway',
      message: 'TripSync API Gateway is running. See /api/v1/docs for Swagger.',
    };
  }
}
