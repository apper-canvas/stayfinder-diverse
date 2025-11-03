import { useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import Input from "@/components/atoms/Input";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";
import GuestSelector from "./GuestSelector";
import { format, addDays, isBefore, startOfDay } from "date-fns";

const SearchForm = ({ onSearch, loading = false }) => {
  const [searchData, setSearchData] = useState({
    destination: "",
    checkInDate: format(new Date(), "yyyy-MM-dd"),
    checkOutDate: format(addDays(new Date(), 1), "yyyy-MM-dd"),
    adults: 2,
    children: 0
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    const newErrors = {};
    const today = startOfDay(new Date());
    const checkIn = startOfDay(new Date(searchData.checkInDate));
    const checkOut = startOfDay(new Date(searchData.checkOutDate));

    if (!searchData.destination.trim()) {
      newErrors.destination = "Please enter a destination";
    }

    if (isBefore(checkIn, today)) {
      newErrors.checkInDate = "Check-in date cannot be in the past";
    }

    if (!isBefore(checkIn, checkOut)) {
      newErrors.checkOutDate = "Check-out must be after check-in date";
    }

    if (searchData.adults < 1) {
      newErrors.guests = "At least 1 adult is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error("Please check your search criteria");
      return;
    }

    const totalGuests = searchData.adults + searchData.children;
    onSearch({
      ...searchData,
      totalGuests
    });

    // Store search history
    const searchHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]");
    const newSearch = {
      ...searchData,
      timestamp: new Date().toISOString()
    };
    
    const updatedHistory = [newSearch, ...searchHistory.slice(0, 4)];
    localStorage.setItem("searchHistory", JSON.stringify(updatedHistory));
  };

  const handleInputChange = (field, value) => {
    setSearchData(prev => ({ ...prev, [field]: value }));
    
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      onSubmit={handleSubmit}
      className="bg-white rounded-xl shadow-form p-6 w-full max-w-5xl mx-auto backdrop-blur-sm"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 lg:gap-2">
        {/* Destination */}
        <div className="lg:col-span-2">
          <Input
            label="Destination"
            placeholder="Where are you going?"
            value={searchData.destination}
            onChange={(e) => handleInputChange("destination", e.target.value)}
            error={errors.destination}
          />
        </div>

        {/* Check-in Date */}
        <div>
          <Input
            label="Check-in"
            type="date"
            value={searchData.checkInDate}
            onChange={(e) => handleInputChange("checkInDate", e.target.value)}
            min={format(new Date(), "yyyy-MM-dd")}
            error={errors.checkInDate}
          />
        </div>

        {/* Check-out Date */}
        <div>
          <Input
            label="Check-out"
            type="date"
            value={searchData.checkOutDate}
            onChange={(e) => handleInputChange("checkOutDate", e.target.value)}
            min={searchData.checkInDate}
            error={errors.checkOutDate}
          />
        </div>

        {/* Guests */}
        <div>
          <GuestSelector
            adults={searchData.adults}
            children={searchData.children}
            onAdultsChange={(value) => handleInputChange("adults", value)}
            onChildrenChange={(value) => handleInputChange("children", value)}
            error={errors.guests}
          />
        </div>
      </div>

      <div className="mt-6 flex justify-center">
        <Button
          type="submit"
          size="lg"
          loading={loading}
          className="w-full sm:w-auto min-w-[200px]"
        >
          <ApperIcon name="Search" className="w-5 h-5" />
          Search Hotels
        </Button>
      </div>
    </motion.form>
  );
};

export default SearchForm;