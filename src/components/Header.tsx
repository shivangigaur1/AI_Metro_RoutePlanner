import React from 'react';
import { Navigation, MapPin } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <Navigation className="h-8 w-8 text-cyan-400" />
            <h1 className="text-xl font-bold">MetroAI Planner</h1>
          </div>
          <div className="flex items-center space-x-2">
            <MapPin className="h-5 w-5 text-cyan-400" />
            <span className="text-sm">Smart Route Planning</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;