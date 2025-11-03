import { motion } from "framer-motion";
import ApperIcon from "@/components/ApperIcon";

const Empty = ({ message = "No hotels found", action }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16 px-4 text-center"
    >
      <div className="bg-gradient-to-br from-primary/10 to-accent/20 rounded-full p-8 mb-6">
        <ApperIcon 
          name="MapPin" 
          className="w-16 h-16 text-primary"
        />
      </div>
      
      <h3 className="font-display text-heading-md text-gray-900 mb-2">
        {message}
      </h3>
      
      <p className="text-body-md text-gray-600 mb-8 max-w-lg">
        Try adjusting your search criteria or explore different destinations to find the perfect hotel for your stay.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <ApperIcon name="Search" className="w-4 h-4" />
          Search Again
        </motion.button>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.location.reload()}
          className="bg-white hover:bg-gray-50 text-primary border-2 border-primary hover:border-primary-600 px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
        >
          <ApperIcon name="Home" className="w-4 h-4" />
          Browse Featured
        </motion.button>
      </div>
    </motion.div>
  );
};

export default Empty;