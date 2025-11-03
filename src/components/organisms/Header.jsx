import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { label: "Home", href: "/" },
    { label: "Destinations", href: "/destinations" },
    { label: "Deals", href: "/deals" },
    { label: "Help", href: "/help" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm shadow-nav">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="bg-gradient-to-r from-primary to-accent p-2 rounded-lg group-hover:shadow-lg transition-shadow">
              <ApperIcon name="Building" className="w-6 h-6 text-white" />
            </div>
            <span className="font-display text-heading-md text-gray-900 group-hover:text-primary transition-colors">
              StayFinder
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.href}
                className="text-gray-700 hover:text-primary font-medium transition-colors duration-200 relative group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-primary to-accent transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            <button className="text-gray-700 hover:text-primary font-medium transition-colors">
              Sign In
            </button>
            <button className="bg-gradient-to-r from-primary to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-lg hover:shadow-xl">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 text-gray-700 hover:text-primary transition-colors"
          >
            <ApperIcon 
              name={isMenuOpen ? "X" : "Menu"} 
              className="w-6 h-6" 
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-white border-t border-gray-100"
          >
            <div className="px-4 py-4 space-y-2">
              {navItems.map((item) => (
                <Link
                  key={item.label}
                  to={item.href}
                  onClick={() => setIsMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  {item.label}
                </Link>
              ))}
              <hr className="my-2" />
              <div className="space-y-2">
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full text-left px-4 py-3 text-gray-700 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                >
                  Sign In
                </button>
                <button 
                  onClick={() => setIsMenuOpen(false)}
                  className="block w-full bg-gradient-to-r from-primary to-primary-600 text-white px-4 py-3 rounded-lg font-medium transition-all duration-200"
                >
                  Sign Up
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;