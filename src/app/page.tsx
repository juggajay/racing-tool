'use client';

import React, { useState, useEffect } from 'react'; // Added useState, useEffect
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { usePuntingFormApi } from '@/hooks/usePuntingFormApi'; // Import the hook

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
function TodaysMeetings() {
  const { data, isLoading, error } = usePuntingFormApi('form/meetingslist'); // Fetch today's meetings

  // Assuming the API returns data in the structure { meetings: Meeting[] }
  const meetings: Meeting[] | null = data?.meetings;

  if (isLoading) {
    return <div className="text-center text-gray-400">Loading today's meetings...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading meetings: {error.message}</div>;
  }

  if (!meetings || meetings.length === 0) {
    return <div className="text-center text-gray-400">No race meetings found for today.</div>;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {meetings.map((meeting) => (
        <div key={meeting.meetingId} className="bg-gray-900 p-4 rounded-lg border border-gray-800 hover:border-indigo-500 transition-colors duration-200">
          <h3 className="text-lg font-semibold text-white mb-1">{meeting.meetingName}</h3>
          <p className="text-sm text-gray-400 mb-2">{meeting.trackName} - {meeting.location}, {meeting.state}</p>
          <p className="text-sm text-gray-500 mb-3">{meeting.raceCount} Races</p>
          {/* TODO: Link to a future meeting details page */}
          <Link href={`/races/meeting/${meeting.meetingId}`}>
             <Button variant="outline" size="sm" className="w-full">View Races</Button>
          </Link>
        </div>
      ))}
    </div>
  );
}


export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-gray-900 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
        </div>
        <div className="absolute -top-10 -left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob hidden lg:block"></div>
        <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 hidden lg:block"></div>

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center">
            {/* Text Content */}
            <div>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 md:mb-6 leading-tight">
                AI-Powered <span className="text-indigo-400">Horse Racing</span> Predictions
              </h1>
              <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl">
                Harness the power of advanced machine learning algorithms to gain a competitive edge in horse racing predictions. Our AI analyzes thousands of data points to deliver accurate forecasts.
              </p>
              <div className="flex flex-wrap gap-3 md:gap-4">
                <Link href="/register">
                  <Button className="text-base md:text-lg px-5 py-3 md:px-8 md:py-6 w-full sm:w-auto">
                    Register Now
                  </Button>
                </Link>
                <Link href="/predict">
                  <Button variant="outline" className="text-base md:text-lg px-5 py-3 md:px-8 md:py-6 border-2 w-full sm:w-auto">
                    Try Predictions
                  </Button>
                </Link>
              </div>
            </div>

            {/* Prediction Card Example (Simplified for brevity, original kept below) */}
             <div className="relative mt-8 lg:mt-0">
               <div className="w-full h-full bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl">
                 <div className="flex justify-between items-center mb-6">
                   <div className="text-xl font-bold text-white">Example Prediction</div>
                   <div className="text-sm text-indigo-400">Ensemble ML</div>
                 </div>
                 <div className="bg-gray-700/50 p-4 rounded-lg">
                   <div className="flex justify-between mb-1">
                     <span className="text-gray-300">Race #1428</span>
                     <span className="text-green-400">92% Confidence</span>
                   </div>
                   <div className="text-lg font-medium text-white">Predicted Winner: Northern Star</div>
                   {/* Simplified stats */}
                 </div>
               </div>
             </div>
          </div>
        </div>
      </section>

      {/* Today's Meetings Section */}
      <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-950">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">Today's Race Meetings</h2>
            <p className="text-base md:text-lg text-gray-400 max-w-3xl mx-auto">
              Live data fetched from Punting Form API.
            </p>
          </div>
          <TodaysMeetings /> {/* Render the meetings component */}
        </div>
      </section>


      {/* Features Section */}
      <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-gray-900"> {/* Changed background slightly */}
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 md:mb-4">Advanced Machine Learning Technology</h2>
            <p className="text-base md:text-xl text-gray-400 max-w-3xl mx-auto">
              Our platform leverages cutting-edge AI to analyze race data and deliver accurate predictions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature Cards */}
             <div className="bg-gray-800 p-5 md:p-8 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300">
               <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-900 rounded-lg flex items-center justify-center mb-4 md:mb-6">
                 {/* Icon */}
               </div>
               <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Ensemble Learning</h3>
               <p className="text-sm md:text-base text-gray-400">
                 Combines multiple algorithms for superior prediction accuracy.
               </p>
             </div>
             <div className="bg-gray-800 p-5 md:p-8 rounded-xl border border-gray-700 hover:border-purple-500 transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-purple-900 rounded-lg flex items-center justify-center mb-4 md:mb-6">
                  {/* Icon */}
                </div>
               <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Real-time Processing</h3>
               <p className="text-sm md:text-base text-gray-400">
                 Analyzes thousands of data points including performance, conditions, and stats.
               </p>
             </div>
             <div className="bg-gray-800 p-5 md:p-8 rounded-xl border border-gray-700 hover:border-indigo-500 transition-all duration-300">
                <div className="w-10 h-10 md:w-12 md:h-12 bg-indigo-900 rounded-lg flex items-center justify-center mb-4 md:mb-6">
                 {/* Icon */}
                </div>
               <h3 className="text-lg md:text-xl font-bold text-white mb-2 md:mb-3">Adaptive Learning</h3>
               <p className="text-sm md:text-base text-gray-400">
                 Models continuously learn and improve from new race results.
               </p>
             </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-950 to-gray-900"> {/* Changed background slightly */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            {/* Stats */}
             <div className="text-center p-3">
               <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-400 mb-1 md:mb-2">93%</div>
               <div className="text-xs md:text-sm text-gray-400">Accuracy for Top 3 Finishes</div>
             </div>
             <div className="text-center p-3">
               <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-400 mb-1 md:mb-2">8.7%</div>
               <div className="text-xs md:text-sm text-gray-400">Average ROI</div>
             </div>
             <div className="text-center p-3">
               <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-indigo-400 mb-1 md:mb-2">10K+</div>
               <div className="text-xs md:text-sm text-gray-400">Races Analyzed</div>
             </div>
             <div className="text-center p-3">
               <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-400 mb-1 md:mb-2">24/7</div>
               <div className="text-xs md:text-sm text-gray-400">Real-time Updates</div>
             </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 md:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-indigo-900 via-purple-900 to-indigo-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 md:mb-6">Ready to Transform Your Racing Strategy?</h2>
          <p className="text-base md:text-xl text-gray-300 mb-6 md:mb-8">
            Join thousands of users who are leveraging AI to make smarter, data-driven betting decisions.
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap justify-center gap-4 sm:gap-4">
            <Link href="/register" className="w-full sm:w-auto">
              <Button className="text-base md:text-lg px-5 py-3 md:px-8 md:py-6 w-full">
                Register Now
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto"> {/* Changed link to /dashboard */}
              <Button variant="outline" className="text-white border-white hover:bg-white/10 text-base md:text-lg px-5 py-3 md:px-8 md:py-6 w-full">
                Explore Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
