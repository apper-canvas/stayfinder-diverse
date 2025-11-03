import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import Card from '@/components/atoms/Card';
import { cn } from '@/utils/cn';
import bookingService from '@/services/api/bookingService';

function BookingConfirmation({ 
  isOpen, 
  onClose, 
  hotel, 
  bookingDetails,
  totalPrice,
  nights,
  taxes = 42 
}) {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState('details'); // 'details', 'guest-info', 'success'
  const [isLoading, setIsLoading] = useState(false);
  const [confirmationData, setConfirmationData] = useState(null);
  
  const [guestInfo, setGuestInfo] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    specialRequests: ''
  });
  
  const [errors, setErrors] = useState({});

  const validateGuestInfo = () => {
    const newErrors = {};
    
    if (!guestInfo.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    
    if (!guestInfo.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    
    if (!guestInfo.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(guestInfo.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    
    if (!guestInfo.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^[\+]?[1-9][\d]{0,15}$/.test(guestInfo.phone.replace(/[-\s\(\)]/g, ''))) {
      newErrors.phone = 'Please enter a valid phone number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleGuestInfoChange = (field, value) => {
    setGuestInfo(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleProceedToGuestInfo = () => {
    setCurrentStep('guest-info');
  };

  const handleSubmitBooking = async () => {
    if (!validateGuestInfo()) {
      toast.error('Please fill in all required fields correctly');
      return;
    }

    setIsLoading(true);
    
    try {
      const bookingData = {
        hotel,
        bookingDetails,
        guestInfo,
        totalPrice: totalPrice + taxes,
        basePrice: totalPrice,
        taxes,
        nights
      };
      
      const confirmation = await bookingService.createBooking(bookingData);
      setConfirmationData(confirmation);
      setCurrentStep('success');
      toast.success('Booking confirmed successfully!');
    } catch (error) {
      toast.error('Failed to process booking. Please try again.');
      console.error('Booking error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadConfirmation = () => {
    // Create a simple text receipt
    const receiptText = `
BOOKING CONFIRMATION
====================

Confirmation Number: ${confirmationData.confirmationNumber}
Booking Date: ${new Date().toLocaleDateString()}

HOTEL DETAILS
-------------
Hotel: ${hotel.name}
Location: ${hotel.location}, ${hotel.city}

GUEST DETAILS
-------------
Name: ${guestInfo.firstName} ${guestInfo.lastName}
Email: ${guestInfo.email}
Phone: ${guestInfo.phone}

BOOKING DETAILS
---------------
Check-in: ${bookingDetails.checkIn}
Check-out: ${bookingDetails.checkOut}
Nights: ${nights}
Room Type: ${bookingDetails.selectedRoom.name}
Rooms: ${bookingDetails.rooms}
Guests: ${bookingDetails.guests}

PRICE BREAKDOWN
---------------
Room Cost: $${totalPrice}
Taxes & Fees: $${taxes}
Total: $${totalPrice + taxes}

Special Requests: ${guestInfo.specialRequests || 'None'}

Thank you for choosing our service!
    `;

    const blob = new Blob([receiptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `booking-confirmation-${confirmationData.confirmationNumber}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    toast.success('Confirmation downloaded successfully');
  };

  const handleEmailConfirmation = () => {
    const subject = `Booking Confirmation - ${confirmationData.confirmationNumber}`;
    const body = `Your booking has been confirmed!%0D%0A%0D%0AConfirmation Number: ${confirmationData.confirmationNumber}%0D%0AHotel: ${hotel.name}%0D%0ACheck-in: ${bookingDetails.checkIn}%0D%0ACheck-out: ${bookingDetails.checkOut}`;
    
    window.location.href = `mailto:${guestInfo.email}?subject=${subject}&body=${body}`;
    toast.success('Email client opened with confirmation details');
  };

  const handleClose = () => {
    if (currentStep === 'success') {
      navigate('/');
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div>
              {currentStep === 'details' && (
                <h2 className="text-xl font-semibold text-gray-900">Booking Details</h2>
              )}
              {currentStep === 'guest-info' && (
                <h2 className="text-xl font-semibold text-gray-900">Guest Information</h2>
              )}
              {currentStep === 'success' && (
                <h2 className="text-xl font-semibold text-green-600">Booking Confirmed!</h2>
              )}
            </div>
            <button 
              onClick={handleClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ApperIcon name="X" className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6">
            {/* Step 1: Booking Details */}
            {currentStep === 'details' && (
              <div className="space-y-6">
                {/* Hotel Info */}
                <Card className="p-4">
                  <div className="flex items-start space-x-4">
                    <img 
                      src={hotel.imageUrl} 
                      alt={hotel.name}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{hotel.name}</h3>
                      <p className="text-sm text-gray-600">{hotel.location}, {hotel.city}</p>
                      <div className="flex items-center space-x-1 mt-1">
                        {[...Array(hotel.starRating)].map((_, i) => (
                          <ApperIcon key={i} name="Star" className="w-4 h-4 fill-gold text-gold" />
                        ))}
                        <span className="text-sm text-gray-600 ml-2">({hotel.starRating} stars)</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Booking Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Check-in</p>
                    <p className="text-gray-900">{new Date(bookingDetails.checkIn).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Check-out</p>
                    <p className="text-gray-900">{new Date(bookingDetails.checkOut).toLocaleDateString()}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Duration</p>
                    <p className="text-gray-900">{nights} night{nights > 1 ? 's' : ''}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-700">Guests</p>
                    <p className="text-gray-900">{bookingDetails.guests} guest{bookingDetails.guests > 1 ? 's' : ''}</p>
                  </div>
                </div>

                {/* Room Details */}
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2">{bookingDetails.selectedRoom.name}</h4>
                  <p className="text-sm text-gray-600 mb-2">{bookingDetails.selectedRoom.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {bookingDetails.selectedRoom.features.map((feature, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    {bookingDetails.rooms} room{bookingDetails.rooms > 1 ? 's' : ''}
                  </p>
                </Card>

                {/* Price Breakdown */}
                <Card className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-4">Price Breakdown</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">
                        ${bookingDetails.selectedRoom.pricePerNight} × {nights} nights × {bookingDetails.rooms} room{bookingDetails.rooms > 1 ? 's' : ''}
                      </span>
                      <span className="text-gray-900">${totalPrice}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Taxes & fees</span>
                      <span className="text-gray-900">${taxes}</span>
                    </div>
                    <div className="border-t pt-2">
                      <div className="flex justify-between">
                        <span className="font-semibold text-gray-900">Total</span>
                        <span className="text-xl font-bold text-gray-900">${totalPrice + taxes}</span>
                      </div>
                    </div>
                  </div>
                </Card>

                {/* Continue Button */}
                <Button 
                  onClick={handleProceedToGuestInfo}
                  className="w-full"
                  size="lg"
                >
                  Continue to Guest Information
                  <ApperIcon name="ArrowRight" className="w-5 h-5 ml-2" />
                </Button>
              </div>
            )}

            {/* Step 2: Guest Information */}
            {currentStep === 'guest-info' && (
              <div className="space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      First Name *
                    </label>
                    <Input
                      value={guestInfo.firstName}
                      onChange={(e) => handleGuestInfoChange('firstName', e.target.value)}
                      placeholder="Enter first name"
                      className={cn(errors.firstName && "border-red-500")}
                    />
                    {errors.firstName && (
                      <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name *
                    </label>
                    <Input
                      value={guestInfo.lastName}
                      onChange={(e) => handleGuestInfoChange('lastName', e.target.value)}
                      placeholder="Enter last name"
                      className={cn(errors.lastName && "border-red-500")}
                    />
                    {errors.lastName && (
                      <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <Input
                    type="email"
                    value={guestInfo.email}
                    onChange={(e) => handleGuestInfoChange('email', e.target.value)}
                    placeholder="Enter email address"
                    className={cn(errors.email && "border-red-500")}
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number *
                  </label>
                  <Input
                    type="tel"
                    value={guestInfo.phone}
                    onChange={(e) => handleGuestInfoChange('phone', e.target.value)}
                    placeholder="Enter phone number"
                    className={cn(errors.phone && "border-red-500")}
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Special Requests (Optional)
                  </label>
                  <textarea
                    value={guestInfo.specialRequests}
                    onChange={(e) => handleGuestInfoChange('specialRequests', e.target.value)}
                    placeholder="Any special requests or preferences..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 resize-none"
                    rows="3"
                  />
                </div>

                {/* Price Summary */}
                <Card className="p-4 bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-gray-900">Total Amount</span>
                    <span className="text-2xl font-bold text-primary-600">${totalPrice + taxes}</span>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex space-x-4">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentStep('details')}
                    className="flex-1"
                  >
                    <ApperIcon name="ArrowLeft" className="w-5 h-5 mr-2" />
                    Back
                  </Button>
                  <Button
                    onClick={handleSubmitBooking}
                    disabled={isLoading}
                    className="flex-1"
                    size="lg"
                  >
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <ApperIcon name="CreditCard" className="w-5 h-5 mr-2" />
                        Confirm Booking
                      </>
                    )}
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {currentStep === 'success' && confirmationData && (
              <div className="text-center space-y-6">
                <div className="flex justify-center">
                  <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
                    <ApperIcon name="Check" className="w-10 h-10 text-green-600" />
                  </div>
                </div>

                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
                  <p className="text-gray-600">Your reservation has been successfully processed.</p>
                </div>

                {/* Confirmation Number */}
                <Card className="p-4 bg-green-50 border-green-200">
                  <p className="text-sm text-gray-600 mb-1">Confirmation Number</p>
                  <p className="text-2xl font-bold text-green-700 font-mono">
                    {confirmationData.confirmationNumber}
                  </p>
                </Card>

                {/* Booking Summary */}
                <Card className="p-4 text-left">
                  <h4 className="font-semibold text-gray-900 mb-3">Booking Summary</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Hotel:</span>
                      <span className="text-gray-900">{hotel.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Guest:</span>
                      <span className="text-gray-900">{guestInfo.firstName} {guestInfo.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-in:</span>
                      <span className="text-gray-900">{new Date(bookingDetails.checkIn).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Check-out:</span>
                      <span className="text-gray-900">{new Date(bookingDetails.checkOut).toLocaleDateString()}</span>
                    </div>
                    <div className="flex justify-between border-t pt-2">
                      <span className="font-medium text-gray-900">Total Paid:</span>
                      <span className="font-bold text-gray-900">${totalPrice + taxes}</span>
                    </div>
                  </div>
                </Card>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={handleDownloadConfirmation}
                    className="flex-1"
                  >
                    <ApperIcon name="Download" className="w-5 h-5 mr-2" />
                    Download Confirmation
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleEmailConfirmation}
                    className="flex-1"
                  >
                    <ApperIcon name="Mail" className="w-5 h-5 mr-2" />
                    Email Confirmation
                  </Button>
                </div>

                <Button
                  onClick={handleClose}
                  className="w-full"
                  size="lg"
                >
                  Done
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default BookingConfirmation;