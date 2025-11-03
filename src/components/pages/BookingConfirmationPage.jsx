import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import bookingService from '@/services/api/bookingService';

function BookingConfirmationPage() {
  const { confirmationNumber } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadBooking();
  }, [confirmationNumber]);

  const loadBooking = async () => {
    try {
      setLoading(true);
      setError(null);
      const bookingData = await bookingService.getBookingByConfirmation(confirmationNumber);
      setBooking(bookingData);
    } catch (err) {
      setError('Booking not found. Please check your confirmation number.');
      console.error('Error loading booking:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadConfirmation = () => {
    if (!booking) return;

    const receiptText = `
BOOKING CONFIRMATION
====================

Confirmation Number: ${booking.confirmationNumber}
Booking Date: ${new Date(booking.bookingDate).toLocaleDateString()}

HOTEL DETAILS
-------------
Hotel: ${booking.hotel.name}
Location: ${booking.hotel.location}, ${booking.hotel.city}

GUEST DETAILS
-------------
Name: ${booking.guestInfo.firstName} ${booking.guestInfo.lastName}
Email: ${booking.guestInfo.email}
Phone: ${booking.guestInfo.phone}

BOOKING DETAILS
---------------
Check-in: ${booking.bookingDetails.checkIn}
Check-out: ${booking.bookingDetails.checkOut}
Nights: ${booking.nights}
Room Type: ${booking.bookingDetails.selectedRoom.name}
Rooms: ${booking.bookingDetails.rooms}
Guests: ${booking.bookingDetails.guests}

PRICE BREAKDOWN
---------------
Room Cost: $${booking.basePrice}
Taxes & Fees: $${booking.taxes}
Total: $${booking.totalPrice}

Special Requests: ${booking.guestInfo.specialRequests || 'None'}

Thank you for choosing our service!
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `booking-confirmation-${booking.confirmationNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Confirmation downloaded successfully');
  };

  const handleEmailConfirmation = () => {
    if (!booking) return;

    const subject = `Booking Confirmation - ${booking.confirmationNumber}`;
    const body = `Your booking has been confirmed!%0D%0A%0D%0AConfirmation Number: ${booking.confirmationNumber}%0D%0AHotel: ${booking.hotel.name}%0D%0ACheck-in: ${booking.bookingDetails.checkIn}%0D%0ACheck-out: ${booking.bookingDetails.checkOut}`;
    
    window.location.href = `mailto:${booking.guestInfo.email}?subject=${subject}&body=${body}`;
    toast.success('Email client opened with confirmation details');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Loading />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background py-12">
        <div className="max-w-4xl mx-auto px-4">
          <Error 
            message={error}
            onRetry={() => navigate('/')}
          />
        </div>
      </div>
    );
  }

  if (!booking) return null;

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-8"
        >
          {/* Header */}
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <ApperIcon name="Check" className="w-8 h-8 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Confirmed!</h1>
            <p className="text-gray-600">Your reservation has been successfully processed.</p>
          </div>

          {/* Confirmation Number */}
          <Card className="p-6 bg-green-50 border-green-200 text-center">
            <p className="text-sm text-gray-600 mb-2">Confirmation Number</p>
            <p className="text-3xl font-bold text-green-700 font-mono">
              {booking.confirmationNumber}
            </p>
          </Card>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Details */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hotel Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hotel Information</h3>
                <div className="flex items-start space-x-4">
                  <img 
                    src={booking.hotel.imageUrl} 
                    alt={booking.hotel.name}
                    className="w-24 h-24 rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900">{booking.hotel.name}</h4>
                    <p className="text-gray-600">{booking.hotel.location}, {booking.hotel.city}</p>
                    <div className="flex items-center space-x-1 mt-2">
                      {[...Array(booking.hotel.starRating)].map((_, i) => (
                        <ApperIcon key={i} name="Star" className="w-4 h-4 fill-gold text-gold" />
                      ))}
                      <span className="text-sm text-gray-600 ml-2">({booking.hotel.starRating} stars)</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Booking Details */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Details</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Check-in</p>
                    <p className="text-gray-900">{new Date(booking.bookingDetails.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Check-out</p>
                    <p className="text-gray-900">{new Date(booking.bookingDetails.checkOut).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Duration</p>
                    <p className="text-gray-900">{booking.nights} night{booking.nights > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Guests</p>
                    <p className="text-gray-900">{booking.bookingDetails.guests} guest{booking.bookingDetails.guests > 1 ? 's' : ''}</p>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-2">{booking.bookingDetails.selectedRoom.name}</h4>
                  <p className="text-sm text-gray-600">{booking.bookingDetails.selectedRoom.description}</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {booking.bookingDetails.rooms} room{booking.bookingDetails.rooms > 1 ? 's' : ''}
                  </p>
                </div>
              </Card>

              {/* Guest Information */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Guest Information</h3>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm font-medium text-gray-700">Name</p>
                    <p className="text-gray-900">{booking.guestInfo.firstName} {booking.guestInfo.lastName}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Email</p>
                    <p className="text-gray-900">{booking.guestInfo.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-700">Phone</p>
                    <p className="text-gray-900">{booking.guestInfo.phone}</p>
                  </div>
                  {booking.guestInfo.specialRequests && (
                    <div>
                      <p className="text-sm font-medium text-gray-700">Special Requests</p>
                      <p className="text-gray-900">{booking.guestInfo.specialRequests}</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Price Breakdown */}
              <Card className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Room Cost</span>
                    <span className="text-gray-900">${booking.basePrice}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Taxes & Fees</span>
                    <span className="text-gray-900">${booking.taxes}</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="font-semibold text-gray-900">Total Paid</span>
                      <span className="text-xl font-bold text-primary-600">${booking.totalPrice}</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleDownloadConfirmation}
                  variant="outline"
                  className="w-full"
                >
                  <ApperIcon name="Download" className="w-5 h-5 mr-2" />
                  Download Confirmation
                </Button>
                <Button
                  onClick={handleEmailConfirmation}
                  variant="outline"
                  className="w-full"
                >
                  <ApperIcon name="Mail" className="w-5 h-5 mr-2" />
                  Email Confirmation
                </Button>
                <Button
                  onClick={() => navigate('/')}
                  className="w-full"
                >
                  Back to Home
                </Button>
              </div>

              {/* Status */}
              <Card className="p-4 bg-green-50 border-green-200">
                <div className="flex items-center space-x-2">
                  <ApperIcon name="Check" className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm font-medium text-green-800">Status: Confirmed</p>
                    <p className="text-xs text-green-600">Booked on {new Date(booking.bookingDate).toLocaleDateString()}</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default BookingConfirmationPage;