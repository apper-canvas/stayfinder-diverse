class HotelService {
  constructor() {
    // Initialize ApperClient
    this.apperClient = null;
    this.initializeClient();
  }

  initializeClient() {
    if (typeof window !== 'undefined' && window.ApperSDK) {
      const { ApperClient } = window.ApperSDK;
      this.apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
    }
  }

  async getAll() {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "country_c"}},
          {"field": {"Name": "star_rating_c"}},
          {"field": {"Name": "price_per_night_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "coordinates_c"}}
        ],
        orderBy: [{"fieldName": "star_rating_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords('hotel_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      // Transform database fields to UI format
      return response.data.map(hotel => ({
        Id: hotel.Id,
        name: hotel.name_c || hotel.Name || '',
        location: hotel.location_c || '',
        city: hotel.city_c || '',
        country: hotel.country_c || '',
        starRating: parseInt(hotel.star_rating_c) || 3,
        pricePerNight: parseFloat(hotel.price_per_night_c) || 0,
        currency: hotel.currency_c || 'USD',
        imageUrl: hotel.image_url_c || '',
images: hotel.images_c ? (() => {
          try {
            const parsed = JSON.parse(hotel.images_c);
            return Array.isArray(parsed) ? parsed : [hotel.images_c];
          } catch {
            return [hotel.images_c];
          }
        })() : [hotel.image_url_c || ''],
        amenities: hotel.amenities_c ? (() => {
          try {
            const parsed = JSON.parse(hotel.amenities_c);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })() : [],
        description: hotel.description_c || '',
        coordinates: hotel.coordinates_c ? JSON.parse(hotel.coordinates_c) : { lat: 0, lng: 0 }
      }));
    } catch (error) {
      console.error('Error fetching hotels:', error);
      return [];
    }
  }

  async getById(id) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "country_c"}},
          {"field": {"Name": "star_rating_c"}},
          {"field": {"Name": "price_per_night_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "description_c"}},
          {"field": {"Name": "coordinates_c"}},
          {"field": {"Name": "room_types_c"}},
          {"field": {"Name": "reviews_c"}}
        ]
      };
      
      const response = await this.apperClient.getRecordById('hotel_c', parseInt(id), params);
      
      if (!response.data) {
        throw new Error("Hotel not found");
      }
      
      const hotel = response.data;
      
      // Transform database fields to UI format with enhancements
      const transformedHotel = {
        Id: hotel.Id,
        name: hotel.name_c || hotel.Name || '',
        location: hotel.location_c || '',
        city: hotel.city_c || '',
        country: hotel.country_c || '',
        starRating: parseInt(hotel.star_rating_c) || 3,
        pricePerNight: parseFloat(hotel.price_per_night_c) || 0,
        currency: hotel.currency_c || 'USD',
        imageUrl: hotel.image_url_c || '',
images: hotel.images_c ? (() => {
          try {
            const parsed = JSON.parse(hotel.images_c);
            return Array.isArray(parsed) ? parsed : [hotel.images_c];
          } catch {
            return [hotel.images_c];
          }
        })() : [hotel.image_url_c || ''],
        amenities: hotel.amenities_c ? (() => {
          try {
            const parsed = JSON.parse(hotel.amenities_c);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })() : [
          "Free WiFi", "Swimming Pool", "Fitness Center", "Spa & Wellness", 
          "Restaurant", "Bar", "Room Service", "Valet Parking", 
          "Air Conditioning", "Laundry Service", "Business Center"
        ],
        description: hotel.description_c || 'A beautiful hotel with modern amenities and exceptional service.',
        coordinates: hotel.coordinates_c ? JSON.parse(hotel.coordinates_c) : { lat: 0, lng: 0 },
        roomTypes: hotel.room_types_c ? JSON.parse(hotel.room_types_c) : [
          {
            name: "Standard Room",
            description: "Comfortable room with modern amenities and city views",
            pricePerNight: parseFloat(hotel.price_per_night_c) || 150,
            features: ["Queen Bed", "City View", "Free WiFi", "Air Conditioning"]
          },
          {
            name: "Deluxe Room", 
            description: "Spacious room with premium furnishing and enhanced amenities",
            pricePerNight: Math.floor((parseFloat(hotel.price_per_night_c) || 150) * 1.3),
            features: ["King Bed", "Ocean View", "Balcony", "Mini Bar", "Bathrobes"]
          }
        ],
        reviews: hotel.reviews_c ? JSON.parse(hotel.reviews_c) : []
      };
      
      return transformedHotel;
    } catch (error) {
      console.error('Error fetching hotel by ID:', error);
      throw new Error("Hotel not found");
    }
  }

  async search(query) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const { destination } = query;
      
      let whereConditions = [];
      
      if (destination) {
        whereConditions = [
          {"FieldName": "location_c", "Operator": "Contains", "Values": [destination]}
        ];
      }
      
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "country_c"}},
          {"field": {"Name": "star_rating_c"}},
          {"field": {"Name": "price_per_night_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "description_c"}}
        ],
        where: whereConditions,
        orderBy: [{"fieldName": "star_rating_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": 50, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords('hotel_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(hotel => ({
        Id: hotel.Id,
        name: hotel.name_c || hotel.Name || '',
        location: hotel.location_c || '',
        city: hotel.city_c || '',
        country: hotel.country_c || '',
        starRating: parseInt(hotel.star_rating_c) || 3,
        pricePerNight: parseFloat(hotel.price_per_night_c) || 0,
        currency: hotel.currency_c || 'USD',
imageUrl: hotel.image_url_c || '',
        images: hotel.images_c ? (() => {
          try {
            const parsed = JSON.parse(hotel.images_c);
            return Array.isArray(parsed) ? parsed : [hotel.images_c];
          } catch {
            return [hotel.images_c];
          }
        })() : [hotel.image_url_c || ''],
        amenities: hotel.amenities_c ? JSON.parse(hotel.amenities_c) : [],
        description: hotel.description_c || ''
      }));
    } catch (error) {
      console.error('Error searching hotels:', error);
      return [];
    }
  }

  async getFeatured(limit = 6) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        fields: [
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "location_c"}},
          {"field": {"Name": "city_c"}},
          {"field": {"Name": "country_c"}},
          {"field": {"Name": "star_rating_c"}},
          {"field": {"Name": "price_per_night_c"}},
          {"field": {"Name": "currency_c"}},
          {"field": {"Name": "image_url_c"}},
          {"field": {"Name": "images_c"}},
          {"field": {"Name": "amenities_c"}},
          {"field": {"Name": "description_c"}}
        ],
        orderBy: [{"fieldName": "star_rating_c", "sorttype": "DESC"}],
        pagingInfo: {"limit": limit, "offset": 0}
      };
      
      const response = await this.apperClient.fetchRecords('hotel_c', params);
      
      if (!response.success) {
        console.error(response.message);
        return [];
      }
      
      return response.data.map(hotel => ({
        Id: hotel.Id,
        name: hotel.name_c || hotel.Name || '',
        location: hotel.location_c || '',
        city: hotel.city_c || '',
        country: hotel.country_c || '',
        starRating: parseInt(hotel.star_rating_c) || 3,
        pricePerNight: parseFloat(hotel.price_per_night_c) || 0,
        currency: hotel.currency_c || 'USD',
imageUrl: hotel.image_url_c || '',
        images: hotel.images_c ? (() => {
          try {
            const parsed = JSON.parse(hotel.images_c);
            return Array.isArray(parsed) ? parsed : [hotel.images_c];
          } catch {
            return [hotel.images_c];
          }
        })() : [hotel.image_url_c || ''],
        amenities: hotel.amenities_c ? (() => {
          try {
            const parsed = JSON.parse(hotel.amenities_c);
            return Array.isArray(parsed) ? parsed : [];
          } catch {
            return [];
          }
        })() : [],
        description: hotel.description_c || ''
      }));
    } catch (error) {
      console.error('Error fetching featured hotels:', error);
      return [];
    }
  }

  async addReview(hotelId, reviewData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
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
      
      // Get current hotel
      const hotel = await this.getById(hotelId);
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
      
      // Update reviews in hotel
      const updatedReviews = [newReview, ...(hotel.reviews || [])];
      
      // Update hotel record
      const updateParams = {
        records: [{
          Id: parseInt(hotelId),
          reviews_c: JSON.stringify(updatedReviews)
        }]
      };
      
      const response = await this.apperClient.updateRecord('hotel_c', updateParams);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return {
        success: true,
        review: newReview,
        totalReviews: updatedReviews.length
      };
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  }

  // Additional methods for compatibility
  async create(hotelData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        records: [{
          name_c: hotelData.name || '',
          location_c: hotelData.location || '',
          city_c: hotelData.city || '',
          country_c: hotelData.country || '',
          star_rating_c: parseInt(hotelData.starRating) || 3,
          price_per_night_c: parseFloat(hotelData.pricePerNight) || 0,
          currency_c: hotelData.currency || 'USD',
          image_url_c: hotelData.imageUrl || '',
          images_c: JSON.stringify(hotelData.images || []),
          amenities_c: JSON.stringify(hotelData.amenities || []),
          description_c: hotelData.description || ''
        }]
      };
      
      const response = await this.apperClient.createRecord('hotel_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.results[0].data;
    } catch (error) {
      console.error('Error creating hotel:', error);
      throw error;
    }
  }

  async update(id, hotelData) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const updateFields = {
        Id: parseInt(id)
      };
      
      if (hotelData.name) updateFields.name_c = hotelData.name;
      if (hotelData.location) updateFields.location_c = hotelData.location;
      if (hotelData.city) updateFields.city_c = hotelData.city;
      if (hotelData.country) updateFields.country_c = hotelData.country;
      if (hotelData.starRating) updateFields.star_rating_c = parseInt(hotelData.starRating);
      if (hotelData.pricePerNight) updateFields.price_per_night_c = parseFloat(hotelData.pricePerNight);
      if (hotelData.currency) updateFields.currency_c = hotelData.currency;
      if (hotelData.imageUrl) updateFields.image_url_c = hotelData.imageUrl;
      if (hotelData.images) updateFields.images_c = JSON.stringify(hotelData.images);
      if (hotelData.amenities) updateFields.amenities_c = JSON.stringify(hotelData.amenities);
      if (hotelData.description) updateFields.description_c = hotelData.description;
      
      const params = {
        records: [updateFields]
      };
      
      const response = await this.apperClient.updateRecord('hotel_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return response.results[0].data;
    } catch (error) {
      console.error('Error updating hotel:', error);
      throw error;
    }
  }

  async delete(id) {
    if (!this.apperClient) this.initializeClient();
    
    try {
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await this.apperClient.deleteRecord('hotel_c', params);
      
      if (!response.success) {
        throw new Error(response.message);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Error deleting hotel:', error);
      throw error;
    }
  }

  // Filter hotels method for compatibility
  async filterHotels(hotels, filters) {
    if (!filters) return hotels;

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
        const hotelAmenities = hotel.amenities.map(a => a.toLowerCase());
        return filters.amenities.every(amenity => 
          hotelAmenities.some(ha => ha.includes(amenity.toLowerCase()))
        );
      });
    }

    return filtered;
  }
}

const hotelService = new HotelService();
export default hotelService;