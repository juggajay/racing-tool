'use client';

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState, useEffect } from "react";
import { fetchPuntingFormData, getUpcomingRaces } from "@/lib/punting-form";

export default function RacesPage() {
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [races, setRaces] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTrack, setSelectedTrack] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  
  // Load races from API
  useEffect(() => {
    const loadRaces = async () => {
      try {
        setLoading(true);
        
        // Get API key from localStorage
        const apiKey = localStorage.getItem('puntingFormApiKey');
        
        if (!apiKey) {
          setError('API key not found. Please set your Punting Form API key in Settings.');
          setLoading(false);
          return;
        }
        
        // Fetch races from API
        const response = await getUpcomingRaces({
          date: selectedDate || undefined,
          track: selectedTrack || undefined,
          apiKey
        });
        
        if (response.success) {
          setRaces(response.data.data || []);
        } else {
          setError(response.error || 'Failed to load races');
        }
      } catch (error) {
        console.error('Error loading races:', error);
        setError('Failed to load races. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    loadRaces();
  }, [selectedTrack, selectedDate]);
  
  // Filter races based on search query
  const filteredRaces = races.filter(race => {
    if (!searchQuery) return true;
    
    // Search in race name, track name, etc.
    const searchLower = searchQuery.toLowerCase();
    return (
      (race.track_name && race.track_name.toLowerCase().includes(searchLower)) ||
      (race.race_name && race.race_name.toLowerCase().includes(searchLower)) ||
      (race.race_number && race.race_number.toString().includes(searchLower))
    );
  });

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Upcoming Races</h1>
        <div className="w-full sm:w-auto">
          <Link href="/predict" className="w-full sm:w-auto">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm md:text-base">Make Predictions</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6 md:mb-8">
        {/* Mobile filter toggle */}
        <div className="flex justify-between items-center mb-4 md:hidden">
          <button 
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="flex items-center gap-2 text-sm font-medium bg-white/5 px-3 py-2 rounded-md border border-white/20"
          >
            <span>Filters</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              className={`transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </button>
          <span className="text-xs opacity-70">{loading ? 'Loading...' : `${filteredRaces.length} races found`}</span>
        </div>

        {/* Filter section - responsive */}
        <div className={`flex flex-col gap-4 ${isFilterExpanded ? 'block' : 'hidden'} md:flex md:flex-row md:justify-between mb-4`}>
          <div className="w-full md:w-auto mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search races or tracks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            />
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <select
              value={selectedTrack}
              onChange={(e) => setSelectedTrack(e.target.value)}
              className="px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            >
              <option value="">All Tracks</option>
              <option value="flemington">Flemington</option>
              <option value="randwick">Randwick</option>
              <option value="caulfield">Caulfield</option>
              <option value="moonee-valley">Moonee Valley</option>
              <option value="rosehill">Rosehill</option>
            </select>
            <select
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-base"
            >
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This Week</option>
              <option value="next-week">Next Week</option>
            </select>
          </div>
        </div>

        {/* Loading and Error States */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <p>Loading races...</p>
            </div>
          </div>
        )}
        
        {error && !loading && (
          <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-center">{error}</p>
            <div className="flex justify-center mt-4">
              <Link href="/settings">
                <Button variant="outline" size="sm">Go to Settings</Button>
              </Link>
            </div>
          </div>
        )}
        
        {/* No results message */}
        {!loading && !error && filteredRaces.length === 0 && (
          <div className="text-center py-12">
            <p className="mb-4">No races found matching your criteria.</p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery('');
                setSelectedTrack('');
                setSelectedDate('');
              }}
            >
              Clear Filters
            </Button>
          </div>
        )}
        
        {/* Mobile race cards - visible on small screens */}
        {!loading && !error && filteredRaces.length > 0 && (
          <div className="md:hidden space-y-4">
            {filteredRaces.map((race) => (
              <div key={race.id} className="bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h3 className="font-medium">Race {race.race_number || '-'}</h3>
                    <p className="text-sm text-gray-400">
                      {race.track_name || 'Unknown Track'}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">
                      {race.race_date || 'TBD'}
                    </p>
                    <p className="text-xs text-gray-400">
                      {race.race_time || 'TBD'}
                    </p>
                  </div>
                </div>
                <div className="flex justify-between text-sm mb-3">
                  <span>{race.distance ? `${race.distance}m` : 'TBD'}</span>
                  <span>{race.race_class || 'TBD'}</span>
                </div>
                <Link href={`/races/${race.id}`} className="block w-full">
                  <Button variant="outline" size="sm" className="w-full">View Details</Button>
                </Link>
              </div>
            ))}
          </div>
        )}

        {/* Desktop table - hidden on small screens */}
        {!loading && !error && filteredRaces.length > 0 && (
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left pb-2 text-sm font-medium">Race</th>
                  <th className="text-left pb-2 text-sm font-medium">Track</th>
                  <th className="text-left pb-2 text-sm font-medium">Date</th>
                  <th className="text-left pb-2 text-sm font-medium">Time</th>
                  <th className="text-left pb-2 text-sm font-medium">Distance</th>
                  <th className="text-left pb-2 text-sm font-medium">Class</th>
                  <th className="text-left pb-2 text-sm font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRaces.map(race => (
                  <tr key={race.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 text-sm">Race {race.race_number || '-'}</td>
                    <td className="py-3 text-sm">{race.track_name || 'Unknown'}</td>
                    <td className="py-3 text-sm">{race.race_date || 'TBD'}</td>
                    <td className="py-3 text-sm">{race.race_time || 'TBD'}</td>
                    <td className="py-3 text-sm">{race.distance ? `${race.distance}m` : 'TBD'}</td>
                    <td className="py-3 text-sm">{race.race_class || 'TBD'}</td>
                    <td className="py-3 text-sm">
                      <Link href={`/races/${race.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination - responsive */}
        {!loading && !error && filteredRaces.length > 0 && (
          <div className="mt-6 flex flex-col xs:flex-row justify-between items-center gap-3">
            <div className="hidden md:block">
              <span className="text-xs md:text-sm opacity-70">
                Showing {filteredRaces.length > 0 ? `1-${Math.min(filteredRaces.length, 10)}` : '0'} of {filteredRaces.length} races
              </span>
            </div>
            <div className="flex gap-2 w-full xs:w-auto">
              <Button variant="outline" size="sm" disabled className="flex-1 xs:flex-none">Previous</Button>
              <Button variant="outline" size="sm" className="flex-1 xs:flex-none">Next</Button>
            </div>
          </div>
        )}
      </div>

      {/* Featured races - responsive grid */}
      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6 md:mb-8">
        <h2 className="text-xl font-bold mb-4">Featured Races</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-bold mb-2">Melbourne Cup</h3>
            <p className="text-xs md:text-sm mb-2">Flemington | Nov 4, 2025</p>
            <p className="text-xs md:text-sm mb-4">3200m | Group 1</p>
            <Link href="/races/melbourne-cup" className="block w-full">
              <Button variant="outline" size="sm" className="w-full">View Details</Button>
            </Link>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-bold mb-2">Cox Plate</h3>
            <p className="text-xs md:text-sm mb-2">Moonee Valley | Oct 25, 2025</p>
            <p className="text-xs md:text-sm mb-4">2040m | Group 1</p>
            <Link href="/races/cox-plate" className="block w-full">
              <Button variant="outline" size="sm" className="w-full">View Details</Button>
            </Link>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-bold mb-2">Golden Slipper</h3>
            <p className="text-xs md:text-sm mb-2">Rosehill | Mar 22, 2025</p>
            <p className="text-xs md:text-sm mb-4">1200m | Group 1</p>
            <Link href="/races/golden-slipper" className="block w-full">
              <Button variant="outline" size="sm" className="w-full">View Details</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs md:text-sm opacity-70">
          Australian Horse Racing Prediction System © 2025
        </p>
      </div>
    </main>
  );
}