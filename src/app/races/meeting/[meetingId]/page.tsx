'use client';

import React, { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function MeetingPage() {
  const params = useParams();
  const router = useRouter();
  const meetingId = params?.meetingId as string;

  useEffect(() => {
    // Check if we're in a browser environment
    if (typeof window !== 'undefined') {
      // Redirect to the standalone page
      window.location.href = `/api/meeting-page/${meetingId}`;
    }
  }, [meetingId]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 md:p-6">
      <div className="text-center">
        <h1 className="text-2xl md:text-3xl font-bold mb-4">Loading Meeting Details</h1>
        <p className="text-gray-400">Redirecting to meeting details page...</p>
        <p className="text-gray-500 mt-4">
          If you are not redirected automatically, please{' '}
          <a 
            href={`/api/meeting-page/${meetingId}`} 
            className="text-blue-500 hover:underline"
          >
            click here
          </a>
        </p>
      </div>
    </div>
  );
}