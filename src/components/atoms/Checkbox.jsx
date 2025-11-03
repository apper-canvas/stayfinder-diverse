import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Checkbox = ({ 
  checked = false, 
  onChange, 
  children, 
  className,
  disabled = false,
  ...props 
}) => {
  return (
    <label className={cn(
      "flex items-center space-x-3 cursor-pointer select-none",
      disabled && "cursor-not-allowed opacity-50",
      className
    )}>
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          disabled={disabled}
          className="sr-only"
          {...props}
        />
        <motion.div
          className={cn(
            "w-5 h-5 rounded border-2 flex items-center justify-center transition-colors",
            checked 
              ? "bg-primary-500 border-primary-500" 
              : "bg-white border-gray-300 hover:border-primary-300"
          )}
          whileTap={{ scale: 0.95 }}
          animate={{ 
            backgroundColor: checked ? "#0066CC" : "#ffffff",
            borderColor: checked ? "#0066CC" : "#d1d5db"
          }}
        >
          <motion.div
            initial={false}
            animate={{ 
              scale: checked ? 1 : 0,
              opacity: checked ? 1 : 0
            }}
            transition={{ duration: 0.15 }}
          >
            <ApperIcon name="Check" size={12} className="text-white" />
          </motion.div>
        </motion.div>
      </div>
      
      {children && (
        <span className={cn(
          "text-sm font-medium text-gray-900",
          disabled && "text-gray-400"
        )}>
          {children}
        </span>
      )}
    </label>
  );
};

export default Checkbox;