// API endpoint for sending progress updates during backtest processing
import { NextResponse } from 'next/server';

// Global variable to store progress information
// In a real application, this would be stored in a database or Redis
let progressData = {
  progress: 0,
  stage: 'Initializing...',
  sessionId: null
};

// Function to update progress
export function updateProgress(progress, stage, sessionId) {
  progressData = {
    progress,
    stage,
    sessionId
  };
}

// Server-Sent Events handler
export async function GET(request) {
  // Set headers for SSE
  const headers = {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  };

  // Create a readable stream
  const stream = new ReadableStream({
    start(controller) {
      // Send initial progress
      const initialData = `data: ${JSON.stringify(progressData)}\n\n`;
      controller.enqueue(new TextEncoder().encode(initialData));
      
      // Set up interval to send progress updates
      const interval = setInterval(() => {
        const data = `data: ${JSON.stringify(progressData)}\n\n`;
        controller.enqueue(new TextEncoder().encode(data));
        
        // If progress is 100%, end the stream
        if (progressData.progress >= 100) {
          clearInterval(interval);
          controller.close();
        }
      }, 1000); // Send updates every second
      
      // Clean up when the client disconnects
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    }
  });
  
  return new Response(stream, { headers });
}

// Export the progress data for use in other files
export { progressData };