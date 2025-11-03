import { motion } from "framer-motion";
import { useState } from "react";
import ApperIcon from "@/components/ApperIcon";

const Destinations = () => {
  const [selectedRegion, setSelectedRegion] = useState("all");

  const destinations = [
    {
      id: 1,
      name: "Miami Beach",
      region: "southeast",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Pristine beaches and vibrant nightlife",
      hotelCount: 150
    },
    {
      id: 2,
      name: "New York City",
      region: "northeast",
      image: "https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "The city that never sleeps",
      hotelCount: 300
    },
    {
      id: 3,
      name: "San Francisco",
      region: "west",
      image: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Golden Gate and tech innovation",
      hotelCount: 200
    },
    {
      id: 4,
      name: "Chicago",
      region: "midwest",
      image: "https://images.unsplash.com/photo-1477414956199-7dafc86a4f1a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Architecture and deep-dish pizza",
      hotelCount: 180
    },
    {
      id: 5,
      name: "Las Vegas",
      region: "west",
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Entertainment capital of the world",
      hotelCount: 250
    },
    {
      id: 6,
      name: "Charleston",
      region: "southeast",
      image: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
      description: "Southern charm and historic beauty",
      hotelCount: 120
    }
  ];

  const regions = [
    { id: "all", name: "All Destinations", icon: "Globe" },
    { id: "west", name: "West Coast", icon: "Mountain" },
    { id: "southeast", name: "Southeast", icon: "Palmtree" },
    { id: "northeast", name: "Northeast", icon: "Building" },
    { id: "midwest", name: "Midwest", icon: "Home" }
  ];

  const filteredDestinations = selectedRegion === "all" 
    ? destinations 
    : destinations.filter(d => d.region === selectedRegion);

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary-600 to-accent py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4">
              Explore Amazing Destinations
            </h1>
            <p className="text-lg text-white/90 max-w-2xl mx-auto">
              Discover incredible places to stay across the United States, from bustling cities to serene beaches.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-white border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {regions.map((region) => (
              <motion.button
                key={region.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedRegion(region.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all duration-200 ${
                  selectedRegion === region.id
                    ? "bg-gradient-to-r from-primary to-primary-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                <ApperIcon name={region.icon} className="w-4 h-4" />
                {region.name}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations Grid */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredDestinations.map((destination, index) => (
              <motion.div
                key={destination.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -8 }}
                className="group cursor-pointer"
              >
                <div className="bg-white rounded-xl shadow-card-rest group-hover:shadow-card-hover transition-shadow duration-300 overflow-hidden">
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={destination.image}
                      alt={destination.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    <div className="absolute bottom-4 left-4 text-white">
                      <h3 className="font-display text-xl font-bold">
                        {destination.name}
                      </h3>
                      <p className="text-white/90 text-sm">
                        {destination.hotelCount} hotels available
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <p className="text-gray-600 mb-4">
                      {destination.description}
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white py-3 rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-2"
                    >
                      <ApperIcon name="Search" className="w-4 h-4" />
                      Search Hotels
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Destinations;