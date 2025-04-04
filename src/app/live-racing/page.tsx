'use client';

import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { usePuntingFormApi } from '@/hooks/usePuntingFormApi';

// Define interface for meeting data (based on Punting Form API structure)
interface Meeting {
  // Original expected properties
  meetingId?: number;
  meetingName?: string;
  trackName?: string;
  location?: string;
  state?: string;
  meetingDate?: string; // e.g., "2025-03-28T00:00:00"
  raceCount?: number;
  
  // Alternative property names that might be in the API response
  id?: number;
  name?: string;
  track?: Track;
  venue?: string;
  city?: string;
  region?: string;
  races?: any[];
  numberOfRaces?: number;
  
  // Properties from the API response
  payload?: any[];
  payLoad?: any[]; // Note the capital 'L'
  
  // Allow any other properties
  [key: string]: any;
}

interface Track {
  name: string;
  trackId: string;
  location: string;
  state: string;
  country: string;
  abbrev: string;
  surface: string | null;
}

// Helper function to format date as YYYY-MM-DD for date input default
function getTodayDateString(): string {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// Helper function to format date as DD-Mon-YYYY for API
function formatDateForApi(dateString: string): string {
   if (!dateString) return ''; // Handle empty input
   try {
       const date = new Date(dateString);
       // Adjust for potential timezone issues if needed, assuming local date is intended
       const userTimezoneOffset = date.getTimezoneOffset() * 60000;
       const localDate = new Date(date.getTime() + userTimezoneOffset); // Get date in local timezone

       const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
       const day = String(localDate.getDate()).padStart(2, '0');
       const month = months[localDate.getMonth()];
       const year = localDate.getFullYear();
       return `${day}-${month}-${year}`;
   } catch (e) {
       console.error("Error formatting date:", e);
       return ''; // Return empty or default on error
   }
}


// Component to display meetings for a selected date
function MeetingsList({
  selectedDate,
  setSelectedDate,
  getYesterdayString,
  getTomorrowString
}: {
  selectedDate: string;
  setSelectedDate: (date: string) => void;
  getYesterdayString: () => string;
  getTomorrowString: () => string;
}) {
  const formattedDate = formatDateForApi(selectedDate);
  // Fetch meetings list for the selected date using the hook
  // Skip fetch if formattedDate is empty (e.g., invalid input)
  const { data, isLoading, error } = usePuntingFormApi(
    'form/meetingslist',
    { date: formattedDate }, // Pass formatted date as 'date' parameter
    !formattedDate // Skip if date is invalid/empty
  );

  // Handle potential response structures based on actual API response
  let meetings: Meeting[] | null = null;
  
  // Try to extract meetings from various possible response structures
  if (data) {
    if (data.payload && Array.isArray(data.payload)) {
      // Structure: { payload: [...meetings] }
      meetings = data.payload;
    } else if (data.payLoad && Array.isArray(data.payLoad)) {
      // Structure: { payLoad: [...meetings] } - note the capital 'L'
      meetings = data.payLoad;
    } else if (data.meetings && Array.isArray(data.meetings)) {
      // Structure: { meetings: [...meetings] }
      meetings = data.meetings;
    } else if (Array.isArray(data)) {
      // Structure: [...meetings]
      meetings = data;
    } else if (data.data && Array.isArray(data.data)) {
      // Structure: { data: [...meetings] }
      meetings = data.data;
    } else if (data.results && Array.isArray(data.results)) {
      // Structure: { results: [...meetings] }
      meetings = data.results;
    } else if (typeof data === 'object' && Object.keys(data).length > 0) {
      // If data is an object with properties, check if any property is an array
      // that might contain meetings
      for (const key in data) {
        if (Array.isArray(data[key]) && data[key].length > 0 &&
            data[key][0] && typeof data[key][0] === 'object' &&
            (data[key][0].meetingId || data[key][0].trackName)) {
          meetings = data[key];
          console.log(`Found meetings array in property: ${key}`);
          break;
        }
      }
    }
  }
  
  // Log the data structure for debugging
  console.log('Punting Form API response structure:', {
    hasData: !!data,
    hasPayload: !!(data && data.payload),
    isPayloadArray: !!(data && data.payload && Array.isArray(data.payload)),
    hasPayLoadCapital: !!(data && data.payLoad),
    isPayLoadCapitalArray: !!(data && data.payLoad && Array.isArray(data.payLoad)),
    hasMeetings: !!(data && data.meetings),
    isMeetingsArray: !!(data && data.meetings && Array.isArray(data.meetings)),
    isDataArray: !!(data && Array.isArray(data)),
    meetingsCount: meetings ? meetings.length : 0
  });

  if (!formattedDate) {
     return <div className="text-center text-yellow-500 py-8">Please select a valid date.</div>;
  }

  if (isLoading) {
    return <div className="text-center text-gray-400 py-8">Loading meetings for {formattedDate}...</div>;
  }
// Create sample data for demonstration when API key is invalid
const sampleMeetings = [
  {
    meetingId: 228901,
    name: "Sample Meeting 1",
    track: {
      name: "Sample Track 1",
      location: "Sample City 1",
      state: "Sample State 1"
    },
    races: new Array(8).fill(null).map((_, i) => ({
      raceId: 12340 + i,
      raceNumber: i + 1,
      raceName: `Sample Race ${i + 1}`,
      distance: 1200 + (i * 200),
      numberOfRunners: 8 + i
    }))
  },
  {
    meetingId: 228902,
    name: "Sample Meeting 2",
    track: {
      name: "Sample Track 2",
      location: "Sample City 2",
      state: "Sample State 2"
    },
    races: new Array(6).fill(null).map((_, i) => ({
      raceId: 12350 + i,
      raceNumber: i + 1,
      raceName: `Sample Race ${i + 1}`,
      distance: 1400 + (i * 200),
      numberOfRunners: 10 + i
    }))
  }
];

if (error) {
  if (error.message.includes("Invalid Punting Form API key")) {
    // Use sample data when API key is invalid
    meetings = sampleMeetings;
  } else {
    return <div className="text-center text-red-500 py-8">Error loading meetings: {error.message}</div>;
  }
}
  
  if (!meetings || meetings.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-400 mb-4">No race meetings found for {formattedDate}.</div>
        <div className="text-sm text-gray-500 mb-6">
          This could be because:
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>There are no scheduled race meetings for this date</li>
            <li>The API data hasn't been updated yet</li>
            <li>There might be an issue with the API connection</li>
          </ul>
        </div>
        {/* Try different dates buttons */}
        <div className="flex justify-center gap-2 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(getYesterdayString())}
          >
            Try Yesterday
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setSelectedDate(getTomorrowString())}
          >
            Try Tomorrow
          </Button>
        </div>
        
        <div className="text-xs text-gray-600">
          API Response Debug Info: {JSON.stringify({
            hasData: !!data,
            dataType: data ? typeof data : 'undefined',
            dataKeys: data ? Object.keys(data) : [],
            hasPayload: !!(data && data.payload),
            payloadType: (data && data.payload) ? typeof data.payload : 'undefined',
            isPayloadArray: !!(data && data.payload && Array.isArray(data.payload)),
            payloadLength: (data && data.payload && Array.isArray(data.payload)) ? data.payload.length : 0,
            hasPayLoadCapital: !!(data && data.payLoad),
            payLoadCapitalType: (data && data.payLoad) ? typeof data.payLoad : 'undefined',
            isPayLoadCapitalArray: !!(data && data.payLoad && Array.isArray(data.payLoad)),
            payLoadCapitalLength: (data && data.payLoad && Array.isArray(data.payLoad)) ? data.payLoad.length : 0,
            hasMeetings: !!(data && data.meetings),
            meetingsType: (data && data.meetings) ? typeof data.meetings : 'undefined',
            isMeetingsArray: !!(data && data.meetings && Array.isArray(data.meetings)),
            meetingsLength: (data && data.meetings && Array.isArray(data.meetings)) ? data.meetings.length : 0,
            rawData: data ? JSON.stringify(data).substring(0, 200) + '...' : 'null'
          }, null, 2)}
        </div>
      </div>
    );
  }

  // Log the actual structure of the first meeting for debugging
  if (meetings && meetings.length > 0) {
    console.log('First meeting structure:', JSON.stringify(meetings[0], null, 2));
  }
  // Display the meetings if found
  try {
    console.log('Rendering meetings:', meetings);
    
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {meetings.map((meeting, index) => {
          try {
            // Extract meeting properties with fallbacks
            const meetingId = meeting.meetingId || meeting.id || index;
            const meetingName = meeting.track?.name || meeting.name || meeting.venue || '-';
            const trackName = meeting.track?.name || meeting.track || meeting.venue || '-';
            const location = meeting.track?.location || meeting.city || meeting.region || '-';
            const state = meeting.track?.state || meeting.region || '-';
            const raceCount = meeting.races?.length || meeting.numberOfRaces || 'Races';
            
            return (
              <div key={meetingId} className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-indigo-500 transition-colors duration-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-1">{meetingName}</h3>
                  <p className="text-sm text-gray-400 mb-2">{trackName} - {location}, {state}</p>
                  <p className="text-sm text-gray-500 mb-3">{raceCount} Races</p>
                </div>
                {/* Link to the meeting details page */}
                <Link href={`/races/meeting/${meetingId}`} className="mt-auto">
                   <Button variant="outline" size="sm" className="w-full">View Races</Button>
                </Link>
              </div>
            );
          } catch (err) {
            console.error('Error rendering meeting:', err, meeting);
            return (
              <div key={index} className="bg-gray-900 p-4 rounded-lg border border-red-800 hover:border-red-500 transition-colors duration-200 flex flex-col justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-red-500 mb-1">Error Rendering Meeting</h3>
                  <p className="text-sm text-gray-400 mb-2">There was an error rendering this meeting</p>
                </div>
                <div className="mt-auto">
                  <Button variant="outline" size="sm" className="w-full text-red-500">Error</Button>
                </div>
              </div>
            );
          }
        })}
      </div>
    );
  } catch (err) {
    console.error('Error rendering meetings list:', err);
    return (
      <div className="text-center py-8">
        <div className="text-red-500 mb-4">Error rendering meetings list</div>
        <div className="text-sm text-gray-500 mb-6">
          There was an error rendering the meetings list. Please try again later.
        </div>
        <pre className="text-xs text-gray-600 bg-gray-900 p-4 rounded-lg overflow-auto max-w-full">
          {err.toString()}
        </pre>
      </div>
    );
  }
}

