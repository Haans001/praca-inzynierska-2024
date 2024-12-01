import { Injectable } from '@nestjs/common';
import { ErrorResponse, SuccessResponse } from 'src/lib/base-response';
import { PrismaService } from 'src/prisma/prisma.service';
import { MAX_SEATS, MAX_SEATS_PER_USER } from './const';
import { CreateBookingDto } from './dto/booking.dto';

@Injectable()
export class BookingService {
  constructor(private prisma: PrismaService) {}

  async bookSeats(createBookingDto: CreateBookingDto, userId: number) {
    const repertoire = await this.prisma.repertoire.findUnique({
      where: { id: createBookingDto.repertoireId },
      include: { bookings: true },
    });

    if (!repertoire) {
      return new ErrorResponse({
        repertoireId: 'Repertuar nie istnieje.',
      });
    }

    // Check if the show time is in the future
    if (repertoire.startTime <= new Date()) {
      return new ErrorResponse({
        repertoireId: 'Seans już się zaczął.',
      });
    }

    // Get all booked seats for this repertoire
    const bookedSeats = repertoire.bookings.flatMap(
      (booking) => booking.seatNumbers,
    );

    // Check if any of the requested seats are already booked
    const unavailableSeats = createBookingDto.seatNumbers.filter((seat) =>
      bookedSeats.includes(seat),
    );

    if (unavailableSeats.length > 0) {
      return new ErrorResponse({
        seatNumbers: `Miejsca ${unavailableSeats.join(', ')} są już zajęte.`,
      });
    }

    const existingBookings = await this.prisma.booking.findMany({
      where: {
        repertoireId: createBookingDto.repertoireId,
        userId,
      },
    });

    const totalExistingSeats = existingBookings.reduce(
      (sum, booking) => sum + booking.seatNumbers.length,
      0,
    );

    const newTotalSeats =
      totalExistingSeats + createBookingDto.seatNumbers.length;

    // Check if the number of seats is within the allowed range
    if (newTotalSeats > MAX_SEATS_PER_USER) {
      return new ErrorResponse({
        seatNumbers: 'Nie można zarezerwować więcej niż 5 miejsc na seans.',
      });
    }

    // Check if any seat number is out of range
    const invalidSeats = createBookingDto.seatNumbers.filter(
      (seat) => seat < 1 || seat > MAX_SEATS,
    );
    if (invalidSeats.length > 0) {
      return new ErrorResponse({
        seatNumbers: `Nieprawidłowe miejsca: ${invalidSeats.join(', ')}`,
      });
    }

    const { id } = await this.prisma.booking.create({
      data: {
        ...createBookingDto,
        userId,
      },
      include: { repertoire: { include: { movie: true } } },
    });

    return new SuccessResponse({
      bookingId: id,
    });
  }

  async getUserBookings(userId: number) {
    const bookings = await this.prisma.booking.findMany({
      where: { userId },
      include: { repertoire: { include: { movie: true } } },
    });

    return new SuccessResponse(bookings);
  }
}
