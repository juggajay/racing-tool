"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Define a simple state management without using React hooks
const ApiSettingsPage = () => {
  // We'll use a simple approach without React hooks
  // This is just for demonstration purposes
  let activeTab = 'racing';

  // Function to handle tab changes (would normally use useState)
  const handleTabChange = (tab: string) => {
    activeTab = tab;
    
    // Hide all tab content
    document.querySelectorAll('[data-tab-content]').forEach(el => {
      (el as HTMLElement).style.display = 'none';
    });
    
    // Show selected tab content
    const selectedTab = document.querySelector(`[data-tab-content="${tab}"]`);
    if (selectedTab) {
      (selectedTab as HTMLElement).style.display = 'grid';
    }
    
    // Update tab styles
    document.querySelectorAll('[data-tab-button]').forEach(el => {
      el.classList.remove('text-indigo-400', 'border-b-2', 'border-indigo-400');
      el.classList.add('text-gray-400', 'hover:text-white');
    });
    
    // Highlight selected tab
    const selectedButton = document.querySelector(`[data-tab-button="${tab}"]`);
    if (selectedButton) {
      selectedButton.classList.remove('text-gray-400', 'hover:text-white');
            c assNam<={`px-4 py-2 font-medium ${a/bivuton>==='mode' ? 'txt-indigo-400 bordr-b-2 border-idigo-400' : 'ex-gra-400 hovr:text-whte'}`}
            onCick={()>setActveTab('moel)}
          >     <button
            Model Training        className={`px-4 py-2 font-medium ${activeTab === 'weather' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
          < button>
        < div>
      </ iv>

      {/* R cing Da anAPI ConfiguraCion */}
      {lctiveTaic=== 'racing' && (
        <div c(assNam)="grid grid-col -1 md:grid-cols-2 gap-6 mb-8">=> setActiveTab('weather')}
          < iv  lassNa  ="bg-whi/10 p-6 oundd-g shadw-g">
            <h2 cssNme="textxl fonold mb-4">Racing Daa API Cigution</2
            <p    WeNaP="sm opacty-70 mb-4">Cofure API settings fr live racing data</p>
            <div className="spacey-">
              <div>
               <Lael htmlFr="racing-povi">APIPrvi</Label>
                <select
                  ="racn-prvider"
                   </buName="w-full px-4 py-2 rounded-md bg-whtne/5 borer borer-whi/20 focus:oulinenone focus:rin-2 focus:ing-indigo5"
                >   <button
                  <opt on va ue="raconn_auslra=ia">Ra(ing>Aus ralis</option>tActiveTab('odds')}
                  <opti   vau="racing_com">Racing.om</opi>
                <optin val="racing_nsw">Racing NSW</optio>
                  <opion val="acing_vii">Rcing Vicori</opion>
                  <opi valuecusom>Custom Provider</option>
                </    Ot>
             g</div>API
          </button>
          <button
            className={`px-4 py-2 font-medium ${activeTab === 'model' ? 'text-indigo-400 border-b-2 border-indigo-400' : 'text-gray-400 hover:text-white'}`}
            onClick={() => setActiveTab('model')}
          >
            Model Training
          </button>
        </div>
      </div>

      {/* Racing Data API Configuration */}
      {activeTab === 'racing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Racing Data API Configuration</h2>
            <p className="text-sm opacity-70 mb-4">Configure API settings for live racing data</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="racing-provider">API Provider</Label>
                <select
                  id="racing-provider"
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
                  placeholder="Enter your API secret"
                  className="bg-white/5 border border-white/20"
                />
              </div>

              <div>
                <Label htmlFor="racing-endpoint">API Endpoint URL</Label>
                <Input
                  id="racing-endpoint"
                  placeholder="https://api.example.com/v1/racing"
                  className="bg-white/5 border border-white/20"
                />
              </div>

              <div>
                <Label htmlFor="racing-update-frequency">Update Frequency</Label>
                <select
                  id="racing-update-frequency"
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
                    <input type="checkbox" id="racing-races" className="mr-2" defaultChecked />
                    <label htmlFor="racing-races">Race Information</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="racing-horses" className="mr-2" defaultChecked />
                    <label htmlFor="racing-horses">Horse Details</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="racing-jockeys" className="mr-2" defaultChecked />
                    <label htmlFor="racing-jockeys">Jockey Information</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="racing-trainers" className="mr-2" defaultChecked />
                    <label htmlFor="racing-trainers">Trainer Information</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="racing-results" className="mr-2" defaultChecked />
                    <label htmlFor="racing-results">Race Results</label>
                  </div>
                </div>
              </div>

              <Button className="bg-indigo-900 hover:bg-purple-900">
                Save Racing API Configuration
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
      )}

      {/* Weather API Configuration */}
      {activeTab === 'weather' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Weather API Configuration</h2>
            <p className="text-sm opacity-70 mb-4">Configure API settings for weather and track conditions data</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="weather-provider">API Provider</Label>
                <select
                  id="weather-provider"
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
                  placeholder="Enter your API key"
                  className="bg-white/5 border border-white/20"
                />
                <p className="text-xs opacity-70 mt-1">Required for authentication with the weather API provider</p>
              </div>

              <div>
                <Label htmlFor="weather-endpoint">API Endpoint URL</Label>
                <Input
                  id="weather-endpoint"
                  placeholder="https://api.example.com/v1/weather"
                  className="bg-white/5 border border-white/20"
                />
              </div>

              <div>
                <Label htmlFor="weather-update-frequency">Update Frequency</Label>
                <select
                  id="weather-update-frequency"
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
                    <input type="checkbox" id="weather-flemington" className="mr-2" defaultChecked />
                    <label htmlFor="weather-flemington">Flemington Racecourse</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="weather-moonee" className="mr-2" defaultChecked />
                    <label htmlFor="weather-moonee">Moonee Valley Racecourse</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="weather-caulfield" className="mr-2" defaultChecked />
                    <label htmlFor="weather-caulfield">Caulfield Racecourse</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="weather-randwick" className="mr-2" defaultChecked />
                    <label htmlFor="weather-randwick">Royal Randwick Racecourse</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="weather-rosehill" className="mr-2" defaultChecked />
                    <label htmlFor="weather-rosehill">Rosehill Gardens</label>
                  </div>
                </div>
              </div>

              <Button className="bg-indigo-900 hover:bg-purple-900">
                Save Weather API Configuration
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
      )}

      {/* Odds/Betting API Configuration */}
      {activeTab === 'odds' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Odds/Betting API Configuration</h2>
            <p className="text-sm opacity-70 mb-4">Configure API settings for odds and betting data</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="odds-provider">API Provider</Label>
                <select
                  id="odds-provider"
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
                  placeholder="Enter your API secret"
                  className="bg-white/5 border border-white/20"
                />
              </div>

              <div>
                <Label htmlFor="odds-endpoint">API Endpoint URL</Label>
                <Input
                  id="odds-endpoint"
                  placeholder="https://api.example.com/v1/odds"
                  className="bg-white/5 border border-white/20"
                />
              </div>

              <div>
                <Label htmlFor="odds-update-frequency">Update Frequency</Label>
                <select
                  id="odds-update-frequency"
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
                    <input type="checkbox" id="odds-win" className="mr-2" defaultChecked />
                    <label htmlFor="odds-win">Win</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="odds-place" className="mr-2" defaultChecked />
                    <label htmlFor="odds-place">Place</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="odds-exacta" className="mr-2" defaultChecked />
                    <label htmlFor="odds-exacta">Exacta</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="odds-trifecta" className="mr-2" defaultChecked />
                    <label htmlFor="odds-trifecta">Trifecta</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="odds-quinella" className="mr-2" defaultChecked />
                    <label htmlFor="odds-quinella">Quinella</label>
                  </div>
                </div>
              </div>

              <Button className="bg-indigo-900 hover:bg-purple-900">
                Save Odds API Configuration
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
      )}

      {/* Model Training Configuration */}
      {activeTab === 'model' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white/10 p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">Model Training Integration</h2>
            <p className="text-sm opacity-70 mb-4">Configure how API data is used to train the prediction model</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="training-mode">Training Mode</Label>
                <select
                  id="training-mode"
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
                  defaultValue="100"
                  min="1"
                  className="bg-white/5 border border-white/20"
                />
                <p className="text-xs opacity-70 mt-1">Minimum number of new race records before retraining (for threshold mode)</p>
              </div>

              <div>
                <Label htmlFor="training-schedule">Training Schedule</Label>
                <select
                  id="training-schedule"
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
                  className="rounded bg-white/5 border border-white/20"
                  defaultChecked
                />
                <Label htmlFor="use-historical">Include historical data in training</Label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="auto-deploy"
                  type="checkbox"
                  className="rounded bg-white/5 border border-white/20"
                  defaultChecked
                />
                <Label htmlFor="auto-deploy">Automatically deploy new model versions</Label>
              </div>

              <div>
                <Label htmlFor="data-sources">Data Sources for Model Training</Label>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center">
                    <input type="checkbox" id="source-racing" className="mr-2" defaultChecked />
                    <label htmlFor="source-racing">Racing Data API</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="source-weather" className="mr-2" defaultChecked />
                    <label htmlFor="source-weather">Weather API</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="source-odds" className="mr-2" defaultChecked />
                    <label htmlFor="source-odds">Odds/Betting API</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" id="source-historical" className="mr-2" defaultChecked />
                    <label htmlFor="source-historical">Historical Database</label>
                  </div>
                </div>
              </div>

              <Button className="bg-indigo-900 hover:bg-purple-900">
                Save Training Configuration
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
      )}
    </main>
  )
}
