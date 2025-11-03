import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import hotelService from "@/services/api/hotelService";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Card from "@/components/atoms/Card";
import Home from "@/components/pages/Home";
import BookingConfirmation from "@/components/organisms/BookingConfirmation";
import ReviewForm from "@/components/molecules/ReviewForm";
const HotelDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  
  // Booking form state
const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [rooms, setRooms] = useState(1);
  const [guests, setGuests] = useState(2);
  const [selectedRoom, setSelectedRoom] = useState(null);
const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
const fetchHotel = async () => {
    try {
      setLoading(true);
      const hotelData = await hotelService.getById(id);
      setHotel(hotelData);
      if (hotelData.roomTypes && hotelData.roomTypes.length > 0) {
        setSelectedRoom(hotelData.roomTypes[0]);
      }
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load hotel details');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchHotel();
    }
  }, [id]);

  const handleReviewSubmitSuccess = () => {
    toast.success('Thank you for your review! It has been added successfully.');
    setShowReviewForm(false);
    // Refresh hotel data to show new review
    fetchHotel();
  };

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <ApperIcon
        key={index}
        name="Star"
        className={`w-5 h-5 ${
          index < rating 
            ? "text-gold fill-gold" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut || !selectedRoom) return 0;
    
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const nights = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    
    if (nights <= 0) return 0;
    
    return selectedRoom.pricePerNight * nights * rooms;
  };

const handleBooking = () => {
    if (!checkIn || !checkOut || !selectedRoom) {
      toast.error('Please select check-in date, check-out date, and room type');
      return;
    }
    
    const totalPrice = calculateTotalPrice();
    if (totalPrice <= 0) {
      toast.error('Please select valid dates');
      return;
    }
    
    setShowBookingModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-96 bg-gray-200 rounded-xl mb-6"></div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <div className="h-32 bg-gray-200 rounded mb-6"></div>
                <div className="h-24 bg-gray-200 rounded"></div>
              </div>
              <div className="h-96 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-background pt-20 px-4">
        <div className="max-w-6xl mx-auto">
          <Card className="p-8 text-center">
            <ApperIcon name="AlertCircle" className="w-12 h-12 text-error mx-auto mb-4" />
            <h2 className="font-display text-heading-md text-gray-900 mb-2">Hotel Not Found</h2>
            <p className="text-gray-600 mb-4">The hotel you're looking for doesn't exist or has been removed.</p>
            <Button onClick={() => navigate('/')}>
              <ApperIcon name="ArrowLeft" className="w-4 h-4" />
              Back to Home
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const totalPrice = calculateTotalPrice();
  const nights = checkIn && checkOut ? Math.ceil((new Date(checkOut) - new Date(checkIn)) / (1000 * 60 * 60 * 24)) : 0;

  return (
    <div className="min-h-screen bg-background pt-20">
      <div className="max-w-6xl mx-auto px-4 pb-8">
        {/* Header */}
        <div className="mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ApperIcon name="ArrowLeft" className="w-4 h-4" />
            Back to Hotels
          </Button>
          
          <div className="flex items-start justify-between">
            <div>
<h1 className="font-display text-display-md text-gray-900 mb-2">
                {hotel.name}
              </h1>
              <div className="flex items-center gap-4 mb-2">
                <div className="flex items-center gap-2">
                  <ApperIcon name="MapPin" className="w-5 h-5 text-gray-500" />
                  <span className="text-gray-600">{hotel.location}</span>
                </div>
                <div className="flex items-center gap-1">
                  {renderStars(hotel.starRating)}
                  <span className="text-sm text-gray-500 ml-1">({hotel.starRating} star)</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-3">
              <div className="aspect-[16/10] rounded-xl overflow-hidden bg-gray-100">
                <img
                  src={hotel.images ? hotel.images[selectedImage] : hotel.imageUrl}
                  alt={hotel.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
            
            {hotel.images && hotel.images.length > 1 && (
              <div className="grid grid-cols-4 lg:grid-cols-1 gap-2">
                {hotel.images.slice(0, 6).map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`aspect-square rounded-lg overflow-hidden bg-gray-100 border-2 transition-colors ${
                      selectedImage === index ? 'border-primary' : 'border-transparent hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${hotel.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Hotel Details */}
          <div className="lg:col-span-2">
            {/* Description */}
            <Card className="p-6 mb-6">
              <h2 className="font-display text-heading-lg text-gray-900 mb-4">
                About This Hotel
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {hotel.description}
              </p>
            </Card>

            {/* Amenities */}
            <Card className="p-6 mb-6">
              <h2 className="font-display text-heading-lg text-gray-900 mb-4">
                Amenities
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {hotel.amenities && hotel.amenities.map((amenity, index) => {
                  const getAmenityIcon = (amenity) => {
                    const amenityLower = amenity.toLowerCase();
                    if (amenityLower.includes('wifi')) return 'Wifi';
                    if (amenityLower.includes('pool')) return 'Waves';
                    if (amenityLower.includes('gym') || amenityLower.includes('fitness')) return 'Dumbbell';
                    if (amenityLower.includes('spa')) return 'Heart';
                    if (amenityLower.includes('restaurant')) return 'Utensils';
                    if (amenityLower.includes('parking')) return 'Car';
                    if (amenityLower.includes('bar')) return 'Wine';
                    if (amenityLower.includes('air') || amenityLower.includes('ac')) return 'Wind';
                    if (amenityLower.includes('laundry')) return 'Shirt';
                    if (amenityLower.includes('room service')) return 'Room';
                    return 'Check';
                  };

                  return (
                    <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                      <ApperIcon 
                        name={getAmenityIcon(amenity)} 
                        className="w-5 h-5 text-primary shrink-0" 
                      />
                      <span className="text-gray-700 text-sm">{amenity}</span>
                    </div>
                  );
                })}
              </div>
            </Card>

            {/* Room Types */}
            {hotel.roomTypes && hotel.roomTypes.length > 0 && (
              <Card className="p-6 mb-6">
                <h2 className="font-display text-heading-lg text-gray-900 mb-4">
                  Room Types
                </h2>
                <div className="space-y-4">
                  {hotel.roomTypes.map((room, index) => (
                    <div
                      key={index}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                        selectedRoom?.name === room.name
                          ? 'border-primary bg-primary/5'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => setSelectedRoom(room)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-display text-heading-md text-gray-900 mb-2">
                            {room.name}
                          </h3>
                          <p className="text-gray-600 text-sm mb-3">{room.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {room.features && room.features.map((feature, fIndex) => (
                              <span
                                key={fIndex}
                                className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full"
                              >
                                {feature}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-2xl font-bold text-gray-900">
                            ${room.pricePerNight}
                          </div>
                          <div className="text-sm text-gray-500">per night</div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {/* Guest Reviews */}
            {hotel.reviews && hotel.reviews.length > 0 && (
<Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="font-display text-heading-lg text-gray-900">
                    Guest Reviews
                  </h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    <ApperIcon name="PenTool" size={16} className="mr-2" />
                    Write Review
                  </Button>
                </div>
                
                {showReviewForm && (
                  <div className="mb-6">
                    <ReviewForm
                      hotelId={hotel.Id}
                      onSubmitSuccess={handleReviewSubmitSuccess}
                    />
                  </div>
                )}
                
                <div className="space-y-6">
                  {hotel.reviews && hotel.reviews.length > 0 ? (
                    hotel.reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-100 last:border-b-0 pb-6 last:pb-0">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{review.name}</h4>
                            <div className="flex items-center gap-1 mt-1">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                          <span className="text-sm text-gray-500">{review.date}</span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <ApperIcon name="MessageCircle" size={48} className="mx-auto text-gray-300 mb-3" />
                      <p className="text-gray-500">No reviews yet. Be the first to share your experience!</p>
                    </div>
                  )}
                </div>
              </Card>
            )}
          </div>

          {/* Right Column - Booking Form */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <h2 className="font-display text-heading-lg text-gray-900 mb-4">
                Book Your Stay
              </h2>
              
              <div className="space-y-4 mb-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in
                    </label>
                    <Input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out
                    </label>
                    <Input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      min={checkIn || new Date().toISOString().split('T')[0]}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Rooms
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="10"
                      value={rooms}
                      onChange={(e) => setRooms(parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guests
                    </label>
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={guests}
                      onChange={(e) => setGuests(parseInt(e.target.value))}
                    />
                  </div>
                </div>

                {selectedRoom && (
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Selected Room:</span>
                      <span className="font-medium text-gray-900">{selectedRoom.name}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Price Summary */}
              {checkIn && checkOut && selectedRoom && nights > 0 && (
                <div className="border-t border-gray-200 pt-4 mb-6">
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">
                        ${selectedRoom.pricePerNight} x {nights} nights x {rooms} room{rooms > 1 ? 's' : ''}
                      </span>
                      <span className="text-gray-900">${selectedRoom.pricePerNight * nights * rooms}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Taxes & fees</span>
                      <span className="text-gray-900">$42</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between border-t pt-2">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="text-2xl font-bold text-gray-900">${totalPrice + 42}</span>
                  </div>
                </div>
              )}

              <Button
                onClick={handleBooking}
                className="w-full"
                size="lg"
                disabled={!checkIn || !checkOut || !selectedRoom || nights <= 0}
disabled={!checkIn || !checkOut || !selectedRoom || nights <= 0}
              >
                <ApperIcon name="Calendar" className="w-5 h-5" />
              </Button>
              
              <p className="text-xs text-gray-500 mt-3 text-center">
                Free cancellation • No booking fees
              </p>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Booking Confirmation Modal */}
      <BookingConfirmation 
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        hotel={hotel}
        bookingDetails={{
          checkIn,
          checkOut,
          rooms,
          guests,
          selectedRoom
        }}
        totalPrice={totalPrice}
        nights={nights}
      />
    </div>
  );
};

export default HotelDetails;