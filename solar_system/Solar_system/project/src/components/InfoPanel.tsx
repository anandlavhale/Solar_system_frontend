import React from 'react';
import { X, Info } from 'lucide-react';
import { planetData } from '../data/planets';

interface InfoPanelProps {
  isDarkMode: boolean;
  selectedPlanet: string | null;
  onClose: () => void;
}

export const InfoPanel: React.FC<InfoPanelProps> = ({
  isDarkMode,
  selectedPlanet,
  onClose
}) => {
  if (!selectedPlanet) {
    return (
      <div className={`${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-6`}>
        <div className="flex items-center space-x-2 mb-4">
          <Info className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Planet Information
          </h3>
        </div>
        <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Click on a planet to view detailed information about it.
        </p>
      </div>
    );
  }

  const planet = planetData[selectedPlanet];
  if (!planet) return null;

  return (
    <div className={`${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
      <div className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div 
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: `#${planet.color.toString(16).padStart(6, '0')}` }}
            />
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {selectedPlanet}
            </h3>
          </div>
          <button
            onClick={onClose}
            className={`p-1 rounded-full transition-colors ${
              isDarkMode 
                ? 'hover:bg-gray-700 text-gray-400' 
                : 'hover:bg-gray-100 text-gray-600'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Distance from Sun
            </h4>
            <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {planet.distance} AU
            </p>
          </div>
          <div>
            <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
              Relative Size
            </h4>
            <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {planet.size}
            </p>
          </div>
        </div>
        
        <div>
          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            Orbital Period
          </h4>
          <p className={`text-lg ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {planet.period} Earth days
          </p>
        </div>
        
        <div>
          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            Description
          </h4>
          <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {planet.description}
          </p>
        </div>
        
        <div>
          <h4 className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'} mb-1`}>
            Interesting Facts
          </h4>
          <ul className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-600'} space-y-1`}>
            {planet.facts.map((fact, index) => (
              <li key={index} className="flex items-start">
                <span className="mr-2">•</span>
                <span>{fact}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};