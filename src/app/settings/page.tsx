'use client';

import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/ui/file-upload"; // Added
import { useState, useEffect, useRef } from "react"; // Added useRef
import Link from "next/link";

// --- Backtest Interfaces (Copied) ---
interface BacktestResult {
  id: string;
  date: string;
  model: string;
  timePeriods: number;
  bettingStrategy: string;
  summary: {
    top1Accuracy: string;
    top3Accuracy: string;
    top4Accuracy: string;
    roi: string;
    totalRaces: number;
    correctPredictions: number;
  };
  periodResults: Array<{
    period: number;
    date: string;
    top1Accuracy: string;
    top3Accuracy: string;
    top4Accuracy: string;
    roi: string;
  }>;
  racePredictions: Array<{
    race: string;
    predictedWinner: string;
    predictedOdds: string;
    actualWinner: string;
    actualOdds: string;
    correct: boolean;
  }>;
  computationTime: string;
}
// --- End Backtest Interfaces ---

export default function SettingsPage() {
  // --- Removed API Key State ---

  // --- Backtest State (Copied) ---
  const [backtestSelectedFile, setBacktestSelectedFile] = useState<File | null>(null);
  const [backtestTimePeriods, setBacktestTimePeriods] = useState<number>(5);
  const [backtestModel, setBacktestModel] = useState<string>("ensemble");
  const [backtestBettingStrategy, setBacktestBettingStrategy] = useState<string>("value");
  const [backtestComputationEngine, setBacktestComputationEngine] = useState<string>("local");
  const [backtestParallelProcessing, setBacktestParallelProcessing] = useState<string>("2");
  const [backtestCacheSettings, setBacktestCacheSettings] = useState<string>("memory");
  const [backtestLogLevel, setBacktestLogLevel] = useState<string>("info");
  const [backtestLoading, setBacktestLoading] = useState<boolean>(false);
  const [backtestResult, setBacktestResult] = useState<BacktestResult | null>(null);
  const [backtestError, setBacktestError] = useState<string | null>(null);
  const [backtestProgress, setBacktestProgress] = useState<number>(0);
  const [backtestProcessingStage, setBacktestProcessingStage] = useState<string>("");
  const backtestPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  // --- End Backtest State ---

  // --- Removed API Key useEffect and handlers ---

  // --- Backtest Polling Effect (Copied & Adapted) ---
  useEffect(() => {
    if (backtestLoading) {
      if (backtestPollingIntervalRef.current) clearInterval(backtestPollingIntervalRef.current);
      backtestPollingIntervalRef.current = setInterval(async () => {
        try {
          const response = await fetch('/api/backtest/progress');
          if (!response.ok) { console.error('Failed to fetch progress'); return; }
          const data = await response.json();
          if (data.progress > backtestProgress || data.stage !== backtestProcessingStage) {
             setBacktestProgress(data.progress);
             setBacktestProcessingStage(data.stage);
          }
          if (data.progress >= 100) {
            if (backtestPollingIntervalRef.current) clearInterval(backtestPollingIntervalRef.current);
            backtestPollingIntervalRef.current = null;
          }
        } catch (err) {
          console.error('Error fetching progress:', err);
          if (backtestPollingIntervalRef.current) clearInterval(backtestPollingIntervalRef.current);
          backtestPollingIntervalRef.current = null;
        }
      }, 1500);
    } else {
      if (backtestPollingIntervalRef.current) clearInterval(backtestPollingIntervalRef.current);
      backtestPollingIntervalRef.current = null;
    }
    return () => {
      if (backtestPollingIntervalRef.current) clearInterval(backtestPollingIntervalRef.current);
      backtestPollingIntervalRef.current = null;
    };
  }, [backtestLoading, backtestProgress, backtestProcessingStage]);
  // --- End Backtest Polling Effect ---

  // --- Backtest Helper Functions (Copied & Adapted) ---
  const handleBacktestFileChange = (file: File | null) => {
    setBacktestSelectedFile(file);
    console.log("Backtest file selected:", file?.name);
  };
  const handleBacktestTimePeriodsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 2 && value <= 10) setBacktestTimePeriods(value);
  };
  const handleRunBacktest = async (e: React.FormEvent) => {
    e.preventDefault();
    setBacktestLoading(true); setBacktestError(null); setBacktestResult(null); setBacktestProgress(0); setBacktestProcessingStage("Initializing...");
    try {
      if (!backtestSelectedFile) throw new Error("Please select a file to upload for backtesting");
      const formData = new FormData();
      formData.append('file', backtestSelectedFile);
      formData.append('model', backtestModel);
      formData.append('timePeriods', backtestTimePeriods.toString());
      formData.append('bettingStrategy', backtestBettingStrategy);
      formData.append('computationEngine', backtestComputationEngine);
      formData.append('parallelProcessing', backtestParallelProcessing);
      formData.append('cacheSettings', backtestCacheSettings);
      formData.append('logLevel', backtestLogLevel);
      const response = await fetch('/api/backtest', { method: 'POST', body: formData });
      if (!response.ok) {
        let errorMessage = `Request failed: ${response.status} ${response.statusText}`; let errorDetails = '';
        try {
          const contentType = response.headers.get('content-type');
          if (contentType && contentType.includes('application/json')) { const errorData = await response.json(); errorDetails = errorData.message || JSON.stringify(errorData); }
          else { errorDetails = await response.text(); console.error("Non-JSON error response text:", errorDetails); }
        } catch (parseError) { console.error("Error reading/parsing error response body:", parseError); errorDetails = "(Could not read error response body)"; }
        if (errorDetails && errorDetails.length < 200) errorMessage += ` - ${errorDetails}`; else if (errorDetails) errorMessage += ` - (See console for full error details)`;
        throw new Error(errorMessage);
      }
      const resultData = await response.json(); setBacktestResult(resultData); setBacktestProgress(100); setBacktestProcessingStage("Complete");
    } catch (err) {
      console.error('Error running backtest:', err); setBacktestError(err instanceof Error ? err.message : 'An unknown error occurred'); setBacktestProcessingStage("Error"); setBacktestProgress(0);
    } finally {
      setBacktestLoading(false);
      if (backtestPollingIntervalRef.current) clearInterval(backtestPollingIntervalRef.current); backtestPollingIntervalRef.current = null;
    }
  };
  const BacktestProgressBar = ({ progress, stage }: { progress: number, stage: string }) => (
    <div className="mt-4">
      <div className="flex justify-between mb-1"><span className="text-sm font-medium">{stage}</span><span className="text-sm font-medium">{progress}%</span></div>
      <div className="w-full bg-gray-700 rounded-full h-2.5"><div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" style={{ width: `${progress}%` }}></div></div>
    </div>
  );
  // --- End Backtest Helper Functions ---


  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Settings</h1>
        <div className="w-full sm:w-auto">
          <Link href="/" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">Back to Home</Button>
          </Link>
        </div>
      </div>

      {/* API Settings Info Card (Key input removed) */}
      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4">API Settings</h2>
        <div className="mb-6">
          <h3 className="text-lg font-medium mb-2">Punting Form API</h3>
          <p className="text-sm opacity-70 mb-4">
            The Punting Form API key is configured via server-side environment variables (`PUNTING_FORM_API_KEY`) in your Vercel project settings.
            It is used by the backend to fetch live racing data.
          </p>
           <p className="text-sm opacity-70">
             Refer to the Vercel documentation for instructions on setting environment variables.
           </p>
        </div>
      </div>

      {/* Manual Backtesting Card */}
      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6">
         <h2 className="text-xl font-bold mb-4">Manual Backtesting</h2>
         <p className="text-sm opacity-70 mb-4">
             Run a backtest simulation using historical data you provide. Upload a CSV, Excel, or TAR file.
         </p>
         {/* Backtest Form */}
         <form className="space-y-4" onSubmit={handleRunBacktest}>
             <div>
               <label className="block mb-2 text-sm font-medium">Prediction Model</label>
               <select className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" value={backtestModel} onChange={(e) => setBacktestModel(e.target.value)}>
                 <option value="ensemble">Ensemble (Recommended)</option>
                 <option value="random_forest">Random Forest</option>
                 <option value="gradient_boosting">Gradient Boosting</option>
               </select>
             </div>
             <div>
               <label className="block mb-2 text-sm font-medium">Number of Time Periods</label>
               <input type="number" className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500" min="2" max="10" value={backtestTimePeriods} onChange={handleBacktestTimePeriodsChange} />
               <p className="mt-1 text-xs opacity-70">Number of time periods to use for backtesting (2-10)</p>
             </div>
             <div>
               <label className="block mb-2 text-sm font-medium">Betting Strategy</label>
               <select className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black" value={backtestBettingStrategy} onChange={(e) => setBacktestBettingStrategy(e.target.value)}>
                 <option value="value">Value Betting</option>
                 <option value="favorite">Favorite</option>
                 <option value="probability">Highest Probability</option>
               </select>
             </div>
             <div>
               <FileUpload label="Upload Dataset (CSV, Excel, or TAR)" helperText="Upload your historical race data for backtesting" onFileChange={handleBacktestFileChange} accept=".csv,.xlsx,.json,.tar" id="dataset-upload" />
               {backtestSelectedFile && (<p className="mt-2 text-sm text-green-400">File ready: {backtestSelectedFile.name} ({Math.round(backtestSelectedFile.size / 1024)} KB)</p>)}
             </div>
             <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700 disabled:opacity-50" disabled={backtestLoading}>{backtestLoading ? 'Running Backtest...' : 'Run Backtest'}</Button>
             {backtestLoading && <BacktestProgressBar progress={backtestProgress} stage={backtestProcessingStage} />}
             {backtestError && (<div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md text-red-300"><p className="text-sm">{backtestError}</p></div>)}
         </form>

         {/* Backtest Results Display */}
         {backtestResult && (
           <div className="mt-6 border-t border-white/10 pt-6">
             <h3 className="text-lg font-bold mb-4">Backtest Results</h3>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-lg"><div className="text-sm opacity-70 mb-1">Top-1 Acc</div><div className="text-xl font-bold">{backtestResult.summary.top1Accuracy}</div></div>
                <div className="bg-white/5 p-4 rounded-lg"><div className="text-sm opacity-70 mb-1">Top-3 Acc</div><div className="text-xl font-bold">{backtestResult.summary.top3Accuracy}</div></div>
                <div className="bg-white/5 p-4 rounded-lg"><div className="text-sm opacity-70 mb-1">Top-4 Acc</div><div className="text-xl font-bold">{backtestResult.summary.top4Accuracy}</div></div>
                <div className="bg-white/5 p-4 rounded-lg"><div className="text-sm opacity-70 mb-1">ROI</div><div className={`text-xl font-bold ${parseFloat(backtestResult.summary.roi) > 0 ? 'text-green-500' : 'text-red-500'}`}>{backtestResult.summary.roi}</div></div>
             </div>
           </div>
         )}
      </div>


      {/* Application Settings Card */}
      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6">
        <h2 className="text-xl font-bold mb-4">Application Settings</h2>
         <div className="space-y-4">
           <div>
             <label htmlFor="theme" className="block text-sm font-medium mb-1">Theme</label>
             <select id="theme" className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultValue="dark">
               <option value="dark">Dark</option> <option value="light">Light</option> <option value="system">System Default</option>
             </select>
           </div>
           <div className="flex items-center gap-2">
             <input id="notifications" type="checkbox" className="rounded bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultChecked />
             <label htmlFor="notifications" className="text-sm font-medium">Enable Notifications</label>
           </div>
           <div className="flex items-center gap-2">
             <input id="analytics" type="checkbox" className="rounded bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500" defaultChecked />
             <label htmlFor="analytics" className="text-sm font-medium">Enable Analytics</label>
           </div>
         </div>
      </div>

      <div className="text-center">
        <p className="text-xs md:text-sm opacity-70">
          Australian Horse Racing Prediction System © 2025
        </p>
      </div>
    </main>
  );
}