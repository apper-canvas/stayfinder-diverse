class BookingService {
  constructor() {
    // Initialize ApperClient
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  generateConfirmationNumber() {
    const prefix = 'BK';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.random().toString(36).substr(2, 4).toUpperCase();
    return `${prefix}${timestamp}${random}`;
  }

  async createBooking(bookingData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const confirmationNumber = this.generateConfirmationNumber();
      
      const params = {
        records: [{
          confirmation_number_c: confirmationNumber,
          guest_info_c: JSON.stringify(bookingData.guestInfo || {}),
          booking_details_c: JSON.stringify(bookingData.bookingDetails || {}),
          status_c: 'confirmed',
          booking_date_c: new Date().toISOString(),
          created_at_c: new Date().toISOString(),
          hotel_c: JSON.stringify(bookingData.hotel || {}),
          base_price_c: parseFloat(bookingData.basePrice) || 0,
          taxes_c: parseFloat(bookingData.taxes) || 0,
          total_price_c: parseFloat(bookingData.totalPrice) || 0,
          nights_c: parseInt(bookingData.nights) || 1
        }]
      };
      
      const response = await this.apperClient.createRecord('booking_c', params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return {
        confirmationNumber,
        bookingId: response.results[0].data.Id,
        status: 'confirmed',
        bookingDate: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error creating booking:', error);
      throw error;
    }
  }

  async getBookingByConfirmation(confirmationNumber) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "confirmation_number_c"}},
          {"field": {"Name": "guest_info_c"}},
          {"field": {"Name": "booking_details_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "booking_date_c"}},
          {"field": {"Name": "created_at_c"}},
          {"field": {"Name": "hotel_c"}},
          {"field": {"Name": "base_price_c"}},
          {"field": {"Name": "taxes_c"}},
          {"field": {"Name": "total_price_c"}},
          {"field": {"Name": "nights_c"}}
        ],
        where: [
          {"FieldName": "confirmation_number_c", "Operator": "EqualTo", "Values": [confirmationNumber]}
        ],
        pagingInfo: {"limit": 1, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords('booking_c', params);
      
      if (!response.success || !response.data || response.data.length === 0) {
        throw new Error('Booking not found');
      }
      
      const booking = response.data[0];
      
      return {
        Id: booking.Id,
        confirmationNumber: booking.confirmation_number_c,
        guestInfo: booking.guest_info_c ? JSON.parse(booking.guest_info_c) : {},
        bookingDetails: booking.booking_details_c ? JSON.parse(booking.booking_details_c) : {},
        status: booking.status_c,
        bookingDate: booking.booking_date_c,
        createdAt: booking.created_at_c,
        hotel: booking.hotel_c ? JSON.parse(booking.hotel_c) : {},
        basePrice: parseFloat(booking.base_price_c) || 0,
        taxes: parseFloat(booking.taxes_c) || 0,
        totalPrice: parseFloat(booking.total_price_c) || 0,
        nights: parseInt(booking.nights_c) || 1
      };
    } catch (error) {
      console.error('Error fetching booking by confirmation:', error);
      throw error;
    }
  }

  async getBookingsByEmail(email) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "confirmation_number_c"}},
          {"field": {"Name": "guest_info_c"}},
          {"field": {"Name": "booking_details_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "booking_date_c"}},
          {"field": {"Name": "hotel_c"}},
          {"field": {"Name": "total_price_c"}},
          {"field": {"Name": "nights_c"}}
        ],
        where: [
          {"FieldName": "guest_info_c", "Operator": "Contains", "Values": [email.toLowerCase()]}
        ],
        orderBy: [{"fieldName": "booking_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords('booking_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(booking => ({
        Id: booking.Id,
        confirmationNumber: booking.confirmation_number_c,
        guestInfo: booking.guest_info_c ? JSON.parse(booking.guest_info_c) : {},
        bookingDetails: booking.booking_details_c ? JSON.parse(booking.booking_details_c) : {},
        status: booking.status_c,
        bookingDate: booking.booking_date_c,
        hotel: booking.hotel_c ? JSON.parse(booking.hotel_c) : {},
        totalPrice: parseFloat(booking.total_price_c) || 0,
        nights: parseInt(booking.nights_c) || 1
      }));
    } catch (error) {
      console.error('Error fetching bookings by email:', error);
      return [];
    }
  }

  async cancelBooking(confirmationNumber) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      // First find the booking
      const booking = await this.getBookingByConfirmation(confirmationNumber);
      
      const params = {
        records: [{
          Id: booking.Id,
          status_c: 'cancelled'
        }]
      };
      
      const response = await this.apperClient.updateRecord('booking_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return {
        ...booking,
        status: 'cancelled',
        cancelledAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error cancelling booking:', error);
      throw error;
    }
  }

  async updateBooking(confirmationNumber, updates) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      // First find the booking
      const booking = await this.getBookingByConfirmation(confirmationNumber);
      
      const updateFields = {
        Id: booking.Id
      };
      
      if (updates.guestInfo) {
        updateFields.guest_info_c = JSON.stringify(updates.guestInfo);
      }
      
      if (updates.bookingDetails) {
        updateFields.booking_details_c = JSON.stringify(updates.bookingDetails);
      }
      
      if (updates.status) {
        updateFields.status_c = updates.status;
      }
      
      const params = {
        records: [updateFields]
      };
      
      const response = await this.apperClient.updateRecord('booking_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return {
        ...booking,
        ...updates,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Error updating booking:', error);
      throw error;
    }
  }

  async getAllBookings() {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "confirmation_number_c"}},
          {"field": {"Name": "guest_info_c"}},
          {"field": {"Name": "booking_details_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "booking_date_c"}},
          {"field": {"Name": "hotel_c"}},
          {"field": {"Name": "total_price_c"}},
          {"field": {"Name": "nights_c"}}
        ],
        orderBy: [{"fieldName": "booking_date_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 100, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords('booking_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(booking => ({
        Id: booking.Id,
        confirmationNumber: booking.confirmation_number_c,
        guestInfo: booking.guest_info_c ? JSON.parse(booking.guest_info_c) : {},
        bookingDetails: booking.booking_details_c ? JSON.parse(booking.booking_details_c) : {},
        status: booking.status_c,
        bookingDate: booking.booking_date_c,
        hotel: booking.hotel_c ? JSON.parse(booking.hotel_c) : {},
        totalPrice: parseFloat(booking.total_price_c) || 0,
        nights: parseInt(booking.nights_c) || 1
      }));
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      return [];
    }
  }

  async getBookingStats() {
    try {
      const bookings = await this.getAllBookings();
      
      const total = bookings.length;
      const confirmed = bookings.filter(b => b.status === 'confirmed').length;
      const cancelled = bookings.filter(b => b.status === 'cancelled').length;
      
      return {
        total,
        confirmed,
        cancelled,
        revenue: bookings
          .filter(b => b.status === 'confirmed')
          .reduce((sum, b) => sum + (b.totalPrice || 0), 0)
      };
    } catch (error) {
      console.error('Error fetching booking stats:', error);
      return {
        total: 0,
        confirmed: 0,
        cancelled: 0,
        revenue: 0
      };
    }
  }
}

const bookingService = new BookingService();
export default bookingService;