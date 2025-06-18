import React, { useState, useEffect } from 'react';
import { Train, Clock, DollarSign, MapPin, Car, User, Loader2, ArrowRight, RotateCcw, Users, Lightbulb, Navigation2, ExternalLink } from 'lucide-react';
import { planMetroRoute, RouteData } from '../services/geminiService';

interface RouteResultsProps {
  source: string;
  destination: string;
}

const RouteResults: React.FC<RouteResultsProps> = ({ source, destination }) => {
  const [routeData, setRouteData] = useState<RouteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRouteData = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await planMetroRoute(source, destination);
        setRouteData(data);
      } catch (err) {
        setError('Failed to plan route. Please try again.');
        console.error('Route planning error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRouteData();
  }, [source, destination]);

  const getLineColor = (lineName: string) => {
    const lineColors: { [key: string]: string } = {
      'Red Line': 'bg-red-500',
      'Blue Line': 'bg-blue-500',
      'Yellow Line': 'bg-yellow-500',
      'Green Line': 'bg-green-500',
      'Violet Line': 'bg-purple-500',
      'Pink Line': 'bg-pink-500',
      'Magenta Line': 'bg-fuchsia-500',
      'Orange Line': 'bg-orange-500',
      'Airport Express': 'bg-orange-600',
      'Aqua Line': 'bg-cyan-500',
      'Grey Line': 'bg-gray-500'
    };
    return lineColors[lineName] || 'bg-gray-400';
  };

  const getCrowdLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'low': return 'text-green-600 bg-green-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      case 'high': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex items-center justify-center space-x-3">
            <Loader2 className="h-8 w-8 text-blue-600 animate-spin" />
            <p className="text-xl text-gray-600">Planning your route...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center">
            <p className="text-xl text-red-600 mb-4">{error}</p>
            <button 
              onClick={() => window.location.reload()}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!routeData) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Smart Travel Summary */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-2xl shadow-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <Lightbulb className="h-8 w-8 text-yellow-300" />
          <h3 className="text-2xl font-bold">Smart Travel Summary</h3>
        </div>
        <p className="text-lg opacity-90 mb-4">{routeData.summary}</p>
        
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-yellow-300" />
              <span className="font-semibold">Best Time</span>
            </div>
            <p className="text-lg font-bold">{routeData.travelTips.bestTime}</p>
            <p className="text-sm opacity-80">{routeData.travelTips.reason}</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Users className="h-5 w-5 text-green-300" />
              <span className="font-semibold">Crowd Level</span>
            </div>
            <p className="text-lg font-bold">{routeData.travelTips.crowdLevel}</p>
            <p className="text-sm opacity-80">Off-peak fare: {routeData.travelTips.fare}</p>
          </div>
          
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Navigation2 className="h-5 w-5 text-purple-300" />
              <span className="font-semibold">Exit Info</span>
            </div>
            <p className="text-lg font-bold">{routeData.exitInfo.gate}</p>
            <p className="text-sm opacity-80">{routeData.exitInfo.direction}</p>
          </div>
        </div>
      </div>

      {/* Detailed Metro Route Card */}
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center space-x-3 mb-6">
          <Train className="h-8 w-8 text-blue-600" />
          <h3 className="text-2xl font-bold text-gray-800">Metro Route Details</h3>
        </div>

        {/* Route Visualization */}
        <div className="mb-8">
          <div className="flex flex-col space-y-4">
            {/* Source Station */}
            <div className="flex items-center space-x-4">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <div className={`w-1 h-8 ${getLineColor(routeData.sourceLine || 'Blue Line')}`}></div>
              </div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <p className="font-bold text-lg text-gray-800">{routeData.sourceStation}</p>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getLineColor(routeData.sourceLine || 'Blue Line')}`}>
                    {routeData.sourceLine || 'Blue Line'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">From: {source}</p>
              </div>
            </div>

            {/* Interchange Stations */}
            {routeData.interchangeStations && routeData.interchangeStations.map((interchange, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                    <RotateCcw className="h-3 w-3 text-white" />
                  </div>
                  <div className={`w-1 h-8 ${getLineColor(interchange.toLine)}`}></div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <p className="font-semibold text-gray-800">{interchange.station}</p>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getLineColor(interchange.fromLine)}`}>
                        {interchange.fromLine}
                      </span>
                      <ArrowRight className="h-3 w-3 text-gray-400" />
                      <span className={`px-2 py-1 rounded-full text-white text-xs font-medium ${getLineColor(interchange.toLine)}`}>
                        {interchange.toLine}
                      </span>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500">Change to {interchange.toLine}</p>
                </div>
              </div>
            ))}

            {/* Destination Station */}
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <div className="flex items-center space-x-3">
                  <p className="font-bold text-lg text-gray-800">{routeData.destinationStation}</p>
                  <span className={`px-3 py-1 rounded-full text-white text-sm font-medium ${getLineColor(routeData.destinationLine || 'Blue Line')}`}>
                    {routeData.destinationLine || 'Blue Line'}
                  </span>
                </div>
                <p className="text-sm text-gray-600">Near: {destination}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Route Stats */}
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Clock className="h-5 w-5 text-blue-600" />
              <span className="text-sm font-medium text-blue-600">Travel Time</span>
            </div>
            <p className="text-2xl font-bold text-blue-800">{routeData.travelTime}</p>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-5 w-5 text-green-600" />
              <span className="text-sm font-medium text-green-600">Metro Fare</span>
            </div>
            <p className="text-2xl font-bold text-green-800">{routeData.fare}</p>
          </div>

          <div className="bg-purple-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <RotateCcw className="h-5 w-5 text-purple-600" />
              <span className="text-sm font-medium text-purple-600">Interchanges</span>
            </div>
            <p className="text-2xl font-bold text-purple-800">{routeData.interchanges}</p>
          </div>
        </div>
      </div>

      {/* Exit Information & Final Destination */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Exit Information */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ExternalLink className="h-6 w-6 text-purple-600" />
            <h3 className="text-xl font-bold text-gray-800">Exit Information</h3>
          </div>
          
          <div className="space-y-4">
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="font-semibold text-purple-800 mb-2">Use {routeData.exitInfo.gate}</p>
              <p className="text-gray-700 mb-3">{routeData.exitInfo.direction}</p>
              
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-600">Nearby Landmarks:</p>
                {routeData.exitInfo.landmarks.map((landmark, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-sm text-gray-600">{landmark}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Final Destination Options */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <MapPin className="h-6 w-6 text-orange-600" />
            <h3 className="text-xl font-bold text-gray-800">To Final Destination</h3>
          </div>

          <div className="space-y-4">
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <User className="h-5 w-5 text-orange-600" />
                <h4 className="font-semibold text-orange-800">Walking</h4>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Distance: {routeData.walkingDistance}</p>
                <p className="text-lg font-bold text-orange-800">{routeData.walkingTime}</p>
                <p className="text-xs text-gray-500">Free & healthy option</p>
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3 mb-3">
                <Car className="h-5 w-5 text-purple-600" />
                <h4 className="font-semibold text-purple-800">Auto-Rickshaw</h4>
              </div>
              <div className="space-y-1">
                <p className="text-sm text-gray-600">Time: {routeData.autoTime}</p>
                <p className="text-lg font-bold text-purple-800">{routeData.autoFare}</p>
                <p className="text-xs text-gray-500">Quick & convenient</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RouteResults;