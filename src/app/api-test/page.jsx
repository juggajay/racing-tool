"use client";

import { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Direct API call to Punting Form
      const apiKey = '5b0df8bf-da9a-4d1e-995d-9b7a002aa836';
      const apiUrl = 'https://api.puntingform.com.au/v2/comment';
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'X-API-KEY': apiKey
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'API request failed');
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
      <h1 className="text-2xl font-bold mb-4">Direct API Test</h1>
      
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        onClick={testApi}
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test API Directly'}
      </button>
      
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
          This page makes a direct API call to the Punting Form API without going through the server.
          It uses the default API key and the V2 API endpoint.
        </p>
        <p className="mb-2">
          If this test works but the settings page doesn't, it suggests an issue with how the settings
          are being saved or loaded on the server.
        </p>
      </div>
    </div>
  );
}