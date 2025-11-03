import { motion } from "framer-motion";
import SearchForm from "@/components/molecules/SearchForm";

const HeroSection = ({ onSearch, loading }) => {
  return (
    <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <div 
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')"
          }}
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight">
            Find Your Perfect
            <span className="bg-gradient-to-r from-accent via-primary to-accent bg-clip-text text-transparent block">
              Hotel Stay
            </span>
          </h1>
          <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed">
            Discover amazing hotels around the world with the best prices and premium amenities for your perfect getaway.
          </p>
        </motion.div>

        {/* Search Form */}
        <SearchForm onSearch={onSearch} loading={loading} />
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{ 
          y: [0, -10, 0],
          opacity: [0.5, 0.8, 0.5]
        }}
        transition={{ 
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute top-20 left-10 w-20 h-20 bg-white/10 rounded-full backdrop-blur-sm hidden lg:block"
      />
      
      <motion.div
        animate={{ 
          y: [0, 15, 0],
          opacity: [0.3, 0.6, 0.3]
        }}
        transition={{ 
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1
        }}
        className="absolute top-40 right-20 w-16 h-16 bg-accent/20 rounded-full backdrop-blur-sm hidden lg:block"
      />
    </section>
  );
};

export default HeroSection;