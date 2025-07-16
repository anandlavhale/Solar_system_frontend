import React, { useRef, useEffect, useState } from 'react';
import { SolarSystem } from './components/SolarSystem';
import { ControlPanel } from './components/ControlPanel';
import { InfoPanel } from './components/InfoPanel';
import { CameraControls } from './components/CameraControls';
import { Moon, Sun, Pause, Play, RotateCcw } from 'lucide-react';

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const solarSystemRef = useRef<SolarSystem | null>(null);
  const [isPaused, setIsPaused] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [showLabels, setShowLabels] = useState(true);
  const [cameraMode, setCameraMode] = useState<'free' | 'follow'>('free');

  useEffect(() => {
    if (canvasRef.current) {
      const solarSystem = new SolarSystem(canvasRef.current);
      solarSystemRef.current = solarSystem;
      
      solarSystem.init();
      solarSystem.setShowLabels(showLabels);
      solarSystem.setOnPlanetClick(setSelectedPlanet);
      
      return () => {
        solarSystem.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (solarSystemRef.current) {
      solarSystemRef.current.setShowLabels(showLabels);
    }
  }, [showLabels]);

  const handlePauseResume = () => {
    if (solarSystemRef.current) {
      solarSystemRef.current.togglePause();
      setIsPaused(!isPaused);
    }
  };

  const handleReset = () => {
    if (solarSystemRef.current) {
      solarSystemRef.current.resetPlanets();
      setSelectedPlanet(null);
    }
  };

  const handleSpeedChange = (planet: string, speed: number) => {
    if (solarSystemRef.current) {
      solarSystemRef.current.setPlanetSpeed(planet, speed);
    }
  };

  const handleCameraMode = (mode: 'free' | 'follow') => {
    setCameraMode(mode);
    if (solarSystemRef.current) {
      solarSystemRef.current.setCameraMode(mode);
    }
  };

  const handleFollowPlanet = (planet: string) => {
    if (solarSystemRef.current) {
      solarSystemRef.current.followPlanet(planet);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'} relative overflow-hidden`}>
      {/* Header */}
      <header className={`absolute top-0 left-0 right-0 z-20 ${isDarkMode ? 'bg-gray-800/90' : 'bg-white/90'} backdrop-blur-sm border-b ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Sun className={`w-6 h-6 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-600'}`} />
              <h1 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                3D Solar System Simulation
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={handlePauseResume}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                    : 'bg-blue-500 hover:bg-blue-600 text-white'
                }`}
              >
                {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                <span>{isPaused ? 'Resume' : 'Pause'}</span>
              </button>
              
              <button
                onClick={handleReset}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                <RotateCcw className="w-4 h-4" />
                <span>Reset</span>
              </button>
              
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isDarkMode 
                    ? 'bg-gray-600 hover:bg-gray-700 text-white' 
                    : 'bg-gray-500 hover:bg-gray-600 text-white'
                }`}
              >
                <Moon className="w-4 h-4" />
                <span>{isDarkMode ? 'Light' : 'Dark'}</span>
              </button>
              
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={showLabels}
                  onChange={(e) => setShowLabels(e.target.checked)}
                  className="rounded"
                />
                <span className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                  Labels
                </span>
              </label>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="relative h-screen pt-16">
        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full"
          style={{ background: 'radial-gradient(ellipse at center, #1a1a2e 0%, #0f0f0f 100%)' }}
        />

        {/* Control Panel */}
        <div className="absolute left-4 top-20 bottom-4 w-80 z-10">
          <ControlPanel
            isDarkMode={isDarkMode}
            onSpeedChange={handleSpeedChange}
            isPaused={isPaused}
          />
        </div>

        {/* Info Panel */}
        <div className="absolute right-4 top-20 bottom-4 w-80 z-10">
          <InfoPanel
            isDarkMode={isDarkMode}
            selectedPlanet={selectedPlanet}
            onClose={() => setSelectedPlanet(null)}
          />
        </div>

        {/* Camera Controls */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
          <CameraControls
            isDarkMode={isDarkMode}
            cameraMode={cameraMode}
            onCameraModeChange={handleCameraMode}
            onFollowPlanet={handleFollowPlanet}
          />
        </div>
      </div>
    </div>
  );
}

export default App;