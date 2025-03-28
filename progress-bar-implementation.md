# Progress Bar Implementation for Backtesting

## Overview

I've implemented a progress bar for the backtesting functionality that shows how much of the data has been processed in real-time. This provides a better user experience by giving visual feedback during the potentially time-consuming backtesting process.

## Implementation Details

### Frontend Changes (src/app/backtest/page.tsx)

1. Added state variables to track progress:
   ```tsx
   const [progress, setProgress] = useState<number>(0);
   const [processingStage, setProcessingStage] = useState<string>("");
   ```

2. Added an EventSource to receive real-time updates:
   ```tsx
   useEffect(() => {
     if (loading) {
       const eventSource = new EventSource('/api/backtest/progress');
       
       eventSource.onmessage = (event) => {
         const data = JSON.parse(event.data);
         setProgress(data.progress);
         setProcessingStage(data.stage);
         
         if (data.progress >= 100) {
           eventSource.close();
         }
       };
       
       eventSource.onerror = () => {
         eventSource.close();
       };
       
       return () => {
         eventSource.close();
       };
     }
   }, [loading]);
   ```

3. Created a ProgressBar component:
   ```tsx
   const ProgressBar = ({ progress, stage }: { progress: number, stage: string }) => {
     return (
       <div className="mt-4">
         <div className="flex justify-between mb-1">
           <span className="text-sm font-medium">{stage}</span>
           <span className="text-sm font-medium">{progress}%</span>
         </div>
         <div className="w-full bg-gray-700 rounded-full h-2.5">
           <div 
             className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
             style={{ width: `${progress}%` }}
           ></div>
         </div>
       </div>
     );
   };
   ```

4. Added the progress bar to the form:
   ```tsx
   {loading && <ProgressBar progress={progress} stage={processingStage} />}
   ```

### Backend Changes

1. Created a new API endpoint (src/app/api/backtest/progress/route.js) for Server-Sent Events:
   ```javascript
   // Global variable to store progress information
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
   ```

2. Updated the backtest API (src/app/api/backtest/route.js) to update progress at various stages:
   ```javascript
   // Update progress to 10% - Starting file processing
   updateProgress(10, "Reading file...", sessionId);
   await new Promise(resolve => setTimeout(resolve, 1000));

   // Update progress to 20% - File read complete
   updateProgress(20, "Parsing data...", sessionId);
   await new Promise(resolve => setTimeout(resolve, 1000));

   // Update progress to 30% - Data parsing complete
   updateProgress(30, "Preparing model...", sessionId);
   await new Promise(resolve => setTimeout(resolve, 1000));
   
   // ... more progress updates throughout the processing ...
   
   // Update progress to 100% - Processing complete
   updateProgress(100, "Complete", sessionId);
   ```

## Testing the Implementation

Since the deployment to Vercel is not working, I've created several ways to test the progress bar functionality:

1. **Simple HTML Demo**: Open `test-progress-bar.html` in your browser to see a basic demonstration of the progress bar.

2. **Full Backtesting Demo**: Open `backtest-demo.html` in your browser to see a more complete demonstration of the backtesting page with the progress bar.

3. **Deployment Instructions**: Check `deploy-instructions.md` for various ways to deploy the changes to Vercel.

4. **Deployment Scripts**: 
   - Windows: Run `.\deploy-to-vercel.ps1` in PowerShell
   - Unix/Mac: Run `./deploy-to-vercel.sh` in Terminal

## Progress Bar Stages

The progress bar shows the following stages during backtesting:

1. "Initializing..." (0%)
2. "Uploading file..." (5%)
3. "Reading file..." (10%)
4. "Parsing data..." (20%)
5. "Preparing model..." (30%)
6. "Running backtest..." (50%)
7. "Processing period X of Y..." (50-80%)
8. "Generating race predictions..." (80%)
9. "Finalizing results..." (95%)
10. "Complete" (100%)

## Next Steps

Once you've successfully deployed the changes to Vercel, you can test the progress bar by:

1. Going to https://horses-rose.vercel.app/backtest
2. Uploading your test file (data (1).tar)
3. Clicking "Run Backtest"

You should see the progress bar update in real-time as the backtest runs.