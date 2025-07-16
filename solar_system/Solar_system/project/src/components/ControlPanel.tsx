import React, { useState } from 'react';
import { planetData } from '../data/planets';
import { Sliders, ChevronDown, ChevronUp } from 'lucide-react';

interface ControlPanelProps {
  isDarkMode: boolean;
  onSpeedChange: (planet: string, speed: number) => void;
  isPaused: boolean;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  isDarkMode,
  onSpeedChange,
  isPaused
}) => {
  const [speeds, setSpeeds] = useState<{ [key: string]: number }>(() => {
    const initialSpeeds: { [key: string]: number } = {};
    Object.keys(planetData).forEach(planet => {
      initialSpeeds[planet] = 1.0;
    });
    return initialSpeeds;
  });

  const [isExpanded, setIsExpanded] = useState(true);

  const handleSpeedChange = (planet: string, speed: number) => {
    setSpeeds(prev => ({ ...prev, [planet]: speed }));
    onSpeedChange(planet, speed);
  };

  const resetAllSpeeds = () => {
    const resetSpeeds: { [key: string]: number } = {};
    Object.keys(planetData).forEach(planet => {
      resetSpeeds[planet] = 1.0;
      onSpeedChange(planet, 1.0);
    });
    setSpeeds(resetSpeeds);
  };

  return (
    <div className={`${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} overflow-hidden`}>
      <div 
        className={`p-4 border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} cursor-pointer`}
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Sliders className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
            <h3 className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              Speed Controls
            </h3>
          </div>
          {isExpanded ? 
            <ChevronUp className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} /> :
            <ChevronDown className={`w-5 h-5 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`} />
          }
        </div>
      </div>
      
      {isExpanded && (
        <div className="p-4 space-y-4 max-h-96 overflow-y-auto">
          <div className="flex justify-between items-center">
            <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
              Status: {isPaused ? 'Paused' : 'Running'}
            </span>
            <button
              onClick={resetAllSpeeds}
              className={`text-xs px-3 py-1 rounded transition-colors ${
                isDarkMode 
                  ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                  : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
              }`}
            >
              Reset All
            </button>
          </div>

          {Object.entries(planetData).map(([name, data]) => (
            <div key={name} className="space-y-2">
              <div className="flex items-center justify-between">
                <label className={`text-sm font-medium ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  {name}
                </label>
                <span className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  {speeds[name].toFixed(1)}x
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <div 
                  className="w-4 h-4 rounded-full flex-shrink-0"
                  style={{ backgroundColor: `#${data.color.toString(16).padStart(6, '0')}` }}
                />
                <input
                  type="range"
                  min="0"
                  max="5"
                  step="0.1"
                  value={speeds[name]}
                  onChange={(e) => handleSpeedChange(name, parseFloat(e.target.value))}
                  className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  style={{
                    background: `linear-gradient(to right, #${data.color.toString(16).padStart(6, '0')} 0%, #${data.color.toString(16).padStart(6, '0')} ${(speeds[name] / 5) * 100}%, ${isDarkMode ? '#374151' : '#e5e7eb'} ${(speeds[name] / 5) * 100}%, ${isDarkMode ? '#374151' : '#e5e7eb'} 100%)`
                  }}
                />
              </div>
              
              <div className="flex justify-between text-xs text-gray-500">
                <span>0x</span>
                <span>2.5x</span>
                <span>5x</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};