"use client";

import React, { useState } from 'react';

export default function ApiTestPage() {
  const [testType, setTestType] = useState('meetings');
  const [meetingId, setMeetingId] = useState('');
  const [raceId, setRaceId] = useState('');
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
      
      if (testType === 'races' && meetingId) {
        url += `&meetingId=${meetingId}`;
      } else if (testType === 'fields' && raceId) {
        url += `&raceId=${raceId}`;
      } else if (testType === 'complex') {
        if (raceId) {
          url += `&raceId=${raceId}`;
          if (meetingId) {
            url += `&meetingId=${meetingId}`;
          }
        } else if (meetingId) {
          url += `&meetingId=${meetingId}`;
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
      let url = '/api/racing-data';
      
      if (testType === 'meetings') {
        // Use GET endpoint
        url += '?endpoint=ExportMeetings';
      } else if (testType === 'races' && meetingId) {
        // Use GET endpoint with meetingId
        url += `?endpoint=ExportRaces&meetingId=${meetingId}`;
      } else if (testType === 'fields' && raceId) {
        // Use GET endpoint with raceId
        url += `?endpoint=ExportFields&raceId=${raceId}`;
      } else if (testType === 'complex') {
        // Use POST endpoint
        const method = 'POST';
        const body = {};
        
        if (raceId) {
          body.action = 'getRaceWithFields';
          body.raceId = raceId;
          if (meetingId) {
            body.meetingId = meetingId;
          }
        } else if (meetingId) {
          body.action = 'getMeetingsWithRaces';
        } else {
          throw new Error('Meeting ID or Race ID is required for complex test');
        }

        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(body)
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'An error occurred');
        }

        setResult(data);
        return;
      } else {
        throw new Error('Invalid test configuration');
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
            <option value="meetings">Meetings</option>
            <option value="races">Races</option>
            <option value="fields">Fields</option>
            <option value="complex">Complex</option>
          </select>
        </div>
        
        {(testType === 'races' || testType === 'complex') && (
          <div className="mb-4">
            <label className="block mb-1">Meeting ID:</label>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              value={meetingId}
              onChange={(e) => setMeetingId(e.target.value)}
              placeholder="Enter meeting ID"
            />
          </div>
        )}
        
        {(testType === 'fields' || testType === 'complex') && (
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
          For more information about the Racing Data API, see the{' '}
          <a href="/API_README.md" className="text-blue-500 hover:underline" target="_blank">
            API documentation
          </a>.
        </p>
      </div>
    </div>
  );
}