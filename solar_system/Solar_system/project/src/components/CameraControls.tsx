import React from 'react';
import { Camera, Target, Home } from 'lucide-react';
import { planetData } from '../data/planets';

interface CameraControlsProps {
  isDarkMode: boolean;
  cameraMode: 'free' | 'follow';
  onCameraModeChange: (mode: 'free' | 'follow') => void;
  onFollowPlanet: (planet: string) => void;
}

export const CameraControls: React.FC<CameraControlsProps> = ({
  isDarkMode,
  cameraMode,
  onCameraModeChange,
  onFollowPlanet
}) => {
  return (
    <div className={`${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm rounded-lg border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'} p-4`}>
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <Camera className={`w-5 h-5 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} />
          <span className={`text-sm font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            Camera:
          </span>
        </div>
        
        <button
          onClick={() => onCameraModeChange('free')}
          className={`flex items-center space-x-2 px-3 py-1 rounded transition-colors ${
            cameraMode === 'free'
              ? isDarkMode 
                ? 'bg-blue-600 text-white' 
                : 'bg-blue-500 text-white'
              : isDarkMode 
                ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                : 'bg-gray-200 hover:bg-gray-300 text-gray-700'
          }`}
        >
          <Home className="w-4 h-4" />
          <span>Free</span>
        </button>
        
        <div className="flex items-center space-x-2">
          <select
            value={cameraMode === 'follow' ? 'follow' : 'free'}
            onChange={(e) => {
              if (e.target.value === 'follow') {
                onCameraModeChange('follow');
                onFollowPlanet('Mercury'); // Default to Mercury
              } else {
                onCameraModeChange('free');
              }
            }}
            className={`px-3 py-1 rounded text-sm ${
              isDarkMode 
                ? 'bg-gray-600 text-white border-gray-500' 
                : 'bg-white text-gray-900 border-gray-300'
            }`}
          >
            <option value="free">Free Mode</option>
            <option value="follow">Follow Planet</option>
          </select>
          
          {cameraMode === 'follow' && (
            <select
              onChange={(e) => onFollowPlanet(e.target.value)}
              className={`px-3 py-1 rounded text-sm ${
                isDarkMode 
                  ? 'bg-gray-600 text-white border-gray-500' 
                  : 'bg-white text-gray-900 border-gray-300'
              }`}
            >
              {Object.keys(planetData).map(planet => (
                <option key={planet} value={planet}>
                  {planet}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>
    </div>
  );
};