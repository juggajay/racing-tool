"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function ApiSettingsPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">API Integration</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Live Data API Configuration</h2>
          <p className="text-sm opacity-70 mb-4">Configure API settings for live racing data</p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="api-provider">API Provider</Label>
              <select
                id="api-provider"
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="racing_australia">Racing Australia</option>
                <option value="betfair">Betfair</option>
                <option value="racing_com">Racing.com</option>
                <option value="custom">Custom Provider</option>
              </select>
            </div>

            <div>
              <Label htmlFor="api-key">API Key</Label>
              <Input
                id="api-key"
                placeholder="Enter your API key"
                className="bg-white/5 border border-white/20"
              />
              <p className="text-xs opacity-70 mt-1">Required for authentication with the API provider</p>
            </div>

            <div>
              <Label htmlFor="api-secret">API Secret</Label>
              <Input
                id="api-secret"
                type="password"
                placeholder="Enter your API secret"
                className="bg-white/5 border border-white/20"
              />
            </div>

            <div>
              <Label htmlFor="api-endpoint">API Endpoint URL</Label>
              <Input
                id="api-endpoint"
                placeholder="https://api.example.com/v1/racing"
                className="bg-white/5 border border-white/20"
              />
            </div>

            <div>
              <Label htmlFor="update-frequency">Update Frequency</Label>
              <select
                id="update-frequency"
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="5min">Every 5 minutes</option>
                <option value="15min">Every 15 minutes</option>
                <option value="30min">Every 30 minutes</option>
                <option value="1hour">Hourly</option>
                <option value="daily">Daily</option>
                <option value="manual">Manual only</option>
              </select>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700">
              Save API Configuration
            </Button>
          </div>
        </div>

        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Model Training Integration</h2>
          <p className="text-sm opacity-70 mb-4">Configure how live data is used to train the prediction model</p>
          <div className="space-y-4">
            <div>
              <Label htmlFor="training-mode">Training Mode</Label>
              <select
                id="training-mode"
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
              />
              <Label htmlFor="use-historical">Include historical data in training</Label>
            </div>

            <div className="flex items-center space-x-2">
              <input
                id="auto-deploy"
                type="checkbox"
                className="rounded bg-white/5 border border-white/20"
              />
              <Label htmlFor="auto-deploy">Automatically deploy new model versions</Label>
            </div>

            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Training Configuration
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white/10 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-4">API Status and Testing</h2>
        <p className="text-sm opacity-70 mb-4">Check connection status and test API functionality</p>
        <div className="mb-6 p-4 bg-white/5 rounded-md border border-white/10">
          <h3 className="font-medium mb-2">Connection Status</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white/5 p-3 rounded-md border border-white/10">
              <div className="text-sm opacity-70">API Status</div>
              <div className="flex items-center mt-1">
                <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                <div>Connected</div>
              </div>
            </div>
            <div className="bg-white/5 p-3 rounded-md border border-white/10">
              <div className="text-sm opacity-70">Last Sync</div>
              <div className="mt-1">10 minutes ago</div>
            </div>
            <div className="bg-white/5 p-3 rounded-md border border-white/10">
              <div className="text-sm opacity-70">Data Points</div>
              <div className="mt-1">12,456</div>
            </div>
            <div className="bg-white/5 p-3 rounded-md border border-white/10">
              <div className="text-sm opacity-70">API Calls Today</div>
              <div className="mt-1">145 / 1,000</div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <Button className="bg-blue-600 hover:bg-blue-700">
            Test API Connection
          </Button>
          <Button variant="outline" className="opacity-100">
            Sync Data Now
          </Button>
          <Button variant="outline" className="opacity-100">
            View API Logs
          </Button>
          <Button variant="outline" className="opacity-100">
            Clear Cached Data
          </Button>
        </div>
      </div>
    </main>
  )
}