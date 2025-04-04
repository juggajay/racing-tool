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

interface MeetingDetailsProps {
  meetingId: string;
}

export function MeetingDetails({ meetingId }: MeetingDetailsProps) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMeetingData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(`/api/meeting/${meetingId}`);
        if (!response.ok) {
          throw new Error(`API request failed: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        setMeeting(data.meeting);
        setIsLoading(false);
      } catch (err) {
        console.error('Error fetching meeting data:', err);
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
        setIsLoading(false);
      }
    };

    if (meetingId) {
      fetchMeetingData();
    }
  }, [meetingId]);

  if (isLoading) {
    return <div className="text-center text-gray-400 py-8">Loading meeting details...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500 py-8">Error loading meeting details: {error}</div>;
  }

  if (!meeting) {
    return <div className="text-center text-gray-400 py-8">No meeting details found for ID: {meetingId}</div>;
  }

  // Format the meeting date
  const formattedDate = new Date(meeting.meetingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      <section className="bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg mb-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
            {meeting.name}
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Location</h3>
              <p className="text-gray-400">
                {meeting.track.name} - {meeting.track.location}, {meeting.track.state}
              </p>
            </div>
            
            <div className="bg-gray-900 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-white mb-2">Details</h3>
              <p className="text-gray-400">
                Date: {formattedDate}<br />
                Races: {meeting.races.length}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center gap-4 mt-6">
            <Link href="/live-racing">
              <Button variant="outline">Back to Live Racing</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gray-950 py-8 px-4 sm:px-6 lg:px-8 rounded-lg shadow-lg">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-6 text-center">
            Races
          </h2>
          
          {meeting.races.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
              {meeting.races.map((race) => (
                <div key={race.raceId} className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-indigo-500 transition-colors duration-200">
                  <h3 className="text-lg font-semibold text-white mb-1">Race {race.raceNumber}</h3>
                  <p className="text-sm text-gray-400 mb-2">{race.raceName}</p>
                  <p className="text-sm text-gray-500 mb-3">
                    Distance: {race.distance}m | 
                    Runners: {race.numberOfRunners}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 py-4">No races found for this meeting.</div>
          )}
        </div>
      </section>
    </>
  );
}