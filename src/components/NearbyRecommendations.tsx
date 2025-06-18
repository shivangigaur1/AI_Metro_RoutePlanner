import React, { useState, useEffect } from 'react';
import { MapPin, Star, Filter, CheckCircle2, DollarSign, Utensils, Camera, Loader2 } from 'lucide-react';
import { getNearbyRecommendations, RecommendationsData, Restaurant } from '../services/geminiService';

interface NearbyRecommendationsProps {
  destination: string;
}

const NearbyRecommendations: React.FC<NearbyRecommendationsProps> = ({ destination }) => {
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [recommendationsData, setRecommendationsData] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState({
    reasonablePrice: false,
    veg: false,
    nonVeg: false,
    highRating: false
  });

  const fetchRecommendations = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const data = await getNearbyRecommendations(destination);
      setRecommendationsData(data);
    } catch (err) {
      setError('Failed to load recommendations. Please try again.');
      console.error('Recommendations error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShowRecommendations = () => {
    if (!showRecommendations && !recommendationsData) {
      fetchRecommendations();
    }
    setShowRecommendations(!showRecommendations);
  };

  const filteredRestaurants = recommendationsData?.restaurants.filter((restaurant: Restaurant) => {
    if (filters.reasonablePrice && !restaurant.isReasonable) return false;
    if (filters.veg && !restaurant.isVeg) return false;
    if (filters.nonVeg && restaurant.isVeg) return false;
    if (filters.highRating && restaurant.rating < 4.5) return false;
    return true;
  }) || [];

  const handleFilterChange = (filterName: keyof typeof filters) => {
    setFilters(prev => ({
      ...prev,
      [filterName]: !prev[filterName]
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <button
          onClick={handleShowRecommendations}
          className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-full font-semibold text-lg hover:from-purple-700 hover:to-pink-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
        >
          {showRecommendations ? 'Hide' : 'Discover Nearby'}
        </button>
      </div>

      {showRecommendations && (
        <div className="space-y-8">
          {loading && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="flex items-center justify-center space-x-3">
                <Loader2 className="h-8 w-8 text-purple-600 animate-spin" />
                <p className="text-xl text-gray-600">Finding nearby recommendations...</p>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center">
                <p className="text-xl text-red-600 mb-4">{error}</p>
                <button 
                  onClick={fetchRecommendations}
                  className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}

          {recommendationsData && !loading && (
            <>
              {/* Filters */}
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <div className="flex items-center space-x-3 mb-4">
                  <Filter className="h-6 w-6 text-gray-600" />
                  <h3 className="text-xl font-semibold text-gray-800">Filters</h3>
                </div>
                <div className="flex flex-wrap gap-3">
                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.reasonablePrice}
                      onChange={() => handleFilterChange('reasonablePrice')}
                      className="hidden"
                    />
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
                      filters.reasonablePrice 
                        ? 'bg-green-100 border-green-500 text-green-700' 
                        : 'border-gray-300 text-gray-600 hover:border-green-300'
                    }`}>
                      {filters.reasonablePrice && <CheckCircle2 className="h-4 w-4" />}
                      <DollarSign className="h-4 w-4" />
                      <span>Reasonable Price</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.veg}
                      onChange={() => handleFilterChange('veg')}
                      className="hidden"
                    />
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
                      filters.veg 
                        ? 'bg-green-100 border-green-500 text-green-700' 
                        : 'border-gray-300 text-gray-600 hover:border-green-300'
                    }`}>
                      {filters.veg && <CheckCircle2 className="h-4 w-4" />}
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span>Vegetarian</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.nonVeg}
                      onChange={() => handleFilterChange('nonVeg')}
                      className="hidden"
                    />
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
                      filters.nonVeg 
                        ? 'bg-red-100 border-red-500 text-red-700' 
                        : 'border-gray-300 text-gray-600 hover:border-red-300'
                    }`}>
                      {filters.nonVeg && <CheckCircle2 className="h-4 w-4" />}
                      <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                      <span>Non-Vegetarian</span>
                    </div>
                  </label>

                  <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.highRating}
                      onChange={() => handleFilterChange('highRating')}
                      className="hidden"
                    />
                    <div className={`flex items-center space-x-2 px-4 py-2 rounded-full border-2 transition-all ${
                      filters.highRating 
                        ? 'bg-yellow-100 border-yellow-500 text-yellow-700' 
                        : 'border-gray-300 text-gray-600 hover:border-yellow-300'
                    }`}>
                      {filters.highRating && <CheckCircle2 className="h-4 w-4" />}
                      <Star className="h-4 w-4" />
                      <span>High Rating (4.5+)</span>
                    </div>
                  </label>
                </div>
              </div>

              {/* Restaurants */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Utensils className="h-8 w-8 text-orange-600" />
                  <h3 className="text-2xl font-bold text-gray-800">Nearby Restaurants</h3>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredRestaurants.map(restaurant => (
                    <div key={restaurant.id} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <img 
                          src={restaurant.image} 
                          alt={restaurant.name}
                          className="w-full h-32 object-cover rounded-lg"
                        />
                      </div>
                      <h4 className="font-bold text-lg text-gray-800 mb-2">{restaurant.name}</h4>
                      <p className="text-gray-600 mb-3">{restaurant.cuisine}</p>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-1">
                          <Star className="h-4 w-4 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{restaurant.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500">{restaurant.distance}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-orange-600">{restaurant.price}</span>
                        <div className="flex items-center space-x-1">
                          <div className={`w-3 h-3 rounded-full ${restaurant.isVeg ? 'bg-green-500' : 'bg-red-500'}`}></div>
                          <span className="text-xs text-gray-500">{restaurant.isVeg ? 'Veg' : 'Non-Veg'}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Tourist Places */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <div className="flex items-center space-x-3 mb-6">
                  <Camera className="h-8 w-8 text-purple-600" />
                  <h3 className="text-2xl font-bold text-gray-800">Popular Tourist Places</h3>
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  {recommendationsData.touristPlaces.map(place => (
                    <div key={place.id} className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                      <div className="aspect-w-16 aspect-h-9 mb-4">
                        <img 
                          src={place.image} 
                          alt={place.name}
                          className="w-full h-40 object-cover rounded-lg"
                        />
                      </div>
                      <h4 className="font-bold text-xl text-gray-800 mb-2">{place.name}</h4>
                      <p className="text-gray-600 mb-3">{place.description}</p>
                      <div className="flex items-center justify-between mb-2">
                        <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                          {place.category}
                        </span>
                        <span className="text-sm text-gray-500">{place.distance}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500 fill-current" />
                        <span className="text-sm font-medium">{place.rating}</span>
                        <span className="text-sm text-gray-500 ml-2">Highly rated</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default NearbyRecommendations;