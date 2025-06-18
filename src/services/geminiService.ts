import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export interface InterchangeStation {
  station: string;
  fromLine: string;
  toLine: string;
}

export interface TravelTip {
  bestTime: string;
  crowdLevel: string;
  fare: string;
  reason: string;
}

export interface ExitInfo {
  gate: string;
  direction: string;
  landmarks: string[];
}

export interface RouteData {
  sourceStation: string;
  destinationStation: string;
  sourceLine: string;
  destinationLine: string;
  interchanges: number;
  interchangeStations?: InterchangeStation[];
  travelTime: string;
  fare: string;
  walkingDistance: string;
  walkingTime: string;
  autoFare: string;
  autoTime: string;
  travelTips: TravelTip;
  exitInfo: ExitInfo;
  summary: string;
}

export interface Restaurant {
  id: number;
  name: string;
  rating: number;
  price: string;
  cuisine: string;
  distance: string;
  isVeg: boolean;
  isReasonable: boolean;
  image: string;
}

export interface TouristPlace {
  id: number;
  name: string;
  rating: number;
  category: string;
  distance: string;
  description: string;
  image: string;
}

export interface RecommendationsData {
  restaurants: Restaurant[];
  touristPlaces: TouristPlace[];
}

export const planMetroRoute = async (source: string, destination: string): Promise<RouteData> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Plan a detailed metro route from "${source}" to "${destination}" in Delhi Metro system.
    
    Provide the response in the following JSON format only (no additional text):
    {
      "sourceStation": "nearest metro station to source location",
      "destinationStation": "nearest metro station to destination",
      "sourceLine": "metro line name (e.g., Blue Line, Red Line, etc.)",
      "destinationLine": "metro line name for destination station",
      "interchanges": number of interchanges required,
      "interchangeStations": [
        {
          "station": "interchange station name",
          "fromLine": "current line name",
          "toLine": "line to change to"
        }
      ],
      "travelTime": "estimated metro travel time in minutes",
      "fare": "exact metro fare in rupees with ₹ symbol from sourceLineto destinationLine",
      "walkingDistance": "distance from destination metro to final destination",
      "walkingTime": "estimated walking time in minutes",
      "autoFare": "estimated auto-rickshaw fare range with ₹ symbol",
      "autoTime": "estimated auto travel time in minutes",
      "travelTips": {
        "bestTime": "recommended travel time (e.g., After 8:00 PM or 10:00 AM - 4:00 PM)",
        "crowdLevel": "crowd level at recommended time (Low/Medium/High)",
        "fare": "special fare during off-peak hours with ₹ symbol",
        "reason": "reason why this time is recommended (less crowd, cheaper fare, etc.)"
      },
      "exitInfo": {
        "gate": "which gate/exit to use at destination station (e.g., Gate 1, Exit A, etc.)",
        "direction": "direction to walk after exiting (e.g., towards Connaught Place, left side, etc.)",
        "landmarks": ["landmark1", "landmark2", "landmark3"]
      },
      "summary": "A helpful 2-3 line summary with travel tips, best time to travel, and key information"
    }
    
    Use actual Delhi Metro lines: Red Line, Blue Line, Yellow Line, Green Line, Violet Line, Pink Line, Magenta Line, Orange Line, Airport Express, Aqua Line, Grey Line.
    Make realistic estimates based on Delhi Metro network and typical travel times.
    If no interchanges are needed, set interchanges to 0 and interchangeStations to empty array.
    Provide practical travel tips including best times to avoid crowds and get cheaper fares.
    Include specific exit gate information and walking directions.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error planning route:', error);
    // Fallback response
    return {
      sourceStation: `Nearest metro to ${source}`,
      destinationStation: `Nearest metro to ${destination}`,
      sourceLine: 'Blue Line',
      destinationLine: 'Blue Line',
      interchanges: 1,
      interchangeStations: [
        {
          station: 'Rajiv Chowk',
          fromLine: 'Blue Line',
          toLine: 'Yellow Line'
        }
      ],
      travelTime: '25-35 minutes',
      fare: '₹25-40',
      walkingDistance: '0.8-1.5 km',
      walkingTime: '10-18 minutes',
      autoFare: '₹20-40',
      autoTime: '5-12 minutes',
      travelTips: {
        bestTime: 'After 8:00 PM',
        crowdLevel: 'Low',
        fare: '₹10-15',
        reason: 'Less crowded and cheaper off-peak fare'
      },
      exitInfo: {
        gate: 'Gate 2',
        direction: 'towards main road',
        landmarks: ['Bus stop', 'ATM', 'Local market']
      },
      summary: 'Best time to travel is after 8 PM for less crowd and ₹10-15 fare. Use Gate 2 and walk towards main road. Total journey: 25-35 minutes.'
    };
  }
};

