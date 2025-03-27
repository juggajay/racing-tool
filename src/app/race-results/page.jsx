"use client";

import { useState, useEffect } from 'react';
import { convertToCSV } from '@/utils/csvParser';

export default function RaceResultsPage() {
  const [results, setResults] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [startDate, setStartDate] = useState(formatDate(new Date()));
  const [endDate, setEndDate] = useState(formatDate(new Date()));
  const [trackCode, setTrackCode] = useState('');

  // Format date as DD-Mon-YYYY (e.g., 01-Mar-2025)
  function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Function to fetch race results
  const fetchResults = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `/api/race-results?startDate=${startDate}&endDate=${endDate}`;
      if (trackCode) {
        url += `&trackCode=${trackCode}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch race results');
      }

      setResults(data.results || []);
      setHeaders(data.headers || []);
    } catch (err) {
      setError(err.message || 'An error occurred while fetching race results');
      setResults([]);
      setHeaders([]);
    } finally {
      setLoading(false);
    }
  };

  // Download results as CSV
  const downloadCSV = () => {
    if (results.length === 0) return;
    
    const csv = convertToCSV(results, headers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `race-results-${startDate}-to-${endDate}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Fetch results on initial load
  useEffect(() => {
    fetchResults();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Race Results</h1>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1">Start Date:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            placeholder="e.g., 01-Mar-2025"
          />
          <p className="text-xs text-gray-500 mt-1">Format: DD-Mon-YYYY</p>
        </div>
        
        <div>
          <label className="block mb-1">End Date:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            placeholder="e.g., 01-Mar-2025"
          />
          <p className="text-xs text-gray-500 mt-1">Format: DD-Mon-YYYY</p>
        </div>
        
        <div>
          <label className="block mb-1">Track Code (Optional):</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={trackCode}
            onChange={(e) => setTrackCode(e.target.value)}
            placeholder="e.g., FLE"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty for all tracks</p>
        </div>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={fetchResults}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Results'}
        </button>
        
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={downloadCSV}
          disabled={loading || results.length === 0}
        >
          Download CSV
        </button>
      </div>

      {loading && (
        <div className="text-center p-4">
          <p>Loading race results...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && results.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No race results found for the selected date range.</p>
        </div>
      )}

      {!loading && !error && results.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="bg-gray-100">
                {headers.map((header, index) => (
                  <th key={index} className="py-2 px-4 border text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {results.map((result, rowIndex) => (
                <tr key={rowIndex} className={rowIndex % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  {headers.map((header, colIndex) => (
                    <td key={`${rowIndex}-${colIndex}`} className="py-2 px-4 border">
                      {result[header] || ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}