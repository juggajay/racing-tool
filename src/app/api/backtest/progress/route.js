// API endpoint for retrieving progress updates during backtest processing
import { NextResponse } from 'next/server';

// Global variable to store progress information
// In a real application, this would be stored in a database or Redis
let progressData = {
  progress: 0,
  stage: 'Initializing...',
  sessionId: null
};

// Function to update progress (used by the main backtest API)
export function updateProgress(progress, stage, sessionId) {
  // Only update if the sessionId matches or if the process is starting/ending
  if (progressData.sessionId === null || sessionId === progressData.sessionId || progress === 0 || progress === 100) {
    progressData = {
      progress,
      stage,
      sessionId: (progress > 0 && progress < 100) ? sessionId : null // Clear sessionId when complete or reset
    };
    console.log(`Progress Updated: ${progress}% - ${stage} (Session: ${sessionId})`);
  } else {
    console.log(`Progress update ignored for session ${sessionId}, current session is ${progressData.sessionId}`);
  }
}

// GET handler to retrieve current progress
export async function GET(request) {
  try {
    // Return the current progress data
    // Add a timestamp to help clients detect changes
    const responseData = {
      ...progressData,
      timestamp: Date.now()
    };
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Error retrieving progress:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve progress' },
      { status: 500 }
    );
  }
}

// Export the progress data (optional, might not be needed externally anymore)
export { progressData };