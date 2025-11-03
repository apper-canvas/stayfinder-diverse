import { useState, useEffect } from "react";
import hotelService from "@/services/api/hotelService";

export const useHotels = (autoLoad = true) => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadHotels = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await hotelService.getFeatured();
      setHotels(data);
    } catch (err) {
      setError(err.message || "Failed to load hotels");
      console.error("Error loading hotels:", err);
    } finally {
      setLoading(false);
    }
  };

  const searchHotels = async (searchQuery) => {
    try {
      setLoading(true);
      setError("");
      const data = await hotelService.search(searchQuery);
      setHotels(data);
      return data;
    } catch (err) {
      setError(err.message || "Search failed");
      console.error("Error searching hotels:", err);
      return [];
    } finally {
      setLoading(false);
    }
  };

  const getHotelById = async (id) => {
    try {
      const hotel = await hotelService.getById(id);
      return hotel;
    } catch (err) {
      console.error("Error getting hotel by ID:", err);
      throw err;
    }
  };

  useEffect(() => {
    if (autoLoad) {
      loadHotels();
    }
  }, [autoLoad]);

  return {
    hotels,
    loading,
    error,
    loadHotels,
    searchHotels,
    getHotelById,
    retry: loadHotels
  };
};

export default useHotels;