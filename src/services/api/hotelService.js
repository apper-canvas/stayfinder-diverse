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
    
    // Enhanced hotel data with additional details for the details page
    const enhancedHotel = {
      ...hotel,
      images: [
        hotel.imageUrl,
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80"
      ],
      amenities: [
        "Free WiFi", "Swimming Pool", "Fitness Center", "Spa & Wellness", 
        "Restaurant", "Bar", "Room Service", "Valet Parking", 
        "Air Conditioning", "Laundry Service", "Business Center", "Pet Friendly"
      ],
      roomTypes: [
        {
          name: "Standard Room",
          description: "Comfortable room with modern amenities and city views",
          pricePerNight: hotel.pricePerNight,
          features: ["Queen Bed", "City View", "Free WiFi", "Air Conditioning"]
        },
        {
          name: "Deluxe Room", 
          description: "Spacious room with premium furnishing and enhanced amenities",
          pricePerNight: Math.floor(hotel.pricePerNight * 1.3),
          features: ["King Bed", "Ocean View", "Balcony", "Mini Bar", "Bathrobes"]
        },
        {
          name: "Suite",
          description: "Luxury suite with separate living area and premium services", 
          pricePerNight: Math.floor(hotel.pricePerNight * 1.8),
          features: ["King Bed", "Living Room", "Premium View", "Butler Service", "Complimentary Breakfast"]
        }
      ],
      reviews: [
        {
          name: "Sarah Johnson",
          rating: 5,
          date: "2024-01-15",
          comment: "Absolutely wonderful stay! The service was exceptional and the room was beautifully appointed. The location is perfect for exploring the city."
        },
        {
          name: "Michael Chen",
          rating: 4,
          date: "2024-01-10", 
          comment: "Great hotel with fantastic amenities. The pool area is amazing and staff were very helpful. Only minor issue was the breakfast could be improved."
        },
        {
          name: "Emily Davis",
          rating: 5,
          date: "2024-01-08",
          comment: "This hotel exceeded all expectations. The spa treatments were incredible and the room service was prompt. Definitely coming back!"
        }
      ]
    };
    
    return enhancedHotel;
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

async createBooking(hotelId, bookingData) {
    await delay(800);
    
    const hotel = hotelsData.find(h => h.Id === parseInt(hotelId));
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    
    // In a real application, this would create a booking record
    // For now, we'll just return a success response with booking details
    const confirmationNumber = `BK${Date.now().toString().slice(-6)}${Math.random().toString(36).substr(2, 4).toUpperCase()}`;
    
    return {
      confirmationNumber,
      hotel,
      bookingDetails: bookingData,
      status: 'confirmed',
      bookingDate: new Date().toISOString()
    };
  }

  async addReview(hotelId, reviewData) {
    await delay(500);
    
    const { rating, comment, guestName } = reviewData;
    
    // Validation
    if (!rating || rating < 1 || rating > 5) {
      throw new Error("Rating must be between 1 and 5 stars");
    }
    
    if (!comment || comment.trim().length < 10) {
      throw new Error("Comment must be at least 10 characters long");
    }
    
    if (!guestName || guestName.trim().length < 2) {
      throw new Error("Guest name is required");
    }
    
    const hotel = hotelsData.find(h => h.Id === parseInt(hotelId));
    if (!hotel) {
      throw new Error("Hotel not found");
    }
    
    // Create new review
    const newReview = {
      name: guestName.trim(),
      rating: parseInt(rating),
      comment: comment.trim(),
      date: new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      })
    };
    
    // Add review to hotel (in real app, this would update the database)
    hotel.reviews = hotel.reviews || [];
    hotel.reviews.unshift(newReview); // Add to beginning
    
    // Update overall rating (simple average)
    const totalRating = hotel.reviews.reduce((sum, review) => sum + review.rating, 0);
    hotel.rating = Math.round((totalRating / hotel.reviews.length) * 10) / 10;
    
    return {
      success: true,
      review: newReview,
      newOverallRating: hotel.rating,
      totalReviews: hotel.reviews.length
    };
  }
}

const hotelService = new HotelService();
export default hotelService;