export const getNearbyRecommendations = async (destination: string): Promise<RecommendationsData> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    Find actual restaurants and tourist places near "${destination}" in Delhi. Provide real, existing places with accurate information.
    
    IMPORTANT REQUIREMENTS:
    1. Find REAL restaurants and places that actually exist near ${destination}
    2. Provide accurate distances from ${destination} (not metro station)
    3. Use proper food images from Pexels for restaurants
    4. Use proper landmark/place images from Pexels for tourist places
    5. Do NOT use rupee symbols in price field - use simple format like "200-400" or "Affordable" or "Mid-range"
    6. Provide realistic ratings between 3.8 to 4.8
    7. Include popular restaurants and eateries that locals actually visit
    
    Provide the response in the following JSON format only (no additional text):
    {
      "restaurants": [
        {
          "id": 1,
          "name": "actual restaurant name near ${destination}",
          "rating": 4.2,
          "price": "200-400",
          "cuisine": "North Indian",
          "distance": "300m from ${destination}",
          "isVeg": false,
          "isReasonable": true,
          "image": "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      "touristPlaces": [
        {
          "id": 1,
          "name": "actual place name near ${destination}",
          "rating": 4.5,
          "category": "Monument",
          "distance": "500m from ${destination}",
          "description": "brief description of the actual place",
          "image": "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ]
    }
    
    For images, use these Pexels URLs:
    - Indian food: https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400
    - Restaurant interior: https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=400
    - Indian curry: https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400
    - Street food: https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400
    - Fine dining: https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400
    - Cafe: https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400
    - Monument: https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400
    - Garden: https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400
    - Temple: https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=400
    - Market: https://images.pexels.com/photos/2291367/pexels-photo-2291367.jpeg?auto=compress&cs=tinysrgb&w=400
    
    Provide 5-6 restaurants and 3-4 tourist places that actually exist near ${destination}.
    Research real places and provide accurate information.
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      
      // Ensure proper image URLs and clean price formatting
      data.restaurants = data.restaurants.map((restaurant: Restaurant, index: number) => ({
        ...restaurant,
        id: index + 1,
        price: restaurant.price.replace(/₹/g, '').replace(/Rs\./g, '').trim(),
        image: restaurant.image || getRestaurantImage(index)
      }));
      
      data.touristPlaces = data.touristPlaces.map((place: TouristPlace, index: number) => ({
        ...place,
        id: index + 1,
        image: place.image || getTouristPlaceImage(index, place.category)
      }));
      
      return data;
    }
    
    throw new Error('Invalid response format');
  } catch (error) {
    console.error('Error getting recommendations:', error);
    // Fallback response with proper formatting
    return {
      restaurants: [
        {
          id: 1,
          name: "Local Dhaba",
          rating: 4.2,
          price: "150-300",
          cuisine: "North Indian",
          distance: "400m from destination",
          isVeg: false,
          isReasonable: true,
          image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: 2,
          name: "Vegetarian Corner",
          rating: 4.0,
          price: "100-250",
          cuisine: "Vegetarian",
          distance: "600m from destination",
          isVeg: true,
          isReasonable: true,
          image: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: 3,
          name: "Street Food Hub",
          rating: 4.3,
          price: "50-150",
          cuisine: "Street Food",
          distance: "300m from destination",
          isVeg: false,
          isReasonable: true,
          image: "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ],
      touristPlaces: [
        {
          id: 1,
          name: "Local Monument",
          rating: 4.3,
          category: "Monument",
          distance: "800m from destination",
          description: "Historic monument with beautiful architecture",
          image: "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400"
        },
        {
          id: 2,
          name: "Nearby Garden",
          rating: 4.1,
          category: "Park",
          distance: "1.2km from destination",
          description: "Peaceful garden perfect for morning walks",
          image: "https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400"
        }
      ]
    };
  }
};

// Helper functions for fallback images
const getRestaurantImage = (index: number): string => {
  const images = [
    "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/4393021/pexels-photo-4393021.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400",
    "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400"
  ];
  return images[index % images.length];
};

const getTouristPlaceImage = (index: number, category: string): string => {
  const categoryImages: { [key: string]: string } = {
    'Monument': "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400",
    'Park': "https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400",
    'Temple': "https://images.pexels.com/photos/2846217/pexels-photo-2846217.jpeg?auto=compress&cs=tinysrgb&w=400",
    'Market': "https://images.pexels.com/photos/2291367/pexels-photo-2291367.jpeg?auto=compress&cs=tinysrgb&w=400",
    'Garden': "https://images.pexels.com/photos/1166209/pexels-photo-1166209.jpeg?auto=compress&cs=tinysrgb&w=400"
  };
  
  return categoryImages[category] || "https://images.pexels.com/photos/3573382/pexels-photo-3573382.jpeg?auto=compress&cs=tinysrgb&w=400";
};

export const getChatResponse = async (userMessage: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are a helpful Delhi Metro Assistant. Answer questions about:
    - Metro routes and directions
    - Metro timings and schedules
    - Metro fares and ticket information
    - Station information and facilities
    - General travel advice for Delhi Metro
    - Nearby attractions and places of interest
    - Best times to travel to avoid crowds
    - Exit gates and walking directions
    - Off-peak fare information
    
    Keep responses concise, helpful, and friendly. If asked about something outside of metro/travel topics, politely redirect to metro-related queries.
    
    User question: "${userMessage}"
    
    Provide a helpful response:
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Error getting chat response:', error);
    return "I'm sorry, I'm having trouble responding right now. Please try asking about metro routes, timings, or fares, and I'll do my best to help!";
  }
};