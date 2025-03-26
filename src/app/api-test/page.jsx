"use client";

import React, { useState } from 'react';

export default function ApiTestPage() {
  const [testType, setTestType] = useState('races');
  const [track, setTrack] = useState('Flemington');
  const [raceNumber, setRaceNumber] = useState('1');
  const [horseId, setHorseId] = useState('horse_1');
  const [date, setDate] = useState('2025-03-28');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Function to run the test
  const runTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Build the test URL based on the selected test type
      let url = `/api/test?type=${testType}`;
      
      if (date) url += `&date=${date}`;
      
      if (testType === 'race' && track && raceNumber) {
        url += `&track=${track}&race_number=${raceNumber}`;
      } else if (testType === 'horse' && horseId) {
        url += `&horse_id=${horseId}`;
      } else if (testType === 'track' && track) {
        url += `&track=${track}`;
      } else if (testType === 'complex') {
        if (track && raceNumber) {
          url += `&track=${track}&race_number=${raceNumber}`;
        } else if (horseId) {
          url += `&horse_id=${horseId}`;
        } else if (track) {
          url += `&track=${track}`;
        }
      }

      // Make the request to the test API
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

  // Function to run a direct API test
  const runDirectTest = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Build the API URL based on the selected test type
      let url, method, body;
      
      if (testType === 'races') {
        url = `/api/racing-data?endpoint=races`;
        if (date) url += `&date=${date}`;
        method = 'GET';
      } else if (testType === 'race' && track && raceNumber) {
        url = `/api/racing-data?endpoint=races&track=${track}&race_number=${raceNumber}`;
        method = 'GET';
      } else if (testType === 'horse' && horseId) {
        url = `/api/racing-data?endpoint=horses&horse_id=${horseId}`;
        method = 'GET';
      } else if (testType === 'track' && track) {
        url = `/api/racing-data?endpoint=races&track=${track}`;
        method = 'GET';
      } else if (testType === 'complex') {
        url = `/api/racing-data`;
        method = 'POST';
        
        if (track && raceNumber) {
          body = {
            action: 'getRaceWithEntries',
            track,
            raceNumber,
            date
          };
        } else if (horseId) {
          body = {
            action: 'getHorseDetails',
            horseId
          };
        } else if (track) {
          body = {
            action: 'getRacesByTrack',
            track
          };
        } else if (date) {
          body = {
            action: 'getRacesByDate',
            date
          };
        } else {
          throw new Error('Invalid parameters for complex test');
        }
      } else {
        throw new Error('Invalid test configuration');
      }

      // Make the request to the API
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(url, options);
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
      <h1 className="text-2xl font-bold mb-4">Racing Data API Test</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Test Configuration</h2>
        
        <div className="mb-4">
          <label className="block mb-1">Test Type:</label>
          <select 
            className="w-full p-2 border rounded"
            value={testType}
            onChange={(e) => setTestType(e.target.value)}
          >
            <option value="races">All Races</option>
            <option value="race">Specific Race</option>
            <option value="horse">Horse Details</option>
            <option value="track">Races by Track</option>
            <option value="complex">Complex Query (POST)</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Date:</label>
          <input 
            type="text"
            className="w-full p-2 border rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            placeholder="YYYY-MM-DD"
          />
          <p className="text-xs text-gray-500">Default: 2025-03-28 (date with mock data)</p>
        </div>
        
        {(testType === 'race' || testType === 'track' || testType === 'complex') && (
          <div className="mb-4">
            <label className="block mb-1">Track:</label>
            <select
              className="w-full p-2 border rounded"
              value={track}
              onChange={(e) => setTrack(e.target.value)}
            >
              <option value="Flemington">Flemington</option>
              <option value="Randwick">Randwick</option>
            </select>
          </div>
        )}
        
        {(testType === 'race' || testType === 'complex') && (
          <div className="mb-4">
            <label className="block mb-1">Race Number:</label>
            <select
              className="w-full p-2 border rounded"
              value={raceNumber}
              onChange={(e) => setRaceNumber(e.target.value)}
            >
              <option value="1">Race 1</option>
              <option value="2">Race 2</option>
              <option value="3">Race 3</option>
            </select>
          </div>
        )}
        
        {(testType === 'horse' || testType === 'complex') && (
          <div className="mb-4">
            <label className="block mb-1">Horse ID:</label>
            <select
              className="w-full p-2 border rounded"
              value={horseId}
              onChange={(e) => setHorseId(e.target.value)}
            >
              <option value="horse_1">Fast Thunder (horse_1)</option>
              <option value="horse_2">Ocean Breeze (horse_2)</option>
              <option value="horse_3">Lucky Star (horse_3)</option>
            </select>
          </div>
        )}
        
        <div className="flex space-x-2">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={runTest}
            disabled={loading}
          >
            {loading ? 'Running...' : 'Run Test API'}
          </button>
          
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={runDirectTest}
            disabled={loading}
          >
            {loading ? 'Running...' : 'Run Direct API'}
          </button>
        </div>
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
          This page demonstrates how to use the Racing Data API. The API provides access to horse racing data
          including races, horses, and more. The data is currently sourced from a mock API that simulates
          real racing data.
        </p>
        <p className="mb-2">
          <strong>Available Endpoints:</strong>
        </p>
        <ul className="list-disc pl-5 mb-2">
          <li><code>/api/racing-data?endpoint=races</code> - Get all races</li>
          <li><code>/api/racing-data?endpoint=races&track=Flemington&race_number=1</code> - Get a specific race</li>
          <li><code>/api/racing-data?endpoint=horses&horse_id=horse_1</code> - Get details for a specific horse</li>
          <li><code>/api/racing-data?endpoint=races&track=Flemington</code> - Get races for a specific track</li>
        </ul>
        <p className="mb-2">
          <strong>POST Endpoints:</strong>
        </p>
        <ul className="list-disc pl-5">
          <li><code>action: 'getRaceWithEntries'</code> - Get a race with its entries</li>
          <li><code>action: 'getHorseDetails'</code> - Get details for a specific horse</li>
          <li><code>action: 'getRacesByTrack'</code> - Get races for a specific track</li>
          <li><code>action: 'getRacesByDate'</code> - Get races for a specific date</li>
        </ul>
      </div>
    </div>
  );
}