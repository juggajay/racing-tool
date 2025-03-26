'use client';

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState('');
  const [savedApiKey, setSavedApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  // Load saved API key on component mount
  useEffect(() => {
    const loadSavedApiKey = () => {
      try {
        const savedKey = localStorage.getItem('puntingFormApiKey');
        if (savedKey) {
          setSavedApiKey(savedKey);
          setApiKey(savedKey);
        }
      } catch (error) {
        console.error('Error loading API key from localStorage:', error);
      }
    };

    loadSavedApiKey();
  }, []);

  const handleSaveApiKey = async () => {
    try {
      setIsSaving(true);
      setSaveStatus('idle');
      setStatusMessage('');

      // Validate API key (basic validation)
      if (!apiKey.trim()) {
        setSaveStatus('error');
        setStatusMessage('API key cannot be empty');
        return;
      }

      // Test the API key with a simple request
      const response = await fetch(`/api/punting-form?api_key=${encodeURIComponent(apiKey)}&endpoint=races`);
      const data = await response.json();

      if (!response.ok || data.error) {
        setSaveStatus('error');
        setStatusMessage(data.error || 'Invalid API key');
        return;
      }

      // Save API key to localStorage
      localStorage.setItem('puntingFormApiKey', apiKey);
      setSavedApiKey(apiKey);
      setSaveStatus('success');
      setStatusMessage('API key saved successfully');
    } catch (error) {
      console.error('Error saving API key:', error);
      setSaveStatus('error');
      setStatusMessage('An error occurred while saving the API key');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <div className="w-full sm:w-auto">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">Back to Home</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4">API Settings</h2>
        
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Punting Form API</h3>
          <p className="text-sm opacity-70 mb-4">
            Enter your Punting Form API key to access racing data. You can find your API key in your 
            <a href="https://www.puntingform.com.au/member/login" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300"> Punting Form account</a>.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium mb-1">API Key</label>
              <input
                id="apiKey"
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Punting Form API key"
              />
            </div>
            
            <div className="flex items-center gap-4">
              <Button 
                onClick={handleSaveApiKey} 
                disabled={isSaving || apiKey === savedApiKey}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? 'Saving...' : 'Save API Key'}
              </Button>
              
              {saveStatus === 'success' && (
                <span className="text-green-500 text-sm">{statusMessage}</span>
              )}
              
              {saveStatus === 'error' && (
                <span className="text-red-500 text-sm">{statusMessage}</span>
              )}
            </div>
          </div>
        </div>
        
        <div className="border-t border-white/10 pt-4 mt-6">
          <h3 className="text-lg font-medium mb-2">API Usage</h3>
          <p className="text-sm opacity-70 mb-2">
            Your API key is stored securely in your browser&apos;s local storage and is only sent to the Punting Form API when making requests.
          </p>
          <p className="text-sm opacity-70">
            The API key is used to fetch racing data for the following features:
          </p>
          <ul className="list-disc list-inside text-sm opacity-70 mt-2 space-y-1">
            <li>Upcoming races</li>
            <li>Race details and entries</li>
            <li>Horse information and form</li>
            <li>Race predictions and analysis</li>
          </ul>
        </div>
      </div>
      
      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Application Settings</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="theme" className="block text-sm font-medium mb-1">Theme</label>
            <select
              id="theme"
              className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultValue="dark"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System Default</option>
            </select>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              id="notifications"
              type="checkbox"
              className="rounded bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultChecked
            />
            <label htmlFor="notifications" className="text-sm font-medium">Enable Notifications</label>
          </div>
          
          <div className="flex items-center gap-2">
            <input
              id="analytics"
              type="checkbox"
              className="rounded bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
              defaultChecked
            />
            <label htmlFor="analytics" className="text-sm font-medium">Enable Analytics</label>
          </div>
        </div>
      </div>
      
      <div className="text-center">
        <p className="text-xs md:text-sm opacity-70">
          Australian Horse Racing Prediction System © 2025
        </p>
      </div>
    </main>
  );
}