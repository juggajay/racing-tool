"use client";

import React, { useState } from 'react';

export default function PuntingFormTestPage() {
  const [endpoint, setEndpoint] = useState('ExportMeetings');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [raceId, setRaceId] = useState('');
  const [includeBarrierTrials, setIncludeBarrierTrials] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const testApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Build the API URL with query parameters
      let url = `/api/punting-form?endpoint=${endpoint}&date=${date}`;
      
      if (raceId && endpoint === 'GetRatings') {
        url += `&raceId=${raceId}`;
      }
      
      if (includeBarrierTrials) {
        url += `&includeBarrierTrials=true`;
      }
      
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
      <h1 className="text-2xl font-bold mb-4">Punting Form API Test</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Test Configuration</h2>
        
        <div className="mb-4">
          <label className="block mb-1">Endpoint:</label>
          <select 
            className="w-full p-2 border rounded"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          >
            <option value="ExportMeetings">ExportMeetings</option>
            <option value="ExportRaces">ExportRaces</option>
            <option value="ExportFields">ExportFields</option>
            <option value="GetAllScratchings">GetAllScratchings</option>
            <option value="GetRatings">GetRatings</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Date:</label>
          <input 
            type="date"
            className="w-full p-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>
        
        {endpoint === 'GetRatings' && (
          <div className="mb-4">
            <label className="block mb-1">Race ID:</label>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              value={raceId}
              onChange={(e) => setRaceId(e.target.value)}
              placeholder="Enter race ID"
            />
          </div>
        )}
        
        {['ExportMeetings', 'ExportRaces', 'ExportFields'].includes(endpoint) && (
          <div className="mb-4">
            <label className="flex items-center">
              <input 
                type="checkbox"
                className="mr-2"
                checked={includeBarrierTrials}
                onChange={(e) => setIncludeBarrierTrials(e.target.checked)}
              />
              Include Barrier Trials
            </label>
          </div>
        )}
        
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
          This page tests the Punting Form API integration. The API provides access to horse racing data
          including meetings, races, fields, scratchings, and ratings.
        </p>
        <p className="mb-2">
          <strong>Available Endpoints:</strong>
        </p>
        <ul className="list-disc pl-5 mb-2">
          <li><code>ExportMeetings</code> - Get all meetings for a specific date</li>
          <li><code>ExportRaces</code> - Get all races for a specific date</li>
          <li><code>ExportFields</code> - Get all fields for a specific date</li>
          <li><code>GetAllScratchings</code> - Get all scratchings for a specific date</li>
          <li><code>GetRatings</code> - Get ratings for a specific race</li>
        </ul>
        <p className="mb-2">
          <a 
            href="https://documenter.getpostman.com/view/10712595/TzJu8wZa" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-500 hover:underline"
          >
            View Full API Documentation
          </a>
        </p>
      </div>
    </div>
  );
}