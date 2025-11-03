import { motion } from "framer-motion";
import { useState } from "react";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const HotelCard = ({ hotel, onViewDetails }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <ApperIcon
        key={index}
        name="Star"
        className={`w-4 h-4 ${
          index < rating 
            ? "text-gold fill-gold" 
            : "text-gray-300"
        }`}
      />
    ));
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  return (
    <Card className="group cursor-pointer h-full flex flex-col">
      {/* Image Container */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        {!imageLoaded && !imageError && (
          <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 animate-pulse">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-pulse"></div>
          </div>
        )}
        
        {imageError ? (
          <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
            <ApperIcon name="Image" className="w-12 h-12 text-gray-400" />
          </div>
        ) : (
          <img
            src={hotel.imageUrl}
            alt={hotel.name}
            className={`w-full h-full object-cover transition-all duration-300 group-hover:scale-110 ${
              imageLoaded ? "opacity-100" : "opacity-0"
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
          />
        )}
        
        {/* Overlay gradient on hover */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        {/* Hotel Name */}
        <h3 className="font-display text-heading-md text-gray-900 mb-2 group-hover:text-primary transition-colors duration-200 line-clamp-1">
          {hotel.name}
        </h3>

        {/* Location and Rating */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-gray-600">
            <ApperIcon name="MapPin" className="w-4 h-4" />
            <span className="text-sm line-clamp-1">{hotel.location}</span>
          </div>
          
          <div className="flex items-center gap-1">
            {renderStars(hotel.starRating)}
          </div>
        </div>

        {/* Price and Button */}
        <div className="flex items-center justify-between mt-auto">
          <div>
            <div className="text-heading-md font-bold text-gray-900">
              ${hotel.pricePerNight}
              <span className="text-sm font-normal text-gray-500 ml-1">
                per night
              </span>
            </div>
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(hotel);
            }}
            className="shrink-0"
          >
            View Details
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default HotelCard;