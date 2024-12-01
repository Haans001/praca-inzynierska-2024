import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
import { BookingService } from './booking.service';
import { CreateBookingDto } from './dto/booking.dto';

@Controller('booking')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post('/book-seats')
  async create(
    @Body() createBookingDto: CreateBookingDto,
    @Req() req: Request,
  ) {
    const userId = req.user?.databaseID as number;

    return await this.bookingService.bookSeats(createBookingDto, userId);
  }

  @Get('/user-bookings')
  async getUserBookings(@Req() req: Request) {
    const userId = req.user?.databaseID as number;

    return await this.bookingService.getUserBookings(userId);
  }
}
