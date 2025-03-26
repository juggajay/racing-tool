"use client";

import { useState, useEffect } from 'react';

export default function ProxyTestPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState('comment');
  const [apiKey, setApiKey] = useState('5b0df8bf-da9a-4d1e-995d-9b7a002aa836');

  const testProxy = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Call our proxy API
      const proxyUrl = `/api/proxy?endpoint=${endpoint}&apiKey=${apiKey}`;
      
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Proxy request failed');
      }
      
      setResult(data);
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Proxy API Test</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Test Configuration</h2>
        
        <div className="mb-4">
          <label className="block mb-1">Endpoint:</label>
          <input 
            type="text"
            className="w-full p-2 border rounded"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
            placeholder="e.g., comment"
          />
          <p className="text-xs text-gray-500 mt-1">
            Enter the endpoint path (e.g., comment, race, horse)
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">API Key:</label>
          <input 
            type="text"
            className="w-full p-2 border rounded"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
            placeholder="Enter your API key"
          />
        </div>
        
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={testProxy}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test Proxy API'}
        </button>
      </div>
      
      {error && (
        <div className="mb-6 p-4 border border-red-500 bg-red-50 rounded">
          <h2 className="text-xl font-semibold mb-2 text-red-700">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Result</h2>
          <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-[500px]">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">About This Test</h2>
        <p className="mb-2">
          This page tests the proxy API that forwards requests to the Punting Form API.
          The proxy approach may work better than direct server-side calls if there are
          CORS or network restrictions.
        </p>
        <p className="mb-2">
          If this test works but the settings page still shows "Invalid endpoint", it suggests
          an issue with how the settings are being processed on the server.
        </p>
      </div>
    </div>
  );
}