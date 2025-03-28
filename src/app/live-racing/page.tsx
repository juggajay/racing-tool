'use client';

import React from 'react';
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

// Component to display today's meetings
function TodaysMeetingsList() {
  // Fetch today's meetings list using the hook
  // The hook handles API key retrieval from localStorage
  const { data, isLoading, error } = usePuntingFormApi('form/meetingslist');

  // Assuming the API returns data in the structure { meetings: Meeting[] }
  // Need to adjust based on actual API response if different
  const meetings: Meeting[] | null = data?.meetings;

  if (isLoading) {
    return <div className="text-center text-gray-400 py-8">Loading today's meetings...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Error loading meetings: {error.message}</div>;
  }

  if (!meetings || meetings.length === 0) {
    return <div className="text-center text-gray-400 py-8">No race meetings found for today.</div>;
  }

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
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Live Racing</h1>
         {/* Add any relevant action buttons if needed, e.g., Refresh */}
         {/* <Button variant="outline">Refresh</Button> */}
      </div>

      <section className="bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg">
         <div className="max-w-7xl mx-auto">
           <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Today's Race Meetings</h2>
           <TodaysMeetingsList />
         </div>
      </section>

      {/* Placeholder for other live data sections (e.g., Scratchings, Next to Jump) */}
      {/*
      <section className="mt-8 bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg">
         <div className="max-w-7xl mx-auto">
           <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">Scratchings</h2>
           <p className="text-center text-gray-400">Scratchings data will be displayed here.</p>
         </div>
      </section>
      */}

    </main>
  );
}