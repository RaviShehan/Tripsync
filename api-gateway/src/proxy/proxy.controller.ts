import { Controller, Req, Res, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { Request, Response } from 'express';
import { lastValueFrom } from 'rxjs';

type ServiceName = 'tour' | 'property' | 'car' | 'booking';

@Controller()
export class ProxyController {
  private readonly serviceUrls: Record<ServiceName, string>;

  constructor(
    private readonly http: HttpService,
    config: ConfigService,
  ) {
    this.serviceUrls = {
      tour: config.get<string>('TOUR_SERVICE_URL', 'http://localhost:3000'),
      property: config.get<string>('PROPERTY_SERVICE_URL', 'http://localhost:8081'),
      car: config.get<string>('CAR_SERVICE_URL', 'http://localhost:8082'),
      booking: config.get<string>('BOOKING_SERVICE_URL', 'http://localhost:8083'),
    };
  }

  @Get('tours')
  async getTours(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, 'tour');
  }

  @Get('tours/:id')
  async getTourById(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, 'tour');
  }

  @Post('tours')
  async createTour(@Req() req: Request, @Res() res: Response, @Body() body: unknown) {
    return this.forward(req, res, 'tour', body);
  }

  @Get('properties')
  async getProperties(@Req() req: Request, @Res() res: Response, @Query() query: Record<string, string>) {
    return this.forward(req, res, 'property');
  }

  @Get('properties/:id')
  async getPropertyById(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, 'property');
  }

  @Post('properties')
  async createProperty(@Req() req: Request, @Res() res: Response, @Body() body: unknown) {
    return this.forward(req, res, 'property', body);
  }

  @Put('properties/:id')
  async updateProperty(@Req() req: Request, @Res() res: Response, @Body() body: unknown) {
    return this.forward(req, res, 'property', body);
  }

  @Delete('properties/:id')
  async deleteProperty(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, 'property');
  }

  @Get('cars')
  async getCars(@Req() req: Request, @Res() res: Response, @Query() query: Record<string, string>) {
    return this.forward(req, res, 'car');
  }

  @Get('cars/:id')
  async getCarById(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, 'car');
  }

  @Post('cars')
  async createCar(@Req() req: Request, @Res() res: Response, @Body() body: unknown) {
    return this.forward(req, res, 'car', body);
  }

  @Put('cars/:id')
  async updateCar(@Req() req: Request, @Res() res: Response, @Body() body: unknown) {
    return this.forward(req, res, 'car', body);
  }

  @Delete('cars/:id')
  async deleteCar(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, 'car');
  }

  @Post('bookings')
  async createBooking(@Req() req: Request, @Res() res: Response, @Body() body: unknown) {
    return this.forward(req, res, 'booking', body);
  }

  @Get('bookings/:id')
  async getBookingById(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, 'booking');
  }

  @Get('bookings/user/:userId')
  async getBookingsByUser(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, 'booking');
  }

  @Post('bookings/:id/cancel')
  async cancelBooking(@Req() req: Request, @Res() res: Response) {
    return this.forward(req, res, 'booking');
  }

  private async forward(
    req: Request,
    res: Response,
    service: ServiceName,
    body?: unknown,
  ) {
    const method = req.method.toLowerCase() as 'get' | 'post' | 'put' | 'delete';
    const base = this.serviceUrls[service];
    const url = `${base}${req.originalUrl}`;

    try {
      const observable =
        method === 'get' || method === 'delete'
          ? this.http.request({
              method,
              url,
              headers: this.forwardHeaders(req),
              params: req.query,
            })
          : this.http.request({
              method,
              url,
              headers: this.forwardHeaders(req),
              data: body ?? req.body,
            });

      const response = await lastValueFrom(observable);
      res.status(response.status).json(response.data);
    } catch (error) {
      const status = error?.response?.status ?? 502;
      const message = error?.response?.data?.message ?? error?.message ?? 'Upstream service error';
      res.status(status).json({ error: message, status });
    }
  }

  private forwardHeaders(req: Request): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (req.headers.authorization) {
      headers.authorization = req.headers.authorization as string;
    }
    if (req.headers['x-request-id']) {
      headers['x-request-id'] = req.headers['x-request-id'] as string;
    }
    return headers;
  }
}
