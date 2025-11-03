import { motion } from "framer-motion";
import HotelCard from "@/components/molecules/HotelCard";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";

const HotelsGrid = ({ hotels, loading, error, onRetry, onViewDetails, searchQuery }) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={onRetry} />;
  }

  if (!hotels || hotels.length === 0) {
    const emptyMessage = searchQuery 
      ? `No hotels found for "${searchQuery.destination}"`
      : "No hotels available";
    return <Empty message={emptyMessage} />;
  }

  return (
    <section className="py-12 bg-background">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h2 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {searchQuery ? "Search Results" : "Featured Hotels"}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {searchQuery 
              ? `Found ${hotels.length} hotel${hotels.length === 1 ? '' : 's'} for your search`
              : "Discover handpicked hotels with exceptional service and premium amenities"
            }
          </p>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {hotels.map((hotel) => (
            <motion.div key={hotel.Id} variants={item}>
              <HotelCard 
                hotel={hotel} 
                onViewDetails={onViewDetails}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Load More Button (for future pagination) */}
        {hotels.length >= 6 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-12"
          >
            <button className="bg-white hover:bg-gray-50 text-primary border-2 border-primary hover:border-primary-600 px-8 py-4 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
              Load More Hotels
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
};

export default HotelsGrid;