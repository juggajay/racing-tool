'use client';

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SettingsPage() {
  const [apiKey, setApiKey] = useState(''); // Initialize empty, load from storage
  const [savedApiKey, setSavedApiKey] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [saveStatusMessage, setSaveStatusMessage] = useState('');

  // State for API testing
  const [isTesting, setIsTesting] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [testStatusMessage, setTestStatusMessage] = useState('');

  // Load saved API key on component mount
  useEffect(() => {
    const loadSavedApiKey = () => {
      try {
        if (typeof window !== 'undefined') {
          const savedKey = localStorage.getItem('puntingFormApiKey');
          if (savedKey) {
            setSavedApiKey(savedKey);
            setApiKey(savedKey);
          }
        }
      } catch (error) {
        console.error('Error loading API key from localStorage:', error);
      }
    };
    loadSavedApiKey();
  }, []);

  // Function to test the API key connection
  const handleTestApiKey = async () => {
     setIsTesting(true);
     setTestStatus('idle');
     setTestStatusMessage('Testing...');

     try {
       if (!apiKey.trim()) {
         throw new Error('API key cannot be empty');
       }

       // Use the proxy API to test the connection
       const testResponse = await fetch(`/api/punting-form?endpoint=form/comment&api_key=${encodeURIComponent(apiKey)}`);
       const testData = await testResponse.json();

       if (!testResponse.ok || testData.error || (testData.data && typeof testData.data === 'string' && testData.data.includes('Authentication Failed'))) {
         let errMsg = 'Test failed.';
         if (testData.error) errMsg = testData.error;
         else if (testData.details) errMsg = testData.details;
         else if (testData.message) errMsg = testData.message;
         else if (testData.data && typeof testData.data === 'string') errMsg = testData.data.substring(0, 100);
         throw new Error(errMsg);
       }

       // Check if data looks reasonable (e.g., is an array for form/comment)
       if (testData.success && Array.isArray(testData.data)) {
          setTestStatus('success');
          setTestStatusMessage(`Connection successful! Received ${testData.data.length} comment records.`);
       } else {
          // Handle cases where API returns success but unexpected data format
          console.warn("API test successful but data format might be unexpected:", testData.data);
          setTestStatus('success'); // Still counts as connection success
          setTestStatusMessage(`Connection successful, but response format was unexpected.`);
       }

     } catch (error) {
       console.error('Error testing API key:', error);
       setTestStatus('error');
       setTestStatusMessage(error instanceof Error ? error.message : 'An unknown error occurred during testing.');
     } finally {
       setIsTesting(false);
     }
  };


  // Function to save the API key
  const handleSaveApiKey = async () => {
    setIsSaving(true);
    setSaveStatus('idle');
    setSaveStatusMessage('');
    // Reset test status as well
    setTestStatus('idle');
    setTestStatusMessage('');

    try {
      if (!apiKey.trim()) {
        throw new Error('API key cannot be empty');
      }

      // Test the API key before saving (reuse test logic)
      const testResponse = await fetch(`/api/punting-form?endpoint=form/comment&api_key=${encodeURIComponent(apiKey)}`);
      const testData = await testResponse.json();

      if (!testResponse.ok || testData.error || (testData.data && typeof testData.data === 'string' && testData.data.includes('Authentication Failed'))) {
         let errMsg = 'Invalid API key or failed to connect.';
         if (testData.error) errMsg = testData.error;
         else if (testData.details) errMsg = testData.details;
         else if (testData.message) errMsg = testData.message;
         else if (testData.data && typeof testData.data === 'string') errMsg = testData.data.substring(0, 100);
         throw new Error(errMsg);
      }

      // Save API key to localStorage if the test passes
      if (typeof window !== 'undefined') {
        localStorage.setItem('puntingFormApiKey', apiKey);
        setSavedApiKey(apiKey);
        setSaveStatus('success');
        setSaveStatusMessage('API key saved and verified successfully');
      } else {
         throw new Error("localStorage is not available.");
      }
    } catch (error) {
      console.error('Error saving API key:', error);
      setSaveStatus('error');
      setSaveStatusMessage(error instanceof Error ? error.message : 'An error occurred while saving the API key');
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
            The key is saved only in your browser's local storage.
          </p>

          <div className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium mb-1">API Key</label>
              <input
                id="apiKey"
                type="password" // Keep as password for masking
                value={apiKey}
                onChange={(e) => { setApiKey(e.target.value); setSaveStatus('idle'); setSaveStatusMessage(''); setTestStatus('idle'); setTestStatusMessage(''); }} // Reset status on change
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Punting Form API key"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4">
              <Button
                onClick={handleSaveApiKey}
                disabled={isSaving || isTesting || apiKey === savedApiKey || !apiKey.trim()} // Disable if saving, testing, key unchanged, or empty
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isSaving ? 'Verifying & Saving...' : 'Save API Key'}
              </Button>

              <Button
                 variant="outline"
                 onClick={handleTestApiKey}
                 disabled={isSaving || isTesting || !apiKey.trim()} // Disable if saving, testing, or empty
                 className="disabled:opacity-50"
              >
                 {isTesting ? 'Testing...' : 'Test Connection'}
              </Button>

              {/* Status Messages */}
               <div className="flex-grow min-w-[200px]"> {/* Allow message to take space */}
                 {saveStatus === 'success' && <span className="text-green-500 text-sm">{saveStatusMessage}</span>}
                 {saveStatus === 'error' && <span className="text-red-500 text-sm">{saveStatusMessage}</span>}
                 {testStatus === 'success' && saveStatus === 'idle' && <span className="text-green-500 text-sm">{testStatusMessage}</span>}
                 {testStatus === 'error' && saveStatus === 'idle' && <span className="text-red-500 text-sm">{testStatusMessage}</span>}
                 {testStatus === 'idle' && isTesting && <span className="text-gray-400 text-sm">{testStatusMessage}</span>} {/* Show "Testing..." */}
               </div>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 pt-4 mt-6">
          <h3 className="text-lg font-medium mb-2">API Usage</h3>
          <p className="text-sm opacity-70 mb-2">
            Your API key is stored securely in your browser&apos;s local storage and is only sent to the Punting Form API when making requests via this application's backend proxy.
          </p>
          {/* ... rest of usage info ... */}
           <p className="text-sm opacity-70">
             The API key is used to fetch racing data for the following features:
           </p>
           <ul className="list-disc list-inside text-sm opacity-70 mt-2 space-y-1">
             <li>Upcoming races</li>
             <li>Race details and entries</li>
             <li>Horse information and form</li>
             <li>Race predictions and analysis</li>
             <li>Scratchings</li>
             <li>Ratings</li>
           </ul>
        </div>
      </div>

      {/* Other settings remain unchanged */}
      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Application Settings</h2>
        {/* ... other settings ... */}
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
             <input id="notifications" type="checkbox" className="rounded bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultChecked />
             <label htmlFor="notifications" className="text-sm font-medium">Enable Notifications</label>
           </div>
           <div className="flex items-center gap-2">
             <input id="analytics" type="checkbox" className="rounded bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultChecked />
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