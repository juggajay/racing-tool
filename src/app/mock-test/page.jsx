"use client";

import { useState, useEffect } from 'react';

export default function MockTestPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState('comment');

  const testMockApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Call our mock API
      const mockUrl = `/api/mock?endpoint=${endpoint}`;
      
      const response = await fetch(mockUrl);
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Mock API request failed');
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
      <h1 className="text-2xl font-bold mb-4">Mock API Test</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Test Configuration</h2>
        
        <div className="mb-4">
          <label className="block mb-1">Endpoint:</label>
          <select 
            className="w-full p-2 border rounded"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          >
            <option value="comment">comment</option>
            <option value="race">race</option>
            <option value="horse">horse</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Select the mock endpoint to test
          </p>
        </div>
        
        <button 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={testMockApi}
          disabled={loading}
        >
          {loading ? 'Testing...' : 'Test Mock API'}
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
          This page tests the mock API that provides simulated responses for the Punting Form API.
          The mock API is useful for development and testing when the real API is not accessible.
        </p>
        <p className="mb-2">
          The mock API supports the same endpoints as the real API (comment, race, horse) but
          returns predefined data instead of making external API calls.
        </p>
      </div>
    </div>
  );
}