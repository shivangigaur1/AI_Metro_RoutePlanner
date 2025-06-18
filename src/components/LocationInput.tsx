import React, { useState, useRef, useEffect } from 'react';
import { MapPin, Search } from 'lucide-react';

interface LocationInputProps {
  onPlanRoute: (source: string, destination: string) => void;
}

interface Suggestion {
  name: string;
  type: 'station' | 'landmark' | 'airport' | 'monument' | 'park' | 'market' | 'temple';
  description: string;
}

const LocationInput: React.FC<LocationInputProps> = ({ onPlanRoute }) => {
  const [source, setSource] = useState('');
  const [destination, setDestination] = useState('');
  const [sourceSuggestions, setSourceSuggestions] = useState<Suggestion[]>([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState<Suggestion[]>([]);
  const [showSourceSuggestions, setShowSourceSuggestions] = useState(false);
  const [showDestinationSuggestions, setShowDestinationSuggestions] = useState(false);
  
  const sourceRef = useRef<HTMLInputElement>(null);
  const destinationRef = useRef<HTMLInputElement>(null);

  // Comprehensive suggestions database with popular Delhi places
  const allSuggestions: Suggestion[] = [
    // Popular landmarks and monuments
    { name: 'India Gate', type: 'monument', description: 'Famous war memorial and tourist attraction' },
    { name: 'Red Fort', type: 'monument', description: 'Historic Mughal fort and UNESCO World Heritage Site' },
    { name: 'Qutub Minar', type: 'monument', description: 'UNESCO World Heritage Site and historic minaret' },
    { name: 'Humayun\'s Tomb', type: 'monument', description: 'UNESCO World Heritage Site and Mughal architecture' },
    { name: 'Lotus Temple', type: 'temple', description: 'Baháʼí House of Worship' },
    { name: 'Akshardham Temple', type: 'temple', description: 'Large Hindu temple complex' },
    { name: 'Jama Masjid', type: 'monument', description: 'One of the largest mosques in India' },
    { name: 'Raj Ghat', type: 'monument', description: 'Memorial to Mahatma Gandhi' },
    
    // Parks and gardens
    { name: 'Lodhi Garden', type: 'park', description: 'Historic park with tombs and beautiful gardens' },
    { name: 'Nehru Park', type: 'park', description: 'Large park in Chanakyapuri area' },
    { name: 'Buddha Jayanti Park', type: 'park', description: 'Peaceful park with Buddha statue' },
    { name: 'Deer Park', type: 'park', description: 'Park with deer and green spaces in Hauz Khas' },
    
    // Markets and shopping areas
    { name: 'Connaught Place', type: 'market', description: 'Central business district and shopping area' },
    { name: 'Chandni Chowk', type: 'market', description: 'Historic market area in Old Delhi' },
    { name: 'Khan Market', type: 'market', description: 'Upscale shopping and dining destination' },
    { name: 'Karol Bagh Market', type: 'market', description: 'Popular shopping area for clothes and electronics' },
    { name: 'Lajpat Nagar Market', type: 'market', description: 'Famous market for clothes and accessories' },
    { name: 'Sarojini Nagar Market', type: 'market', description: 'Popular market for affordable fashion' },
    { name: 'Janpath Market', type: 'market', description: 'Popular shopping street for handicrafts' },
    { name: 'Palika Bazaar', type: 'market', description: 'Underground market near Connaught Place' },
    
    // Modern areas and districts
    { name: 'Hauz Khas Village', type: 'landmark', description: 'Trendy area with cafes, bars, and boutiques' },
    { name: 'Cyber City Gurgaon', type: 'landmark', description: 'Major IT and business hub' },
    { name: 'Noida City Centre', type: 'landmark', description: 'Commercial and residential area in Noida' },
    { name: 'Nehru Place', type: 'landmark', description: 'IT and electronics hub' },
    { name: 'CP Metro Station', type: 'station', description: 'Connaught Place metro station' },
    
    // Airports
    { name: 'Indira Gandhi International Airport', type: 'airport', description: 'Main international airport of Delhi' },
    { name: 'IGI Airport Terminal 1', type: 'airport', description: 'Domestic terminal of IGI Airport' },
    { name: 'IGI Airport Terminal 3', type: 'airport', description: 'International terminal of IGI Airport' },
    
    // Major metro stations
    { name: 'Rajiv Chowk Metro Station', type: 'station', description: 'Major interchange station (Blue & Yellow Lines)' },
    { name: 'New Delhi Railway Station', type: 'station', description: 'Main railway station and metro station' },
    { name: 'Kashmere Gate Metro Station', type: 'station', description: 'Major interchange station (Red & Yellow Lines)' },
    { name: 'Inderlok Metro Station', type: 'station', description: 'Green Line metro station' },
    { name: 'Karol Bagh Metro Station', type: 'station', description: 'Blue Line metro station' },
    { name: 'Dwarka Sector 21 Metro Station', type: 'station', description: 'Blue Line metro station' },
    { name: 'Saket Metro Station', type: 'station', description: 'Yellow Line metro station' },
    { name: 'Huda City Centre Metro Station', type: 'station', description: 'Yellow Line terminal station in Gurgaon' },
    { name: 'Noida Sector 62 Metro Station', type: 'station', description: 'Blue Line metro station in Noida' },
    
    // Educational institutions
    { name: 'Delhi University', type: 'landmark', description: 'Premier university in North Delhi' },
    { name: 'JNU', type: 'landmark', description: 'Jawaharlal Nehru University' },
    { name: 'IIT Delhi', type: 'landmark', description: 'Indian Institute of Technology Delhi' },
    { name: 'Jamia Millia Islamia', type: 'landmark', description: 'Central university in South Delhi' },
    
    // Hospitals
    { name: 'AIIMS Delhi', type: 'landmark', description: 'All India Institute of Medical Sciences' },
    { name: 'Safdarjung Hospital', type: 'landmark', description: 'Major government hospital' },
    { name: 'Apollo Hospital', type: 'landmark', description: 'Private multi-specialty hospital' },
    
    // Other popular places
    { name: 'Dilli Haat', type: 'market', description: 'Craft bazaar and food plaza' },
    { name: 'Kingdom of Dreams', type: 'landmark', description: 'Entertainment and leisure destination in Gurgaon' },
    { name: 'Select City Walk', type: 'landmark', description: 'Popular shopping mall in Saket' },
    { name: 'DLF Mall of India', type: 'landmark', description: 'Large shopping mall in Noida' },
    { name: 'Ambience Mall', type: 'landmark', description: 'Shopping mall in Gurgaon' }
  ];

  const getSuggestions = (input: string): Suggestion[] => {
    if (!input.trim()) return [];
    
    const filtered = allSuggestions.filter(suggestion =>
      suggestion.name.toLowerCase().includes(input.toLowerCase()) ||
      suggestion.description.toLowerCase().includes(input.toLowerCase())
    );
    
    // Sort by relevance - exact matches first, then partial matches
    const sorted = filtered.sort((a, b) => {
      const aStartsWith = a.name.toLowerCase().startsWith(input.toLowerCase());
      const bStartsWith = b.name.toLowerCase().startsWith(input.toLowerCase());
      
      if (aStartsWith && !bStartsWith) return -1;
      if (!aStartsWith && bStartsWith) return 1;
      
      return a.name.localeCompare(b.name);
    });
    
    return sorted.slice(0, 6); // Show up to 6 suggestions
  };

  const handleSourceChange = (value: string) => {
    setSource(value);
    const suggestions = getSuggestions(value);
    setSourceSuggestions(suggestions);
    setShowSourceSuggestions(suggestions.length > 0 && value.length > 0);
  };

  const handleDestinationChange = (value: string) => {
    setDestination(value);
    const suggestions = getSuggestions(value);
    setDestinationSuggestions(suggestions);
    setShowDestinationSuggestions(suggestions.length > 0 && value.length > 0);
  };

  const selectSourceSuggestion = (suggestion: Suggestion) => {
    setSource(suggestion.name);
    setShowSourceSuggestions(false);
    destinationRef.current?.focus();
  };

  const selectDestinationSuggestion = (suggestion: Suggestion) => {
    setDestination(suggestion.name);
    setShowDestinationSuggestions(false);
  };

  const handlePlanRoute = () => {
    if (source && destination) {
      onPlanRoute(source, destination);
    }
  };

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (sourceRef.current && !sourceRef.current.contains(event.target as Node)) {
        setShowSourceSuggestions(false);
      }
      if (destinationRef.current && !destinationRef.current.contains(event.target as Node)) {
        setShowDestinationSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getSuggestionIcon = (type: string) => {
    const iconClass = "h-4 w-4";
    switch (type) {
      case 'station': return <MapPin className={`${iconClass} text-blue-500`} />;
      case 'airport': return <MapPin className={`${iconClass} text-purple-500`} />;
      case 'monument': return <MapPin className={`${iconClass} text-red-500`} />;
      case 'park': return <MapPin className={`${iconClass} text-green-500`} />;
      case 'market': return <MapPin className={`${iconClass} text-orange-500`} />;
      case 'temple': return <MapPin className={`${iconClass} text-yellow-600`} />;
      case 'landmark': return <MapPin className={`${iconClass} text-cyan-500`} />;
      default: return <MapPin className={`${iconClass} text-gray-500`} />;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'station': return 'bg-blue-100 text-blue-700';
      case 'airport': return 'bg-purple-100 text-purple-700';
      case 'monument': return 'bg-red-100 text-red-700';
      case 'park': return 'bg-green-100 text-green-700';
      case 'market': return 'bg-orange-100 text-orange-700';
      case 'temple': return 'bg-yellow-100 text-yellow-700';
      case 'landmark': return 'bg-cyan-100 text-cyan-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 -mt-16 relative z-10 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Plan Your Metro Journey</h2>
        <p className="text-gray-600">Get the fastest route with AI-powered recommendations</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-4">
          <div className="relative" ref={sourceRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Starting Location
            </label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={source}
                onChange={(e) => handleSourceChange(e.target.value)}
                onFocus={() => source && setShowSourceSuggestions(sourceSuggestions.length > 0)}
                placeholder="Enter starting location or metro station"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              
              {/* Source Suggestions */}
              {showSourceSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-72 overflow-y-auto">
                  {sourceSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => selectSourceSuggestion(suggestion)}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      {getSuggestionIcon(suggestion.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{suggestion.name}</p>
                        <p className="text-xs text-gray-500 truncate">{suggestion.description}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(suggestion.type)}`}>
                        {suggestion.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="relative" ref={destinationRef}>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Destination
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={destination}
                onChange={(e) => handleDestinationChange(e.target.value)}
                onFocus={() => destination && setShowDestinationSuggestions(destinationSuggestions.length > 0)}
                placeholder="Enter destination or metro station"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
              
              {/* Destination Suggestions */}
              {showDestinationSuggestions && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-72 overflow-y-auto">
                  {destinationSuggestions.map((suggestion, index) => (
                    <div
                      key={index}
                      onClick={() => selectDestinationSuggestion(suggestion)}
                      className="flex items-center space-x-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                    >
                      {getSuggestionIcon(suggestion.type)}
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-800 truncate">{suggestion.name}</p>
                        <p className="text-xs text-gray-500 truncate">{suggestion.description}</p>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${getTypeColor(suggestion.type)}`}>
                        {suggestion.type}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={handlePlanRoute}
          disabled={!source || !destination}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-4 rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-cyan-700 transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none shadow-lg"
        >
          Plan My Route
        </button>
      </div>
    </div>
  );
};

export default LocationInput;