"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState, useEffect } from "react"

export default function ApiSettingsPage() {
  const [activeTab, setActiveTab] = useState('racing');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState({ success: false, message: '' });
  
  // State for Racing API settings
  const [racingSettings, setRacingSettings] = useState({
    provider: 'racing_australia',
    apiKey: '',
    apiSecret: '',
    endpoint: '',
    updateFrequency: '15min',
    dataTypes: {
      races: true,
      horses: true,
      jockeys: true,
      trainers: true,
      results: true
    }
  });
  
  // State for Weather API settings
  const [weatherSettings, setWeatherSettings] = useState({
    provider: 'openweather',
    apiKey: '',
    endpoint: '',
    updateFrequency: '1hour',
    trackIntegration: 'automatic',
    locations: {
      flemington: true,
      moonee: true,
      caulfield: true,
      randwick: true,
      rosehill: true
    }
  });
  
  // State for Odds API settings
  const [oddsSettings, setOddsSettings] = useState({
    provider: 'betfair',
    apiKey: '',
    apiSecret: '',
    endpoint: '',
    updateFrequency: '5min',
    betTypes: {
      win: true,
      place: true,
      exacta: true,
      trifecta: true,
      quinella: true
    }
  });
  
  // State for Model Training settings
  const [modelSettings, setModelSettings] = useState({
    trainingMode: 'scheduled',
    dataThreshold: 100,
    trainingSchedule: 'weekly',
    useHistorical: true,
    autoDeploy: true,
    dataSources: {
      racing: true,
      weather: true,
      odds: true,
      historical: true
    }
  });
  
  // Load saved settings on component mount
  useEffect(() => {
    const loadSettings = async () => {
      try {
        // Load Racing API settings
        const racingResponse = await fetch('/api/settings/racing');
        if (racingResponse.ok) {
          const data = await racingResponse.json();
          setRacingSettings(data);
        }
        
        // Load Weather API settings
        const weatherResponse = await fetch('/api/settings/weather');
        if (weatherResponse.ok) {
          const data = await weatherResponse.json();
          setWeatherSettings(data);
        }
        
        // Load Odds API settings
        const oddsResponse = await fetch('/api/settings/odds');
        if (oddsResponse.ok) {
          const data = await oddsResponse.json();
          setOddsSettings(data);
        }
        
        // Load Model Training settings
        const modelResponse = await fetch('/api/settings/model');
        if (modelResponse.ok) {
          const data = await modelResponse.json();
          setModelSettings(data);
        }
      } catch (error) {
        console.error('Error loading settings:', error);
      }
    };
    
    loadSettings();
  }, []);
  
  // Handle tab switching
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
    // Clear any previous save status
    setSaveStatus({ success: false, message: '' });
  };
  
  // Handle Racing API form changes
  const handleRacingChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    if (id === 'racing-provider') {
      setRacingSettings({ ...racingSettings, provider: value });
    } else if (id === 'racing-key') {
      setRacingSettings({ ...racingSettings, apiKey: value });
    } else if (id === 'racing-secret') {
      setRacingSettings({ ...racingSettings, apiSecret: value });
    } else if (id === 'racing-endpoint') {
      setRacingSettings({ ...racingSettings, endpoint: value });
    } else if (id === 'racing-update-frequency') {
      setRacingSettings({ ...racingSettings, updateFrequency: value });
    } else if (id.startsWith('racing-') && type === 'checkbox') {
      const dataType = id.replace('racing-', '');
      setRacingSettings({
        ...racingSettings,
        dataTypes: {
          ...racingSettings.dataTypes,
          [dataType]: checked
        }
      });
    }
  };
  
  // Handle Weather API form changes
  const handleWeatherChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    if (id === 'weather-provider') {
      setWeatherSettings({ ...weatherSettings, provider: value });
    } else if (id === 'weather-key') {
      setWeatherSettings({ ...weatherSettings, apiKey: value });
    } else if (id === 'weather-endpoint') {
      setWeatherSettings({ ...weatherSettings, endpoint: value });
    } else if (id === 'weather-update-frequency') {
      setWeatherSettings({ ...weatherSettings, updateFrequency: value });
    } else if (id === 'weather-track-integration') {
      setWeatherSettings({ ...weatherSettings, trackIntegration: value });
    } else if (id.startsWith('weather-') && type === 'checkbox') {
      const location = id.replace('weather-', '');
      setWeatherSettings({
        ...weatherSettings,
        locations: {
          ...weatherSettings.locations,
          [location]: checked
        }
      });
    }
  };
  
  // Handle Odds API form changes
  const handleOddsChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    if (id === 'odds-provider') {
      setOddsSettings({ ...oddsSettings, provider: value });
    } else if (id === 'odds-key') {
      setOddsSettings({ ...oddsSettings, apiKey: value });
    } else if (id === 'odds-secret') {
      setOddsSettings({ ...oddsSettings, apiSecret: value });
    } else if (id === 'odds-endpoint') {
      setOddsSettings({ ...oddsSettings, endpoint: value });
    } else if (id === 'odds-update-frequency') {
      setOddsSettings({ ...oddsSettings, updateFrequency: value });
    } else if (id.startsWith('odds-') && type === 'checkbox') {
      const betType = id.replace('odds-', '');
      setOddsSettings({
        ...oddsSettings,
        betTypes: {
          ...oddsSettings.betTypes,
          [betType]: checked
        }
      });
    }
  };
  
  // Handle Model Training form changes
  const handleModelChange = (e) => {
    const { id, value, type, checked } = e.target;
    
    if (id === 'training-mode') {
      setModelSettings({ ...modelSettings, trainingMode: value });
    } else if (id === 'data-threshold') {
      setModelSettings({ ...modelSettings, dataThreshold: parseInt(value) });
    } else if (id === 'training-schedule') {
      setModelSettings({ ...modelSettings, trainingSchedule: value });
    } else if (id === 'use-historical') {
      setModelSettings({ ...modelSettings, useHistorical: checked });
    } else if (id === 'auto-deploy') {
      setModelSettings({ ...modelSettings, autoDeploy: checked });
    } else if (id.startsWith('source-') && type === 'checkbox') {
      const source = id.replace('source-', '');
      setModelSettings({
        ...modelSettings,
        dataSources: {
          ...modelSettings.dataSources,
          [source]: checked
        }
      });
    }
  };
  
  // Save Racing API settings
  const saveRacingSettings = async () => {
    setIsSaving(true);
    setSaveStatus({ success: false, message: '' });
    
    try {
      const response = await fetch('/api/settings/racing', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(racingSettings),
      });
      
      if (response.ok) {
        setSaveStatus({ success: true, message: 'Racing API settings saved successfully!' });
      } else {
        const error = await response.json();
        setSaveStatus({ success: false, message: `Error: ${error.message}` });
      }
    } catch (error) {
      setSaveStatus({ success: false, message: `Error: ${error.message}` });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save Weather API settings
  const saveWeatherSettings = async () => {
    setIsSaving(true);
    setSaveStatus({ success: false, message: '' });
    
    try {
      const response = await fetch('/api/settings/weather', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(weatherSettings),
      });
      
      if (response.ok) {
        setSaveStatus({ success: true, message: 'Weather API settings saved successfully!' });
      } else {
        const error = await response.json();
        setSaveStatus({ success: false, message: `Error: ${error.message}` });
      }
    } catch (error) {
      setSaveStatus({ success: false, message: `Error: ${error.message}` });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save Odds API settings
  const saveOddsSettings = async () => {
    setIsSaving(true);
    setSaveStatus({ success: false, message: '' });
    
    try {
      const response = await fetch('/api/settings/odds', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(oddsSettings),
      });
      
      if (response.ok) {
        setSaveStatus({ success: true, message: 'Odds API settings saved successfully!' });
      } else {
        const error = await response.json();
        setSaveStatus({ success: false, message: `Error: ${error.message}` });
      }
    } catch (error) {
      setSaveStatus({ success: false, message: `Error: ${error.message}` });
    } finally {
      setIsSaving(false);
    }
  };
  
  // Save Model Training settings
  const saveModelSettings = async () => {
    setIsSaving(true);
    setSaveStatus({ success: false, message: '' });
    
    try {
      const response = await fetch('/api/settings/model', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(modelSettings),
      });
      
      if (response.ok) {
        setSaveStatus({ success: true, message: 'Model training settings saved successfully!' });
      } else {
        const error = await response.json();
        setSaveStatus({ success: false, message: `Error: ${error.message}` });
      }
    } catch (error) {
      setSaveStatus({ success: false, message: `Error: ${error.message}` });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">API Integration</h1>
      </div>

      {/* API Tabs */}
      <div className="mb-6 border-b border-gray-800">
        <div className="flex space-x-1">
          <button
            onClick={() => handleTabChange('racing')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'racing'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Racing Data API
          </button>
          <button
            onClick={() => handleTabChange('weather')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'weather'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Weather API
          </button>
          <button
            onClick={() => handleTabChange('odds')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'odds'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Odds/Betting API
          </button>
          <button
            onClick={() => handleTabChange('model')}
            className={`px-4 py-2 font-medium ${
              activeTab === 'model'
                ? 'text-indigo-400 border-b-2 border-indigo-400'
                : 'text-gray-400 hover:text-white'
            }`}
          >
            Model Training
          </button>
        </div>
      </div>
      
      {/* Save Status Message */}
      {saveStatus.message && (
        <div className={`mb-4 p-3 rounded-md ${saveStatus.success ? 'bg-green-900/50 border border-green-500' : 'bg-red-900/50 border border-red-500'}`}>
          {saveStatus.message}
        </div>
      )}

      {/* Racing Data API Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" style={{display: activeTab === 'racing' ? 'grid' : 'none'}}>
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Racing Data API Configuration</h2>
          <p className="text-sm opacity-70 mb-4">Configure API settings for live racing data</p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="racing-provider">API Provider</Label>
              <select
                id="racing-provider"
                value={racingSettings.provider}
                onChange={handleRacingChange}
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              >
                <option value="racing_australia">Racing Australia</option>
                <option value="racing_com">Racing.com</option>
                <option value="racing_nsw">Racing NSW</option>
                <option value="racing_victoria">Racing Victoria</option>
                <option value="custom">Custom Provider</option>
              </select>
            </div>

            <div>
              <Label htmlFor="racing-key">API Key</Label>
              <Input
                id="racing-key"
                value={racingSettings.apiKey}
                onChange={handleRacingChange}
                placeholder="Enter your API key"
                className="bg-white/5 border border-white/20"
              />
              <p className="text-xs opacity-70 mt-1">Required for authentication with the API provider</p>
            </div>

            <div>
              <Label htmlFor="racing-secret">API Secret</Label>
              <Input
                id="racing-secret"
                type="password"
                value={racingSettings.apiSecret}
                onChange={handleRacingChange}
                placeholder="Enter your API secret"
                className="bg-white/5 border border-white/20"
              />
            </div>

            <div>
              <Label htmlFor="racing-endpoint">API Endpoint URL</Label>
              <Input
                id="racing-endpoint"
                value={racingSettings.endpoint}
                onChange={handleRacingChange}
                placeholder="https://api.example.com/v1/racing"
                className="bg-white/5 border border-white/20"
              />
            </div>

            <div>
              <Label htmlFor="racing-update-frequency">Update Frequency</Label>
              <select
                id="racing-update-frequency"
                value={racingSettings.updateFrequency}
                onChange={handleRacingChange}
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              >
                <option value="5min">Every 5 minutes</option>
                <option value="15min">Every 15 minutes</option>
                <option value="30min">Every 30 minutes</option>
                <option value="1hour">Hourly</option>
                <option value="daily">Daily</option>
                <option value="manual">Manual only</option>
              </select>
            </div>

            <div>
              <Label htmlFor="racing-data-types">Data Types to Fetch</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="racing-races"
                    checked={racingSettings.dataTypes.races}
                    onChange={handleRacingChange}
                    className="mr-2"
                  />
                  <label htmlFor="racing-races">Race Information</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="racing-horses"
                    checked={racingSettings.dataTypes.horses}
                    onChange={handleRacingChange}
                    className="mr-2"
                  />
                  <label htmlFor="racing-horses">Horse Details</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="racing-jockeys"
                    checked={racingSettings.dataTypes.jockeys}
                    onChange={handleRacingChange}
                    className="mr-2"
                  />
                  <label htmlFor="racing-jockeys">Jockey Information</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="racing-trainers"
                    checked={racingSettings.dataTypes.trainers}
                    onChange={handleRacingChange}
                    className="mr-2"
                  />
                  <label htmlFor="racing-trainers">Trainer Information</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="racing-results"
                    checked={racingSettings.dataTypes.results}
                    onChange={handleRacingChange}
                    className="mr-2"
                  />
                  <label htmlFor="racing-results">Race Results</label>
                </div>
              </div>
            </div>

            <Button
              className="bg-indigo-900 hover:bg-purple-900"
              onClick={saveRacingSettings}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Racing API Configuration'}
            </Button>
          </div>
        </div>

        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Racing Data API Status</h2>
          <p className="text-sm opacity-70 mb-4">Check connection status and test API functionality</p>
          <div className="mb-6 p-4 bg-white/5 rounded-md border border-white/10">
            <h3 className="font-medium mb-2">Connection Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">API Status</div>
                <div className="flex items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <div>Connected</div>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">Last Sync</div>
                <div className="mt-1">15 minutes ago</div>
              </div>
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">Races Fetched</div>
                <div className="mt-1">128</div>
              </div>
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">API Calls Today</div>
                <div className="mt-1">87 / 1,000</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Button className="bg-indigo-900 hover:bg-purple-900">
              Test API Connection
            </Button>
            <Button variant="outline" className="opacity-100">
              Sync Racing Data Now
            </Button>
            <Button variant="outline" className="opacity-100">
              View API Logs
            </Button>
          </div>
        </div>
      </div>

      {/* Weather API Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" style={{display: activeTab === 'weather' ? 'grid' : 'none'}}>
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Weather API Configuration</h2>
          <p className="text-sm opacity-70 mb-4">Configure API settings for weather and track conditions data</p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="weather-provider">API Provider</Label>
              <select
                id="weather-provider"
                value={weatherSettings.provider}
                onChange={handleWeatherChange}
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              >
                <option value="openweather">OpenWeather API</option>
                <option value="weatherapi">WeatherAPI.com</option>
                <option value="accuweather">AccuWeather</option>
                <option value="bom">Bureau of Meteorology (Australia)</option>
                <option value="custom">Custom Provider</option>
              </select>
            </div>

            <div>
              <Label htmlFor="weather-key">API Key</Label>
              <Input
                id="weather-key"
                value={weatherSettings.apiKey}
                onChange={handleWeatherChange}
                placeholder="Enter your API key"
                className="bg-white/5 border border-white/20"
              />
              <p className="text-xs opacity-70 mt-1">Required for authentication with the weather API provider</p>
            </div>

            <div>
              <Label htmlFor="weather-endpoint">API Endpoint URL</Label>
              <Input
                id="weather-endpoint"
                value={weatherSettings.endpoint}
                onChange={handleWeatherChange}
                placeholder="https://api.example.com/v1/weather"
                className="bg-white/5 border border-white/20"
              />
            </div>

            <div>
              <Label htmlFor="weather-update-frequency">Update Frequency</Label>
              <select
                id="weather-update-frequency"
                value={weatherSettings.updateFrequency}
                onChange={handleWeatherChange}
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              >
                <option value="30min">Every 30 minutes</option>
                <option value="1hour">Hourly</option>
                <option value="3hour">Every 3 hours</option>
                <option value="6hour">Every 6 hours</option>
                <option value="daily">Daily</option>
                <option value="manual">Manual only</option>
              </select>
            </div>

            <div>
              <Label htmlFor="weather-track-integration">Track Condition Integration</Label>
              <select
                id="weather-track-integration"
                value={weatherSettings.trackIntegration}
                onChange={handleWeatherChange}
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              >
                <option value="automatic">Automatic (Calculate from weather data)</option>
                <option value="manual">Manual (Enter track conditions separately)</option>
                <option value="hybrid">Hybrid (Calculate and allow manual override)</option>
              </select>
              <p className="text-xs opacity-70 mt-1">How to determine track conditions based on weather data</p>
            </div>

            <div>
              <Label htmlFor="weather-locations">Track Locations</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="weather-flemington"
                    checked={weatherSettings.locations.flemington}
                    onChange={handleWeatherChange}
                    className="mr-2"
                  />
                  <label htmlFor="weather-flemington">Flemington Racecourse</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="weather-moonee"
                    checked={weatherSettings.locations.moonee}
                    onChange={handleWeatherChange}
                    className="mr-2"
                  />
                  <label htmlFor="weather-moonee">Moonee Valley Racecourse</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="weather-caulfield"
                    checked={weatherSettings.locations.caulfield}
                    onChange={handleWeatherChange}
                    className="mr-2"
                  />
                  <label htmlFor="weather-caulfield">Caulfield Racecourse</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="weather-randwick"
                    checked={weatherSettings.locations.randwick}
                    onChange={handleWeatherChange}
                    className="mr-2"
                  />
                  <label htmlFor="weather-randwick">Royal Randwick Racecourse</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="weather-rosehill"
                    checked={weatherSettings.locations.rosehill}
                    onChange={handleWeatherChange}
                    className="mr-2"
                  />
                  <label htmlFor="weather-rosehill">Rosehill Gardens</label>
                </div>
              </div>
            </div>

            <Button
              className="bg-indigo-900 hover:bg-purple-900"
              onClick={saveWeatherSettings}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Weather API Configuration'}
            </Button>
          </div>
        </div>

        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Weather API Status</h2>
          <p className="text-sm opacity-70 mb-4">Check connection status and test API functionality</p>
          <div className="mb-6 p-4 bg-white/5 rounded-md border border-white/10">
            <h3 className="font-medium mb-2">Connection Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">API Status</div>
                <div className="flex items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <div>Connected</div>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">Last Sync</div>
                <div className="mt-1">45 minutes ago</div>
              </div>
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">Locations Tracked</div>
                <div className="mt-1">5</div>
              </div>
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">API Calls Today</div>
                <div className="mt-1">42 / 500</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Button className="bg-indigo-900 hover:bg-purple-900">
              Test API Connection
            </Button>
            <Button variant="outline" className="opacity-100">
              Sync Weather Data Now
            </Button>
            <Button variant="outline" className="opacity-100">
              View Track Conditions
            </Button>
          </div>
        </div>
      </div>

      {/* Odds/Betting API Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" style={{display: activeTab === 'odds' ? 'grid' : 'none'}}>
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Odds/Betting API Configuration</h2>
          <p className="text-sm opacity-70 mb-4">Configure API settings for odds and betting data</p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="odds-provider">API Provider</Label>
              <select
                id="odds-provider"
                value={oddsSettings.provider}
                onChange={handleOddsChange}
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              >
                <option value="betfair">Betfair</option>
                <option value="sportsbet">Sportsbet</option>
                <option value="tab">TAB</option>
                <option value="ladbrokes">Ladbrokes</option>
                <option value="custom">Custom Provider</option>
              </select>
            </div>

            <div>
              <Label htmlFor="odds-key">API Key</Label>
              <Input
                id="odds-key"
                value={oddsSettings.apiKey}
                onChange={handleOddsChange}
                placeholder="Enter your API key"
                className="bg-white/5 border border-white/20"
              />
              <p className="text-xs opacity-70 mt-1">Required for authentication with the betting API provider</p>
            </div>

            <div>
              <Label htmlFor="odds-secret">API Secret</Label>
              <Input
                id="odds-secret"
                type="password"
                value={oddsSettings.apiSecret}
                onChange={handleOddsChange}
                placeholder="Enter your API secret"
                className="bg-white/5 border border-white/20"
              />
            </div>

            <div>
              <Label htmlFor="odds-endpoint">API Endpoint URL</Label>
              <Input
                id="odds-endpoint"
                value={oddsSettings.endpoint}
                onChange={handleOddsChange}
                placeholder="https://api.example.com/v1/odds"
                className="bg-white/5 border border-white/20"
              />
            </div>

            <div>
              <Label htmlFor="odds-update-frequency">Update Frequency</Label>
              <select
                id="odds-update-frequency"
                value={oddsSettings.updateFrequency}
                onChange={handleOddsChange}
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              >
                <option value="1min">Every minute</option>
                <option value="5min">Every 5 minutes</option>
                <option value="15min">Every 15 minutes</option>
                <option value="30min">Every 30 minutes</option>
                <option value="1hour">Hourly</option>
                <option value="manual">Manual only</option>
              </select>
            </div>

            <div>
              <Label htmlFor="odds-bet-types">Bet Types to Track</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="odds-win"
                    checked={oddsSettings.betTypes.win}
                    onChange={handleOddsChange}
                    className="mr-2"
                  />
                  <label htmlFor="odds-win">Win</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="odds-place"
                    checked={oddsSettings.betTypes.place}
                    onChange={handleOddsChange}
                    className="mr-2"
                  />
                  <label htmlFor="odds-place">Place</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="odds-exacta"
                    checked={oddsSettings.betTypes.exacta}
                    onChange={handleOddsChange}
                    className="mr-2"
                  />
                  <label htmlFor="odds-exacta">Exacta</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="odds-trifecta"
                    checked={oddsSettings.betTypes.trifecta}
                    onChange={handleOddsChange}
                    className="mr-2"
                  />
                  <label htmlFor="odds-trifecta">Trifecta</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="odds-quinella"
                    checked={oddsSettings.betTypes.quinella}
                    onChange={handleOddsChange}
                    className="mr-2"
                  />
                  <label htmlFor="odds-quinella">Quinella</label>
                </div>
              </div>
            </div>

            <Button
              className="bg-indigo-900 hover:bg-purple-900"
              onClick={saveOddsSettings}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Odds API Configuration'}
            </Button>
          </div>
        </div>

        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Odds API Status</h2>
          <p className="text-sm opacity-70 mb-4">Check connection status and test API functionality</p>
          <div className="mb-6 p-4 bg-white/5 rounded-md border border-white/10">
            <h3 className="font-medium mb-2">Connection Status</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">API Status</div>
                <div className="flex items-center mt-1">
                  <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                  <div>Connected</div>
                </div>
              </div>
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">Last Sync</div>
                <div className="mt-1">5 minutes ago</div>
              </div>
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">Markets Tracked</div>
                <div className="mt-1">24</div>
              </div>
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">API Calls Today</div>
                <div className="mt-1">156 / 2,000</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Button className="bg-indigo-900 hover:bg-purple-900">
              Test API Connection
            </Button>
            <Button variant="outline" className="opacity-100">
              Sync Odds Data Now
            </Button>
            <Button variant="outline" className="opacity-100">
              View Market Movements
            </Button>
          </div>
        </div>
      </div>

      {/* Model Training Configuration */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8" style={{display: activeTab === 'model' ? 'grid' : 'none'}}>
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Model Training Integration</h2>
          <p className="text-sm opacity-70 mb-4">Configure how API data is used to train the prediction model</p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="training-mode">Training Mode</Label>
              <select
                id="training-mode"
                value={modelSettings.trainingMode}
                onChange={handleModelChange}
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              >
                <option value="continuous">Continuous (Train as data arrives)</option>
                <option value="scheduled">Scheduled (Train at specific intervals)</option>
                <option value="threshold">Threshold-based (Train when enough new data)</option>
                <option value="manual">Manual only</option>
              </select>
            </div>

            <div>
              <Label htmlFor="data-threshold">Data Threshold</Label>
              <Input
                id="data-threshold"
                type="number"
                value={modelSettings.dataThreshold}
                onChange={handleModelChange}
                min="1"
                className="bg-white/5 border border-white/20"
              />
              <p className="text-xs opacity-70 mt-1">Minimum number of new race records before retraining (for threshold mode)</p>
            </div>

            <div>
              <Label htmlFor="training-schedule">Training Schedule</Label>
              <select
                id="training-schedule"
                value={modelSettings.trainingSchedule}
                onChange={handleModelChange}
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white"
              >
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
                <option value="monthly">Monthly</option>
              </select>
              <p className="text-xs opacity-70 mt-1">When to run scheduled training (for scheduled mode)</p>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="use-historical"
                type="checkbox"
                checked={modelSettings.useHistorical}
                onChange={handleModelChange}
                className="rounded bg-white/5 border border-white/20"
              />
              <Label htmlFor="use-historical">Include historical data in training</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="auto-deploy"
                type="checkbox"
                checked={modelSettings.autoDeploy}
                onChange={handleModelChange}
                className="rounded bg-white/5 border border-white/20"
              />
              <Label htmlFor="auto-deploy">Automatically deploy new model versions</Label>
            </div>

            <div>
              <Label htmlFor="data-sources">Data Sources for Model Training</Label>
              <div className="mt-2 space-y-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="source-racing"
                    checked={modelSettings.dataSources.racing}
                    onChange={handleModelChange}
                    className="mr-2"
                  />
                  <label htmlFor="source-racing">Racing Data API</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="source-weather"
                    checked={modelSettings.dataSources.weather}
                    onChange={handleModelChange}
                    className="mr-2"
                  />
                  <label htmlFor="source-weather">Weather API</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="source-odds"
                    checked={modelSettings.dataSources.odds}
                    onChange={handleModelChange}
                    className="mr-2"
                  />
                  <label htmlFor="source-odds">Odds/Betting API</label>
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="source-historical"
                    checked={modelSettings.dataSources.historical}
                    onChange={handleModelChange}
                    className="mr-2"
                  />
                  <label htmlFor="source-historical">Historical Database</label>
                </div>
              </div>
            </div>

            <Button
              className="bg-indigo-900 hover:bg-purple-900"
              onClick={saveModelSettings}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Training Configuration'}
            </Button>
          </div>
        </div>

        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Model Status</h2>
          <p className="text-sm opacity-70 mb-4">Check model training status and performance</p>
          <div className="mb-6 p-4 bg-white/5 rounded-md border border-white/10">
            <h3 className="font-medium mb-2">Current Model</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">Model Version</div>
                <div className="mt-1">v2.4.1</div>
              </div>
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">Last Trained</div>
                <div className="mt-1">Yesterday, 8:45 PM</div>
              </div>
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">Training Data Size</div>
                <div className="mt-1">12,456 races</div>
              </div>
              <div className="bg-white/5 p-3 rounded-md border border-white/10">
                <div className="text-sm opacity-70">Accuracy (Top-3)</div>
                <div className="mt-1 text-green-400">93.2%</div>
              </div>
            </div>
          </div>

          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <Button className="bg-indigo-900 hover:bg-purple-900">
              Train Model Now
            </Button>
            <Button variant="outline" className="opacity-100">
              View Training History
            </Button>
            <Button variant="outline" className="opacity-100">
              Export Model Data
            </Button>
          </div>
        </div>
      </div>
    </main>
  )
}