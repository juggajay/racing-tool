"use client";

import { useState } from 'react';

export default function ProxyClientTestPage() {
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState('comment');
  const [apiKey, setApiKey] = useState('5b0df8bf-da9a-4d1e-995d-9b7a002aa836');

  const testDirectApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Direct API call to Punting Form
      const apiUrl = `https://api.puntingform.com.au/v2/${endpoint}`;
      
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'X-API-KEY': apiKey
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

  const testProxyApi = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      // Call our proxy API
      const proxyUrl = `/api/punting-form-proxy-client?endpoint=${endpoint}&apiKey=${apiKey}`;
      
      const response = await fetch(proxyUrl);
      const data = await response.json();
      
      if (!response.ok || data.error) {
        throw new Error(data.error || 'Proxy request failed');
      }
      
      setResult({
        source: 'Proxy API Call',
        ...data
      });
    } catch (error) {
      setError(`Proxy API Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Test with Rewrite Proxy</h1>
      
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
            Select the endpoint to test
          </p>
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
            onClick={testProxyApi}
            disabled={loading}
          >
            {loading ? 'Testing...' : 'Test Proxy API'}
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
          This page tests two approaches to accessing the Punting Form API:
        </p>
        <ul className="list-disc pl-5 mb-2">
          <li><strong>Direct API Call:</strong> Makes a client-side request directly to the Punting Form API</li>
          <li><strong>Proxy API Call:</strong> Uses our Next.js API route with URL rewriting to proxy the request</li>
        </ul>
        <p className="mb-2">
          The proxy approach should help with CORS issues when making server-side requests.
        </p>
      </div>
    </div>
  );
}