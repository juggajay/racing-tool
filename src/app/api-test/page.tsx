'use client';

import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ApiTestPage() {
  const [apiKey, setApiKey] = useState('5b0df8bf-da9a-4d1e-995d-9b7a002aa836');
  const [testResults, setTestResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const runTest = async () => {
    try {
      setLoading(true);
      setError('');
      setTestResults(null);
      
      const response = await fetch(`/api/punting-form-test?api_key=${encodeURIComponent(apiKey)}`);
      const data = await response.json();
      
      setTestResults(data);
    } catch (err) {
      console.error('Error running API test:', err);
      setError(err.message || 'An error occurred while testing the API');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Punting Form API Test</h1>
        <div className="w-full sm:w-auto">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">Back to Home</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4">API Test Tool</h2>
        
        <div className="mb-6">
          <p className="text-sm opacity-70 mb-4">
            This tool tests different API endpoints and authentication methods to find the correct configuration for the Punting Form API.
          </p>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="apiKey" className="block text-sm font-medium mb-1">API Key</label>
              <input
                id="apiKey"
                type="text"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your Punting Form API key"
              />
            </div>
            
            <div>
              <Button 
                onClick={runTest} 
                disabled={loading || !apiKey.trim()}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? 'Testing...' : 'Run API Test'}
              </Button>
            </div>
            
            {error && (
              <div className="bg-red-900/30 border border-red-500 text-white p-4 rounded-md">
                <h3 className="font-bold mb-2">Error</h3>
                <p>{error}</p>
              </div>
            )}
          </div>
        </div>
        
        {testResults && (
          <div className="border-t border-white/10 pt-4 mt-6">
            <h3 className="text-lg font-medium mb-4">Test Results</h3>
            
            {testResults.successfulResults && testResults.successfulResults.length > 0 ? (
              <div className="bg-green-900/30 border border-green-500 text-white p-4 rounded-md mb-4">
                <h4 className="font-bold mb-2">Success! Found working configuration:</h4>
                <pre className="bg-black/30 p-3 rounded overflow-x-auto text-sm">
                  {JSON.stringify(testResults.recommendedConfig, null, 2)}
                </pre>
              </div>
            ) : (
              <div className="bg-yellow-900/30 border border-yellow-500 text-white p-4 rounded-md mb-4">
                <h4 className="font-bold mb-2">No successful configuration found</h4>
                <p>None of the tested configurations worked with the Punting Form API.</p>
              </div>
            )}
            
            <div className="mt-4">
              <h4 className="font-bold mb-2">All Test Results:</h4>
              <div className="bg-black/30 p-3 rounded overflow-x-auto">
                <pre className="text-xs">
                  {JSON.stringify(testResults.results, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}