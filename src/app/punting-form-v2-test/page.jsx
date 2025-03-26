"use client";

import React, { useState } from 'react';

export default function PuntingFormV2TestPage() {
  const [endpoint, setEndpoint] = useState('comment');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Build the API URL with query parameters
      let url = `/api/punting-form-v2?endpoint=${endpoint}`;
      
      // Make the request to the API
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
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
      <h1 className="text-2xl font-bold mb-4">Punting Form API V2 Test</h1>
      
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
            Enter the endpoint path (e.g., comment, race, etc.)
          </p>
        </div>
        
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={testApi}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test API'}
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
        <h2 className="text-xl font-semibold mb-2">API Documentation</h2>
        <p className="mb-2">
          This page tests the Punting Form API V2 integration. The API provides access to horse racing data
          using the new V2 endpoints.
        </p>
        <p className="mb-2">
          <strong>Example Endpoints:</strong>
        </p>
        <ul className="list-disc pl-5 mb-2">
          <li><code>comment</code> - Get form comments</li>
          <li><code>race</code> - Get race form data</li>
          <li><code>horse</code> - Get horse form data</li>
        </ul>
        <p className="mb-2">
          The API uses Bearer token authentication with your API key.
        </p>
      </div>
    </div>
  );
}