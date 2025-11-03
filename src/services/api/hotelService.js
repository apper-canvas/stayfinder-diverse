import hotelsData from "@/services/mockData/hotels.json";

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class HotelService {
  async getAll() {
    await delay(300);
    return [...hotelsData];
  }

  async getById(id) {
    await delay(200);
    const hotel = hotelsData.find(h => h.Id === parseInt(id));
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    return { ...hotel };
  }

async search(query) {
    await delay(400);
    
    const { destination, checkInDate, checkOutDate, adults, children } = query;
    
    if (!destination) {
      return [...hotelsData];
    }

    // Filter hotels based on destination (city or location)
    const filtered = hotelsData.filter(hotel => 
      hotel.location.toLowerCase().includes(destination.toLowerCase()) ||
      hotel.city.toLowerCase().includes(destination.toLowerCase()) ||
      hotel.country.toLowerCase().includes(destination.toLowerCase())
    );

    // In a real app, this would also filter by availability based on dates
    // and room capacity based on guests
    
    return filtered.map(hotel => ({ ...hotel }));
  }

  async filterHotels(hotels, filters) {
    await delay(200); // Simulate processing time
    
    if (!filters) return [...hotels];

    let filtered = [...hotels];

    // Price range filter
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      filtered = filtered.filter(hotel => 
        hotel.pricePerNight >= minPrice && hotel.pricePerNight <= maxPrice
      );
    }

    // Star rating filter
    if (filters.starRating && filters.starRating.length > 0) {
      filtered = filtered.filter(hotel => 
        filters.starRating.includes(hotel.starRating)
      );
    }

    // Amenities filter
    if (filters.amenities && filters.amenities.length > 0) {
      filtered = filtered.filter(hotel => {
        // Mock amenity mapping based on hotel properties
        const hotelAmenities = [];
        
        // Basic amenity inference from hotel data
        if (hotel.starRating >= 3) hotelAmenities.push('wifi');
        if (hotel.starRating >= 4) hotelAmenities.push('pool');
        if (hotel.starRating >= 2) hotelAmenities.push('parking');
        if (hotel.starRating >= 3) hotelAmenities.push('restaurant');

        // Check if hotel has all selected amenities
        return filters.amenities.every(amenity => hotelAmenities.includes(amenity));
      });
    }

    return filtered;
  }

  async getFeatured(limit = 6) {
    await delay(250);
    
    // Return highest-rated hotels
    const featured = [...hotelsData]
      .sort((a, b) => b.starRating - a.starRating)
      .slice(0, limit);
      
    return featured;
  }

  async getByDestination(destination, limit = 12) {
    await delay(300);
    
    const filtered = hotelsData.filter(hotel =>
      hotel.city.toLowerCase().includes(destination.toLowerCase()) ||
      hotel.location.toLowerCase().includes(destination.toLowerCase())
    ).slice(0, limit);
    
    return filtered.map(hotel => ({ ...hotel }));
  }

  async create(hotel) {
    await delay(300);
    
    const newHotel = {
      ...hotel,
      Id: Math.max(...hotelsData.map(h => h.Id)) + 1
    };
    
    hotelsData.push(newHotel);
    return { ...newHotel };
  }

  async update(id, hotelData) {
    await delay(300);
    
    const index = hotelsData.findIndex(h => h.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Hotel not found");
    }
    
    hotelsData[index] = { ...hotelsData[index], ...hotelData };
    return { ...hotelsData[index] };
  }

  async delete(id) {
    await delay(200);
    
    const index = hotelsData.findIndex(h => h.Id === parseInt(id));
    if (index === -1) {
      throw new Error("Hotel not found");
    }
    
    const deleted = hotelsData.splice(index, 1)[0];
    return { ...deleted };
  }
}

const hotelService = new HotelService();
export default hotelService;