import React, { useState } from 'react';
import Header from './components/Header';
import LocationInput from './components/LocationInput';
import RouteResults from './components/RouteResults';
import NearbyRecommendations from './components/NearbyRecommendations';
import ChatBot from './components/ChatBot';

function App() {
  const [routeData, setRouteData] = useState<{source: string; destination: string} | null>(null);

  const handlePlanRoute = (source: string, destination: string) => {
    setRouteData({ source, destination });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-purple-50">
      <Header />
      
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-cyan-600 to-purple-600 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center text-white mb-16">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Smart Metro Navigation
            </h1>
            <p className="text-xl md:text-2xl opacity-90 max-w-3xl mx-auto">
              AI-powered route planning for the fastest, most efficient metro journeys with personalized recommendations
            </p>
          </div>
          
          <LocationInput onPlanRoute={handlePlanRoute} />
        </div>
      </div>

      {/* Results Section */}
      {routeData && (
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <RouteResults 
              source={routeData.source} 
              destination={routeData.destination} 
            />
            
            <NearbyRecommendations destination={routeData.destination} />
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">MetroAI Planner</h3>
            <p className="text-gray-400 mb-6">
              Making metro travel smarter, faster, and more enjoyable with AI-powered insights
            </p>
            <div className="flex justify-center space-x-8 text-sm text-gray-400">
              <span>Smart Route Planning</span>
              <span>Real-time Updates</span>
              <span>Personalized Recommendations</span>
              <span>Multi-modal Integration</span>
            </div>
          </div>
        </div>
      </footer>

      {/* ChatBot */}
      <ChatBot />
    </div>
  );
}

export default App;