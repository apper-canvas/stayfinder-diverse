import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import { cn } from '@/utils/cn';

function StarRating({ rating, onRatingChange, size = 24 }) {
  const [hoveredRating, setHoveredRating] = useState(0);
  
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          className={cn(
            "transition-all duration-200 hover:scale-110",
            (hoveredRating || rating) >= star 
              ? "text-gold" 
              : "text-gray-300 hover:text-gold"
          )}
          onClick={() => onRatingChange(star)}
          onMouseEnter={() => setHoveredRating(star)}
          onMouseLeave={() => setHoveredRating(0)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ApperIcon name="Star" size={size} fill="currentColor" />
        </motion.button>
      ))}
    </div>
  );
}

function ReviewForm({ hotelId, onSubmitSuccess, className }) {
  const [formData, setFormData] = useState({
    guestName: '',
    rating: 0,
    comment: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.guestName.trim()) {
      newErrors.guestName = 'Name is required';
    } else if (formData.guestName.trim().length < 2) {
      newErrors.guestName = 'Name must be at least 2 characters';
    }
    
    if (!formData.rating || formData.rating < 1) {
      newErrors.rating = 'Please select a rating';
    }
    
    if (!formData.comment.trim()) {
      newErrors.comment = 'Review comment is required';
    } else if (formData.comment.trim().length < 10) {
      newErrors.comment = 'Comment must be at least 10 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
try {
      // Import hotelService here to avoid circular dependencies
      const hotelServiceModule = await import('@/services/api/hotelService');
      const hotelService = hotelServiceModule.default;
      
      await hotelService.addReview(hotelId, formData);
      
      // Reset form
      setFormData({
        guestName: '',
        rating: 0,
        comment: ''
      });
      setErrors({});
      
      // Notify parent component
      if (onSubmitSuccess) {
        onSubmitSuccess();
      }
      
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <Card className={cn("p-6", className)}>
      <h3 className="font-display text-heading-md text-gray-900 mb-6">
        Write a Review
      </h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Name
          </label>
          <Input
            value={formData.guestName}
            onChange={(e) => handleInputChange('guestName', e.target.value)}
            placeholder="Enter your name"
            className={cn(errors.guestName && "border-error")}
            disabled={isSubmitting}
          />
          {errors.guestName && (
            <p className="mt-1 text-sm text-error">{errors.guestName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Rating
          </label>
          <div className="flex items-center gap-3">
            <StarRating
              rating={formData.rating}
              onRatingChange={(rating) => handleInputChange('rating', rating)}
              size={28}
            />
            <span className="text-sm text-gray-600">
              {formData.rating ? `${formData.rating} star${formData.rating > 1 ? 's' : ''}` : 'Select rating'}
            </span>
          </div>
          {errors.rating && (
            <p className="mt-1 text-sm text-error">{errors.rating}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Your Review
          </label>
          <textarea
            value={formData.comment}
            onChange={(e) => handleInputChange('comment', e.target.value)}
            placeholder="Share your experience at this hotel..."
            rows={4}
            className={cn(
              "w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary resize-vertical",
              errors.comment && "border-error"
            )}
            disabled={isSubmitting}
          />
          <div className="flex justify-between items-center mt-1">
            {errors.comment && (
              <p className="text-sm text-error">{errors.comment}</p>
            )}
            <p className="text-xs text-gray-500 ml-auto">
              {formData.comment.length}/500 characters
            </p>
          </div>
        </div>

        {errors.submit && (
          <div className="bg-error/5 border border-error/20 rounded-lg p-3">
            <p className="text-sm text-error">{errors.submit}</p>
          </div>
        )}

        <div className="flex gap-3 pt-2">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <div className="flex items-center gap-2">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                  <ApperIcon name="Loader2" size={16} />
                </motion.div>
                Submitting...
              </div>
            ) : (
              'Submit Review'
            )}
          </Button>
          
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setFormData({ guestName: '', rating: 0, comment: '' });
              setErrors({});
            }}
            disabled={isSubmitting}
          >
            Clear
          </Button>
        </div>
      </form>
    </Card>
  );
}

export default ReviewForm;