'use client';

import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { usePuntingFormApi } from '@/hooks/usePuntingFormApi';

// Define interface for meeting data (based on Punting Form API structure)
interface Meeting {
  meetingId: number;
  meetingName: string;
  trackName: string;
  location: string;
  state: string;
  meetingDate: string; // e.g., "2025-03-28T00:00:00"
  raceCount: number;
  // Add other relevant fields if needed
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
function MeetingsList({ selectedDate }: { selectedDate: string }) {
  const formattedDate = formatDateForApi(selectedDate);
  // Fetch meetings list for the selected date using the hook
  // Skip fetch if formattedDate is empty (e.g., invalid input)
  const { data, isLoading, error } = usePuntingFormApi(
    'form/meetingslist',
    { date: formattedDate }, // Pass formatted date as 'date' parameter
    !formattedDate // Skip if date is invalid/empty
  );

  // Handle potential response structures based on Punting Form API documentation
  const meetings: Meeting[] | null = (data && data.payload && Array.isArray(data.payload))
                                      ? data.payload
                                      : (data && Array.isArray(data.meetings))
                                        ? data.meetings
                                        : (Array.isArray(data))
                                          ? data
                                          : null;
  
  // Log the data structure for debugging
  console.log('Punting Form API response structure:', {
    hasData: !!data,
    hasPayload: !!(data && data.payload),
    isPayloadArray: !!(data && data.payload && Array.isArray(data.payload)),
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

  if (error) {
    return <div className="text-center text-red-500 py-8">Error loading meetings: {error.message}</div>;
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
        <div className="text-xs text-gray-600">
          API Response Debug Info: {JSON.stringify({
            hasData: !!data,
            dataType: data ? typeof data : 'undefined',
            hasPayload: !!(data && data.payload),
            payloadType: (data && data.payload) ? typeof data.payload : 'undefined',
            isPayloadArray: !!(data && data.payload && Array.isArray(data.payload)),
            payloadLength: (data && data.payload && Array.isArray(data.payload)) ? data.payload.length : 0
          }, null, 2)}
        </div>
      </div>
    );
  }

  // Display the meetings if found
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {meetings.map((meeting) => (
        <div key={meeting.meetingId} className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-indigo-500 transition-colors duration-200 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{meeting.meetingName}</h3>
            <p className="text-sm text-gray-400 mb-2">{meeting.trackName} - {meeting.location}, {meeting.state}</p>
            <p className="text-sm text-gray-500 mb-3">{meeting.raceCount} Races</p>
          </div>
          {/* TODO: Link to a future meeting details page */}
          <Link href={`/races/meeting/${meeting.meetingId}`} className="mt-auto">
             <Button variant="outline" size="sm" className="w-full">View Races</Button>
          </Link>
        </div>
      ))}
    </div>
  );
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
           <MeetingsList selectedDate={selectedDate} />
         </div>
      </section>

      {/* Placeholder for other live data sections */}
      {/* ... */}

    </main>
  );
}