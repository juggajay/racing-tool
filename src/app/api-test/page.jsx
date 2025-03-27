"use client";

import { useState, useEffect } from 'react';

export default function ApiTestPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [apiKey, setApiKey] = useState('5b0df8bf-da9a-4d1e-995d-9b7a002aa836');
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [requestDetails, setRequestDetails] = useState(null);

  // Format date as DD-Mon-YYYY (e.g., 01-Mar-2025)
  function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Test direct API call
  const testDirectApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setRequestDetails(null);

    try {
      // Build the API URL
      const apiUrl = `https://api.puntingform.com.au/v2/form/comment?startDate=${startDate}&apiKey=${apiKey}`;
      
      setRequestDetails({
        url: apiUrl,
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      
      console.log(`Making direct API call to: ${apiUrl}`);
      
      // Make the request
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json'
        }
      });
      
      // Get response details
      const status = response.status;
      const statusText = response.statusText;
      const responseHeaders = Object.fromEntries(response.headers.entries());
      
      // Try to parse the response
      let responseData;
      try {
        const text = await response.text();
        try {
          responseData = JSON.parse(text);
        } catch (e) {
          responseData = { text };
        }
      } catch (e) {
        responseData = { error: 'Could not read response body' };
      }
      
      setResult({
        success: response.ok,
        status,
        statusText,
        headers: responseHeaders,
        data: responseData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setError(`API Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Test server API call
  const testServerApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);
    setRequestDetails(null);

    try {
      // Build the API URL
      const serverUrl = `/api/comments?startDate=${startDate}`;
      
      setRequestDetails({
        url: serverUrl,
        method: 'GET',
        headers: {
          'accept': 'application/json'
        },
        note: 'This will use the API key configured in the server'
      });
      
      console.log(`Making server API call to: ${serverUrl}`);
      
      // Make the request
      const response = await fetch(serverUrl);
      
      // Get response details
      const status = response.status;
      const statusText = response.statusText;
      const responseHeaders = Object.fromEntries(response.headers.entries());
      
      // Try to parse the response
      let responseData;
      try {
        responseData = await response.json();
      } catch (e) {
        const text = await response.text();
        responseData = { text, parseError: e.message };
      }
      
      setResult({
        success: response.ok,
        status,
        statusText,
        headers: responseHeaders,
        data: responseData,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setError(`Server API Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>
      
      <div className="mb-6 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Test Configuration</h2>
        
        <div className="mb-4">
          <label className="block mb-1">API Key:</label>
          <input 
            type="text"
            className="w-full p-2 border rounded"
            value={apiKey}
            onChange={(e) => setApiKey(e.target.value)}
          />
          <p className="text-xs text-gray-500 mt-1">
            Default: 5b0df8bf-da9a-4d1e-995d-9b7a002aa836
          </p>
        </div>
        
        <div className="mb-4">
          <label className="block mb-1">Start Date (DD-Mon-YYYY):</label>
          <input 
            type="text"
            className="w-full p-2 border rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="e.g., 01-Mar-2025"
          />
          <p className="text-xs text-gray-500 mt-1">
            Format: DD-Mon-YYYY (e.g., 01-Mar-2025)
          </p>
        </div>
        
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
      
      {requestDetails && (
        <div className="mb-6 p-4 border rounded">
          <h2 className="text-xl font-semibold mb-2">Request Details</h2>
          <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-[200px]">
            {JSON.stringify(requestDetails, null, 2)}
          </pre>
        </div>
      )}
      
      {error && (
        <div className="mb-6 p-4 border border-red-500 bg-red-50 rounded">
          <h2 className="text-xl font-semibold mb-2 text-red-700">Error</h2>
          <p className="text-red-700">{error}</p>
        </div>
      )}
      
      {result && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Result</h2>
          
          <div className="mb-2">
            <span className="font-semibold">Status:</span> 
            <span className={result.success ? 'text-green-600' : 'text-red-600'}>
              {result.status} {result.statusText}
            </span>
          </div>
          
          <div className="mb-4">
            <h3 className="font-semibold mb-1">Response Headers:</h3>
            <pre className="p-2 bg-gray-100 rounded overflow-auto max-h-[150px] text-sm">
              {JSON.stringify(result.headers, null, 2)}
            </pre>
          </div>
          
          <div>
            <h3 className="font-semibold mb-1">Response Data:</h3>
            <pre className="p-4 bg-gray-100 rounded overflow-auto max-h-[500px]">
              {JSON.stringify(result.data, null, 2)}
            </pre>
          </div>
        </div>
      )}
      
      <div className="mt-8 p-4 border rounded">
        <h2 className="text-xl font-semibold mb-2">Troubleshooting Tips</h2>
        <ul className="list-disc pl-5 space-y-2">
          <li>
            <strong>Date Format:</strong> Ensure the date is in DD-Mon-YYYY format (e.g., 01-Mar-2025)
          </li>
          <li>
            <strong>API Key:</strong> Verify the API key is correct and has no typos
          </li>
          <li>
            <strong>Network Issues:</strong> Check if there are any CORS or network connectivity issues
          </li>
          <li>
            <strong>Server Logs:</strong> Check the server logs for more detailed error information
          </li>
        </ul>
      </div>
    </div>
  );
}