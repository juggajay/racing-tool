"use client";

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const testMockApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Call our mock API
      const response = await fetch('/api/mock?endpoint=comment');
      const data = await response.json();
      
      setResult(data);
    } catch (error) {
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Test Page</h1>
      
      <button 
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mb-4"
        onClick={testMockApi}
        disabled={loading}
      >
        {loading ? 'Testing...' : 'Test Mock API'}
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
    </div>
  );
}