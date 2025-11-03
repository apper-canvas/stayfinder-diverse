import React, { useState } from "react";
import { toast } from "react-toastify";
import HeroSection from "@/components/organisms/HeroSection";
import HotelsGrid from "@/components/organisms/HotelsGrid";
import useHotels from "@/hooks/useHotels";

const Home = () => {
  const { hotels, loading, error, searchHotels, retry } = useHotels(true);
  const [currentSearchQuery, setCurrentSearchQuery] = useState(null);

const handleSearch = async (searchQuery) => {
    try {
      setCurrentSearchQuery(searchQuery);
      const results = await searchHotels(searchQuery);
      
      if (results.length === 0) {
        toast.info(`No hotels found for "${searchQuery.destination}"`);
      } else {
        toast.success(`Found ${results.length} hotel${results.length === 1 ? '' : 's'} for your search`);
      }
    } catch (err) {
      toast.error("Search failed. Please try again.");
    }
  };

  const handleViewDetails = (hotel) => {
    // Navigate to hotel details page or show hotel details modal
    console.log("Viewing details for hotel:", hotel);
    // TODO: Implement navigation to hotel details page
    // Example: navigate(`/hotels/${hotel.id}`)
  };
  return (
    <div className="min-h-screen">
      <HeroSection onSearch={handleSearch} loading={loading} />
      
      <HotelsGrid
        hotels={hotels}
        loading={loading}
        error={error}
        onRetry={retry}
        onViewDetails={handleViewDetails}
        searchQuery={currentSearchQuery}
      />

    </div>
  );
};

export default Home;