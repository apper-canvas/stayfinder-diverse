// Mock booking service for handling reservations
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// In-memory storage for bookings (in a real app, this would be a database)
let bookings = [];
let bookingIdCounter = 1000;

class BookingService {
  generateConfirmationNumber() {
    const prefix = 'BK';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  async createBooking(bookingData) {
    await delay(1500); // Simulate processing time
    
    const booking = {
      Id: bookingIdCounter++,
      confirmationNumber: this.generateConfirmationNumber(),
      ...bookingData,
      status: 'confirmed',
      bookingDate: new Date().toISOString(),
      createdAt: new Date().toISOString()
    };
    
    bookings.push(booking);
    
    return {
      confirmationNumber: booking.confirmationNumber,
      bookingId: booking.Id,
      status: booking.status,
      bookingDate: booking.bookingDate
    };
  }

  async getBookingByConfirmation(confirmationNumber) {
    await delay(300);
    
    const booking = bookings.find(b => b.confirmationNumber === confirmationNumber);
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return { ...booking };
  }

  async getBookingsByEmail(email) {
    await delay(400);
    
    const userBookings = bookings.filter(b => 
      b.guestInfo.email.toLowerCase() === email.toLowerCase()
    );
    
    return userBookings.map(booking => ({ ...booking }));
  }

  async cancelBooking(confirmationNumber) {
    await delay(500);
    
    const bookingIndex = bookings.findIndex(b => b.confirmationNumber === confirmationNumber);
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }
    
    bookings[bookingIndex].status = 'cancelled';
    bookings[bookingIndex].cancelledAt = new Date().toISOString();
    
    return { ...bookings[bookingIndex] };
  }

  async updateBooking(confirmationNumber, updates) {
    await delay(600);
    
    const bookingIndex = bookings.findIndex(b => b.confirmationNumber === confirmationNumber);
    if (bookingIndex === -1) {
      throw new Error('Booking not found');
    }
    
    bookings[bookingIndex] = {
      ...bookings[bookingIndex],
      ...updates,
      updatedAt: new Date().toISOString()
    };
    
    return { ...bookings[bookingIndex] };
  }

  async getAllBookings() {
    await delay(500);
    return bookings.map(booking => ({ ...booking }));
  }

  // Utility method to get booking statistics
  async getBookingStats() {
    await delay(200);
    
    const total = bookings.length;
    const confirmed = bookings.filter(b => b.status === 'confirmed').length;
    const cancelled = bookings.filter(b => b.status === 'cancelled').length;
    
    return {
      total,
      confirmed,
      cancelled,
      revenue: bookings
        .filter(b => b.status === 'confirmed')
        .reduce((sum, b) => sum + b.totalPrice, 0)
    };
  }
}

const bookingService = new BookingService();
export default bookingService;