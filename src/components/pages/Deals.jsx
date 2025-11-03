import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import ApperIcon from "@/components/ApperIcon";
import hotelService from "@/services/api/hotelService";
import HotelCard from "@/components/molecules/HotelCard";
import Loading from "@/components/ui/Loading";

const Deals = () => {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDeals = async () => {
      try {
        const hotels = await hotelService.getAll();
        // Create mock deals with discounted prices
        const dealsData = hotels.slice(0, 8).map((hotel) => ({
          ...hotel,
          originalPrice: hotel.pricePerNight,
          pricePerNight: Math.round(hotel.pricePerNight * 0.75), // 25% off
          discount: 25,
          dealType: hotel.starRating >= 4 ? "Flash Sale" : "Early Bird",
          validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toDateString()
        }));
        setDeals(dealsData);
      } catch (err) {
        console.error("Error loading deals:", err);
      } finally {
        setLoading(false);
      }
    };

    loadDeals();
  }, []);

  const dealTypes = [
    {
      icon: "Zap",
      title: "Flash Sales",
      description: "Limited time offers with huge savings",
      color: "from-error to-warning"
    },
    {
      icon: "Clock",
      title: "Early Bird",
      description: "Book in advance for better rates",
      color: "from-success to-info"
    },
    {
      icon: "Users",
      title: "Group Discounts",
      description: "Special rates for group bookings",
      color: "from-accent to-primary"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="pt-20">
          <Loading />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-success via-info to-primary py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Exclusive Hotel Deals
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Save big on your next getaway with our handpicked deals and special offers.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Deal Types */}
      <section className="py-12 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Types of Deals
            </h2>
            <p className="text-gray-600">
              Different ways to save on your perfect hotel stay
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {dealTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className={`w-16 h-16 bg-gradient-to-r ${type.color} rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <ApperIcon name={type.icon} className="w-8 h-8 text-white" />
                </div>
                <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
                  {type.title}
                </h3>
                <p className="text-gray-600">
                  {type.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Deals */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="font-display text-3xl font-bold text-gray-900 mb-4">
              Featured Deals
            </h2>
            <p className="text-gray-600">
              Don't miss out on these incredible savings
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {deals.map((deal, index) => (
              <motion.div
                key={deal.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="relative"
              >
                {/* Deal Badge */}
                <div className="absolute top-4 left-4 z-10 bg-gradient-to-r from-error to-warning text-white px-3 py-1 rounded-full text-sm font-bold">
                  {deal.discount}% OFF
                </div>
                
                <div className="bg-white rounded-lg shadow-card-rest hover:shadow-card-hover transition-shadow duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={deal.imageUrl}
                      alt={deal.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="bg-gradient-to-r from-success to-info text-white text-xs px-2 py-1 rounded-full font-medium">
                        {deal.dealType}
                      </span>
                      <span className="text-xs text-gray-500">
                        Valid until {deal.validUntil}
                      </span>
                    </div>
                    
                    <h3 className="font-display text-xl font-bold text-gray-900 mb-2">
                      {deal.name}
                    </h3>
                    
                    <div className="flex items-center gap-1 text-gray-600 mb-4">
                      <ApperIcon name="MapPin" className="w-4 h-4" />
                      <span className="text-sm">{deal.location}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-gray-900">
                            ${deal.pricePerNight}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            ${deal.originalPrice}
                          </span>
                        </div>
                        <span className="text-xs text-gray-500">per night</span>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                      >
                        Book Deal
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 bg-gradient-to-r from-primary to-accent">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="font-display text-3xl font-bold text-white mb-4">
              Don't Miss Out on These Deals!
            </h2>
            <p className="text-lg text-white/90 mb-8">
              Limited time offers that could save you hundreds on your next vacation.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-white text-primary hover:bg-gray-50 px-8 py-4 rounded-lg font-bold text-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <ApperIcon name="Bell" className="w-5 h-5 mr-2 inline" />
              Get Deal Alerts
            </motion.button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Deals;