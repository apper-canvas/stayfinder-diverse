import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="bg-gradient-to-br from-error/10 to-error/20 rounded-full p-6 mb-6">
        <ApperIcon 
          name="AlertCircle" 
          className="w-12 h-12 text-error"
        />
      </div>
      
      <h3 className="font-display text-heading-md text-gray-900 mb-2">
        Oops! Something went wrong
      </h3>
      
      <p className="text-body-md text-gray-600 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onRetry}
          className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center gap-2"
        >
          <ApperIcon name="RefreshCcw" className="w-4 h-4" />
          Try Again
        </motion.button>
      )}
    </motion.div>
  );
};

export default Error;