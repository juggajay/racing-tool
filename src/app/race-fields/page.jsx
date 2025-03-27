"use client";

import { useState, useEffect } from 'react';
import { convertToCSV } from '@/utils/csvParser';

export default function RaceFieldsPage() {
  const [races, setRaces] = useState([]);
  const [rawData, setRawData] = useState([]);
  const [headers, setHeaders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [raceDate, setRaceDate] = useState(formatDate(new Date()));
  const [trackCode, setTrackCode] = useState('');
  const [raceNumber, setRaceNumber] = useState('');
  const [expandedRace, setExpandedRace] = useState(null);

  // Format date as DD-Mon-YYYY (e.g., 01-Mar-2025)
  function formatDate(date) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(date.getDate()).padStart(2, '0');
    const month = months[date.getMonth()];
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  // Function to fetch race fields
  const fetchRaceFields = async () => {
    setLoading(true);
    setError(null);

    try {
      let url = `/api/race-fields?raceDate=${raceDate}`;
      if (trackCode) {
        url += `&trackCode=${trackCode}`;
      }
      if (raceNumber) {
        url += `&raceNumber=${raceNumber}`;
      }
      
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch race fields');
      }

      setRaces(data.races || []);
      setRawData(data.rawData || []);
      setHeaders(data.headers || []);
      setExpandedRace(null); // Reset expanded race when new data is loaded
    } catch (err) {
      setError(err.message || 'An error occurred while fetching race fields');
      setRaces([]);
      setRawData([]);
      setHeaders([]);
    } finally {
      setLoading(false);
    }
  };

  // Download fields as CSV
  const downloadCSV = () => {
    if (rawData.length === 0) return;
    
    const csv = convertToCSV(rawData, headers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `race-fields-${raceDate}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Toggle expanded race
  const toggleRaceExpansion = (index) => {
    if (expandedRace === index) {
      setExpandedRace(null);
    } else {
      setExpandedRace(index);
    }
  };

  // Fetch race fields on initial load
  useEffect(() => {
    fetchRaceFields();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Race Fields</h1>

      <div className="mb-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block mb-1">Race Date:</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={raceDate}
            onChange={(e) => setRaceDate(e.target.value)}
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
        
        <div>
          <label className="block mb-1">Race Number (Optional):</label>
          <input
            type="text"
            className="w-full p-2 border rounded"
            value={raceNumber}
            onChange={(e) => setRaceNumber(e.target.value)}
            placeholder="e.g., 1"
          />
          <p className="text-xs text-gray-500 mt-1">Leave empty for all races</p>
        </div>
      </div>
      
      <div className="flex space-x-4 mb-6">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          onClick={fetchRaceFields}
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Race Fields'}
        </button>
        
        <button
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          onClick={downloadCSV}
          disabled={loading || rawData.length === 0}
        >
          Download CSV
        </button>
      </div>

      {loading && (
        <div className="text-center p-4">
          <p>Loading race fields...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {!loading && !error && races.length === 0 && (
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded mb-4">
          <p>No race fields found for the selected date.</p>
        </div>
      )}

      {!loading && !error && races.length > 0 && (
        <div className="space-y-4">
          {races.map((race, index) => (
            <div key={index} className="border rounded overflow-hidden">
              <div 
                className="bg-gray-100 p-4 flex justify-between items-center cursor-pointer"
                onClick={() => toggleRaceExpansion(index)}
              >
                <div>
                  <h2 className="text-lg font-semibold">
                    {race.trackName} (R{race.raceNumber}) - {race.raceTime}
                  </h2>
                  <p className="text-sm text-gray-600">
                    {race.raceDistance}m | {race.raceType}
                  </p>
                </div>
                <div className="text-blue-500">
                  {expandedRace === index ? '▲' : '▼'}
                </div>
              </div>
              
              {expandedRace === index && (
                <div className="p-4">
                  <table className="min-w-full bg-white">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="py-2 px-4 text-left">No.</th>
                        <th className="py-2 px-4 text-left">Horse</th>
                        <th className="py-2 px-4 text-left">Barrier</th>
                        <th className="py-2 px-4 text-left">Weight</th>
                        <th className="py-2 px-4 text-left">Jockey</th>
                        <th className="py-2 px-4 text-left">Trainer</th>
                        <th className="py-2 px-4 text-left">Last 5</th>
                        <th className="py-2 px-4 text-left">Odds</th>
                      </tr>
                    </thead>
                    <tbody>
                      {race.horses.map((horse, horseIndex) => (
                        <tr key={horseIndex} className={horseIndex % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="py-2 px-4">{horse.number}</td>
                          <td className="py-2 px-4 font-medium">{horse.name}</td>
                          <td className="py-2 px-4">{horse.barrier}</td>
                          <td className="py-2 px-4">{horse.weight}</td>
                          <td className="py-2 px-4">{horse.jockey}</td>
                          <td className="py-2 px-4">{horse.trainer}</td>
                          <td className="py-2 px-4">{horse.lastFive}</td>
                          <td className="py-2 px-4">{horse.odds}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}