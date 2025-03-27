"use client";

import { useState } from 'react';

export default function FinalApiTestPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState('form/comment');
  const [apiKey, setApiKey] = useState('5b0df8bf-da9a-4d1e-995d-9b7a002aa836');
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [raceId, setRaceId] = useState('');
  const [horseId, setHorseId] = useState('');

  // Format date as DD-MMM-YYYY (e.g., 01-Mar-2025)
  function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const testDirectApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Build the API URL based on the selected endpoint
      let apiUrl = '';
      
      switch (endpoint) {
        case 'form/comment':
          apiUrl = `https://api.puntingform.com.au/v2/form/comment?startDate=${startDate}&apiKey=${apiKey}`;
          break;
        case 'race':
          if (!raceId) {
            throw new Error('Race ID is required for race endpoint');
          }
          apiUrl = `https://api.puntingform.com.au/v2/race?raceid=${raceId}&apiKey=${apiKey}`;
          break;
        case 'horse':
          if (!horseId) {
            throw new Error('Horse ID is required for horse endpoint');
          }
          apiUrl = `https://api.puntingform.com.au/v2/horse?horseid=${horseId}&apiKey=${apiKey}`;
          break;
        default:
          throw new Error('Invalid endpoint');
      }
      
      console.log(`Calling API: ${apiUrl}`);
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`API returned status ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      setResult({
        source: 'Direct API Call',
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setError(`Direct API Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testServerApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Build the query parameters based on the selected endpoint
      let queryParams = `endpoint=${endpoint}&apiKey=${apiKey}`;
      
      if (endpoint === 'form/comment') {
        queryParams += `&startDate=${startDate}`;
      } else if (endpoint === 'race' && raceId) {
        queryParams += `&raceId=${raceId}`;
      } else if (endpoint === 'horse' && horseId) {
        queryParams += `&horseId=${horseId}`;
      }
      
      // Call our server API
      const serverUrl = `/api/punting-form-final?${queryParams}`;
      
      const response = await fetch(serverUrl);
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Server request failed');
      }
      
      setResult({
        source: data.source || 'Server API Call',
        ...data
      });
    } catch (error) {
      setError(`Server API Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Punting Form API Test (Final Implementation)</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Test Configuration</h2>
        
        <div className="mb-4">
          <label className="block mb-1">Endpoint:</label>
          <select 
            className="w-full p-2 border rounded"
            value={endpoint}
            onChange={(e) => setEndpoint(e.target.value)}
          >
            <option value="form/comment">form/comment</option>
            <option value="race">race</option>
            <option value="horse">horse</option>
          </select>
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
        
        {endpoint === 'form/comment' && (
          <div className="mb-4">
            <label className="block mb-1">Start Date (DD-MMM-YYYY):</label>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              placeholder="e.g., 01-Mar-2025"
            />
            <p className="text-xs text-gray-500 mt-1">
              Format: DD-MMM-YYYY (e.g., 01-Mar-2025)
            </p>
          </div>
        )}
        
        {endpoint === 'race' && (
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
        
        {endpoint === 'horse' && (
          <div className="mb-4">
            <label className="block mb-1">Horse ID:</label>
            <input 
              type="text"
              className="w-full p-2 border rounded"
              value={horseId}
              onChange={(e) => setHorseId(e.target.value)}
              placeholder="Enter horse ID"
            />
          </div>
        )}
        
        <div className="flex space-x-4">
          <button 
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={testDirectApi}
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Direct API'}
          </button>
          
          <button 
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            onClick={testServerApi}
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Server API'}
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
          <h2 className="text-xl font-semibold mb-2">Result from {result.source}</h2>
          <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-[500px]">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
      
      <div className="mt-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">About This Test</h2>
        <p className="mb-2">
          This page tests the final implementation of the Punting Form API integration, which:
        </p>
        <ul className="list-disc pl-5 mb-2">
          <li>Uses the correct endpoint format as specified by the API team</li>
          <li>Passes parameters correctly in the query string</li>
          <li>Falls back to mock data if the real API is unavailable</li>
        </ul>
        <p className="mb-2">
          The implementation follows the official documentation and feedback from the API team.
        </p>
      </div>
    </div>
  );
}