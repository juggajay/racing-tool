'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";

interface Race {
  raceId: number;
  raceNumber: number;
  raceName: string;
  distance: number;
  numberOfRunners: number;
}

interface Track {
  name: string;
  location: string;
  state: string;
}

interface Meeting {
  meetingId: string;
  name: string;
  track: Track;
  meetingDate: string;
  races: Race[];
}

export default function MeetingDetailsPage({ params }: { params: { meetingId: string } }) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchMeetingDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/meeting/${params.meetingId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch meeting details: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('Meeting details data:', data);
        
        if (data.meeting) {
          setMeeting(data.meeting);
        } else {
          throw new Error('Invalid meeting data format');
        }
      } catch (err) {
        console.error('Error fetching meeting details:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    }
    
    fetchMeetingDetails();
  }, [params.meetingId]);

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Meeting Details</h1>
        <div className="text-center py-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Loading...</span>
          </div>
          <p className="mt-4 text-gray-400">Loading meeting details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen flex-col p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Meeting Details</h1>
        <div className="bg-red-900/20 border border-red-800 rounded-lg p-4 text-center">
          <h2 className="text-xl text-red-500 mb-2">Error Loading Meeting Details</h2>
          <p className="text-gray-400 mb-4">{error}</p>
          <Link href="/live-racing">
            <Button variant="outline">Back to Live Racing</Button>
          </Link>
        </div>
      </div>
    );
  }

  if (!meeting) {
    return (
      <div className="flex min-h-screen flex-col p-4 md:p-6">
        <h1 className="text-2xl md:text-3xl font-bold mb-6">Meeting Details</h1>
        <div className="text-center py-12">
          <p className="text-gray-400">No meeting details found.</p>
          <Link href="/live-racing" className="mt-4 inline-block">
            <Button variant="outline">Back to Live Racing</Button>
          </Link>
        </div>
      </div>
    );
  }

  // Format date for display
  const meetingDate = new Date(meeting.meetingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <h1 className="text-2xl md:text-3xl font-bold">Meeting Details</h1>
      <p className="text-sm text-gray-500 mb-6">Meeting ID: {params.meetingId}</p>

      <div className="bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg mb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
            {meeting.track?.name || meeting.name || 'Race Meeting'}
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-900/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Location</h3>
              <p className="text-gray-400">
                {meeting.track?.name || 'Unknown Track'} - {meeting.track?.location || 'Unknown Location'}, {meeting.track?.state || 'Unknown State'}
              </p>
            </div>

            <div className="bg-gray-900/50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">Details</h3>
              <p className="text-gray-400">Date: {meetingDate}</p>
              <p className="text-gray-400">Races: {meeting.races?.length || 0}</p>
            </div>
          </div>

          <div className="flex justify-center mb-8">
            <Link href="/live-racing">
              <Button variant="outline" size="lg">Back to Live Racing</Button>
            </Link>
          </div>
        </div>
      </div>

      <section className="bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
            Races
          </h2>

          {meeting.races && meeting.races.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {meeting.races.map((race) => (
                <div key={race.raceId} className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-indigo-500 transition-colors duration-200">
                  <h3 className="text-lg font-semibold text-white mb-1">Race {race.raceNumber}</h3>
                  <p className="text-sm text-gray-400 mb-2">{race.raceName}</p>
                  <div className="flex justify-between text-sm text-gray-500 mb-3">
                    <span>Distance: {race.distance}m</span>
                    <span>Runners: {race.numberOfRunners}</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400 mb-4">No races found for this meeting.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}