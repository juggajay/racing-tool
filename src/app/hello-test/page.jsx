"use client";

import React, { useState } from 'react';

export default function HelloTestPage() {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const testApi = async () => {
    setLoading(true);
    setError('');
    setResult('');

    try {
      const response = await fetch('/api/hello');
      const text = await response.text();
      setResult(text);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Hello API Test</h1>
      
      <button 
        className="bg-blue-500 text-white px-4 py-2 rounded mb-4"
        onClick={testApi}
        disabled={loading}
      >
        {loading ? 'Loading...' : 'Test Hello API'}
      </button>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          Error: {error}
        </div>
      )}
      
      {result && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
          Result: {result}
        </div>
      )}
    </div>
  );
}