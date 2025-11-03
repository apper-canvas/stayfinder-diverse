import React from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import Slider from '@/components/atoms/Slider';
import Checkbox from '@/components/atoms/Checkbox';
import { cn } from '@/utils/cn';

const FilterPanel = ({ 
  filters, 
  onFiltersChange, 
  onClearFilters, 
  className,
  isMobile = false,
  isOpen = true 
}) => {
  const handlePriceChange = (newRange) => {
    onFiltersChange({
      ...filters,
      priceRange: newRange
    });
  };

  const handleStarRatingChange = (rating, checked) => {
    const currentRatings = filters.starRating || [];
    const updatedRatings = checked
      ? [...currentRatings, rating]
      : currentRatings.filter(r => r !== rating);
    
    onFiltersChange({
      ...filters,
      starRating: updatedRatings
    });
  };

  const handleAmenityChange = (amenity, checked) => {
    const currentAmenities = filters.amenities || [];
    const updatedAmenities = checked
      ? [...currentAmenities, amenity]
      : currentAmenities.filter(a => a !== amenity);
    
    onFiltersChange({
      ...filters,
      amenities: updatedAmenities
    });
  };

  const formatPrice = (price) => `$${price}`;

  const renderStars = (rating) => {
    return (
      <div className="flex items-center space-x-1">
        {Array.from({ length: 5 }, (_, i) => (
          <ApperIcon
            key={i}
            name="Star"
            size={14}
            className={cn(
              i < rating ? "text-gold fill-current" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const amenityOptions = [
    { id: 'wifi', label: 'Free WiFi', icon: 'Wifi' },
    { id: 'pool', label: 'Swimming Pool', icon: 'Waves' },
    { id: 'parking', label: 'Parking', icon: 'Car' },
    { id: 'restaurant', label: 'Restaurant', icon: 'UtensilsCrossed' }
  ];

  const starOptions = [5, 4, 3, 2, 1];

  if (!isOpen && isMobile) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: isMobile ? 0 : -20 }}
      animate={{ opacity: 1, x: 0 }}
      className={cn(
        "bg-white rounded-xl shadow-card-rest p-6 h-fit",
        isMobile ? "mb-6" : "sticky top-6",
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-display text-lg font-semibold text-gray-900">
          Filters
        </h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-primary-500 hover:text-primary-600"
        >
          Clear All
        </Button>
      </div>

      {/* Price Range */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Price Range (per night)</h4>
        <Slider
          min={50}
          max={1000}
          value={filters.priceRange || [50, 1000]}
          onChange={handlePriceChange}
          step={10}
          formatValue={formatPrice}
        />
      </div>

      {/* Star Rating */}
      <div className="mb-8">
        <h4 className="font-medium text-gray-900 mb-4">Star Rating</h4>
        <div className="space-y-3">
          {starOptions.map(rating => (
            <Checkbox
              key={rating}
              checked={(filters.starRating || []).includes(rating)}
              onChange={(checked) => handleStarRatingChange(rating, checked)}
            >
              <div className="flex items-center space-x-2">
                {renderStars(rating)}
                <span className="text-sm text-gray-600">
                  {rating} star{rating !== 1 ? 's' : ''}
                </span>
              </div>
            </Checkbox>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div className="mb-6">
        <h4 className="font-medium text-gray-900 mb-4">Amenities</h4>
        <div className="space-y-3">
          {amenityOptions.map(amenity => (
            <Checkbox
              key={amenity.id}
              checked={(filters.amenities || []).includes(amenity.id)}
              onChange={(checked) => handleAmenityChange(amenity.id, checked)}
            >
              <div className="flex items-center space-x-2">
                <ApperIcon 
                  name={amenity.icon} 
                  size={16} 
                  className="text-gray-500" 
                />
                <span>{amenity.label}</span>
              </div>
            </Checkbox>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default FilterPanel;