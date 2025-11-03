import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";
import { cn } from "@/utils/cn";

const GuestSelector = ({ adults, children, onAdultsChange, onChildrenChange, error }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  // Ensure values are numbers to prevent object rendering
  const adultsCount = typeof adults === 'number' ? adults : parseInt(adults) || 1;
  const childrenCount = typeof children === 'number' ? children : parseInt(children) || 0;
  
  const totalGuests = adultsCount + childrenCount;
  const guestText = totalGuests === 1 ? "1 guest" : `${totalGuests} guests`;
const adjustCount = (type, increment) => {
    if (type === "adults") {
      const newValue = Math.max(1, adultsCount + increment);
      onAdultsChange && onAdultsChange(newValue);
    } else {
      const newValue = Math.max(0, Math.min(6, childrenCount + increment));
      onChildrenChange && onChildrenChange(newValue);
    }
  };

  return (
    <div className="relative w-full">
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Guests
      </label>
      
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-4 py-3 border-2 border-gray-200 rounded-lg focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors duration-200 bg-white text-gray-900 min-h-[48px] text-body-md flex items-center justify-between",
          error && "border-error focus:border-error focus:ring-error/20",
          isOpen && "border-primary ring-2 ring-primary/20"
        )}
      >
        <span>{guestText}</span>
        <ApperIcon 
          name="ChevronDown" 
          className={cn(
            "w-5 h-5 text-gray-400 transition-transform duration-200",
            isOpen && "transform rotate-180"
          )} 
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
          >
            {/* Adults */}
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium text-gray-900">Adults</div>
                <div className="text-sm text-gray-500">Ages 18+</div>
              </div>
              <div className="flex items-center gap-3">
<button
                  type="button"
                  onClick={() => adjustCount("adults", -1)}
                  disabled={adultsCount <= 1}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
                >
                  <ApperIcon name="Minus" className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{String(adultsCount)}</span>
                <button
type="button"
                  onClick={() => adjustCount("adults", 1)}
                  disabled={adultsCount >= 8}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                </button>
              </div>
            </div>

            <hr className="my-2" />

            {/* Children */}
            <div className="flex items-center justify-between py-2">
              <div>
                <div className="font-medium text-gray-900">Children</div>
                <div className="text-sm text-gray-500">Ages 0-17</div>
              </div>
              <div className="flex items-center gap-3">
<button
                  type="button"
                  onClick={() => adjustCount("children", -1)}
                  disabled={childrenCount <= 0}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
                >
                  <ApperIcon name="Minus" className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{String(childrenCount)}</span>
                <button
type="button"
                  onClick={() => adjustCount("children", 1)}
                  disabled={childrenCount >= 6}
                  className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:border-primary hover:text-primary transition-colors"
                >
                  <ApperIcon name="Plus" className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="mt-4 pt-2 border-t">
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="w-full py-2 text-center text-primary font-medium hover:bg-primary/5 rounded transition-colors"
              >
                Done
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Click outside to close */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
    </div>
  );
};

export default GuestSelector;