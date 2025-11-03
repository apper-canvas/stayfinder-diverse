import { motion, AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import Button from "@/components/atoms/Button";

const HotelModal = ({ hotel, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }

    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

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

  if (!hotel) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-4 md:inset-8 lg:inset-16 bg-white rounded-2xl shadow-2xl z-50 overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="font-display text-heading-lg text-gray-900">
                    {hotel.name}
                  </h2>
                  <div className="flex items-center gap-2 mt-1">
                    <ApperIcon name="MapPin" className="w-4 h-4 text-gray-500" />
                    <span className="text-gray-600">{hotel.location}</span>
                    <div className="flex items-center gap-1 ml-2">
                      {renderStars(hotel.starRating)}
                    </div>
                  </div>
                </div>
              </div>
              
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ApperIcon name="X" className="w-6 h-6 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Image Gallery */}
                <div className="mb-6">
                  <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                    <img
                      src={hotel.imageUrl}
                      alt={hotel.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  {/* Additional Images */}
                  {hotel.images && hotel.images.length > 1 && (
                    <div className="grid grid-cols-4 gap-2 mt-2">
                      {hotel.images.slice(1, 5).map((image, index) => (
                        <div key={index} className="aspect-video rounded-lg overflow-hidden bg-gray-100">
                          <img
                            src={image}
                            alt={`${hotel.name} ${index + 2}`}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="font-display text-heading-md text-gray-900 mb-3">
                    About This Hotel
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {hotel.description}
                  </p>
                </div>

                {/* Amenities */}
                {hotel.amenities && hotel.amenities.length > 0 && (
                  <div className="mb-6">
                    <h3 className="font-display text-heading-md text-gray-900 mb-3">
                      Amenities
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {hotel.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2 text-gray-700">
                          <ApperIcon name="Check" className="w-4 h-4 text-success" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="border-t border-gray-100 p-6 bg-gray-50">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    ${hotel.pricePerNight}
                    <span className="text-base font-normal text-gray-500 ml-1">
                      per night
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Taxes and fees included
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <Button
                    variant="secondary"
                    onClick={onClose}
                  >
                    Close
                  </Button>
                  <Button
                    onClick={() => {
                      // In a real app, this would open booking flow
                      alert("Booking functionality would be implemented here!");
                    }}
                  >
                    <ApperIcon name="Calendar" className="w-4 h-4" />
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default HotelModal;