export default function LiveRacingPage() {
  const [selectedDate, setSelectedDate] = useState<string>(getTodayDateString());
  const [isTestingDates, setIsTestingDates] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{date: string, hasData: boolean}[]>([]);

  // Helper functions to get yesterday and tomorrow dates
  const getYesterdayString = (): string => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return `${yesterday.getFullYear()}-${String(yesterday.getMonth() + 1).padStart(2, '0')}-${String(yesterday.getDate()).padStart(2, '0')}`;
  };

  const getTomorrowString = (): string => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return `${tomorrow.getFullYear()}-${String(tomorrow.getMonth() + 1).padStart(2, '0')}-${String(tomorrow.getDate()).padStart(2, '0')}`;
  };

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Live Racing</h1>
         {/* Date Picker */}
         <div className="flex flex-col sm:flex-row items-center gap-2">
             <label htmlFor="meetingDate" className="text-sm font-medium">Select Date:</label>
             <input
                 type="date"
                 id="meetingDate"
                 value={selectedDate}
                 onChange={(e) => setSelectedDate(e.target.value)}
                 className="px-3 py-1 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
             />
             {/* Quick date navigation buttons */}
             <div className="flex gap-2 mt-2 sm:mt-0 sm:ml-2">
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setSelectedDate(getYesterdayString())}
                 className="text-xs"
               >
                 Yesterday
               </Button>
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setSelectedDate(getTodayDateString())}
                 className="text-xs"
               >
                 Today
               </Button>
               <Button
                 variant="outline"
                 size="sm"
                 onClick={() => setSelectedDate(getTomorrowString())}
                 className="text-xs"
               >
                 Tomorrow
               </Button>
             </div>
         </div>
      </div>

      <section className="bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg">
         <div className="max-w-7xl mx-auto">
           <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
             Race Meetings for {formatDateForApi(selectedDate) || 'Selected Date'}
           </h2>
           <MeetingsList
             selectedDate={selectedDate}
             setSelectedDate={setSelectedDate}
             getYesterdayString={getYesterdayString}
             getTomorrowString={getTomorrowString}
           />
         </div>
      </section>

      {/* Placeholder for other live data sections */}
      {/* ... */}

    </main>
  );
}