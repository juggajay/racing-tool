'use client';

import * as React from "react";
import { Button } from "@/components/ui/button"
import { FileUpload } from "@/components/ui/file-upload"
import Link from "next/link"
import { useState, useEffect } from "react";

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

export default function BacktestPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [timePeriods, setTimePeriods] = useState<number>(5);
  const [model, setModel] = useState<string>("ensemble");
  const [bettingStrategy, setBettingStrategy] = useState<string>("value");
  const [computationEngine, setComputationEngine] = useState<string>("local");
  const [parallelProcessing, setParallelProcessing] = useState<string>("2");
  const [cacheSettings, setCacheSettings] = useState<string>("memory");
  const [logLevel, setLogLevel] = useState<string>("info");
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<number>(0);
  const [processingStage, setProcessingStage] = useState<string>("");
  
  // Set up event source for progress updates
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
  
  const handleFileChange = (file: File | null) => {
    setSelectedFile(file);
    console.log("File selected:", file?.name);
  };
  
  const handleTimePeriodsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value >= 2 && value <= 10) {
      setTimePeriods(value);
    }
  };
  
  const handleRunBacktest = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    setProgress(0);
    setProcessingStage("Initializing...");
    
    try {
      // Check if a file is selected
      if (!selectedFile) {
        throw new Error("Please select a file to upload");
      }

      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append('file', selectedFile);
      formData.append('model', model);
      formData.append('timePeriods', timePeriods.toString());
      formData.append('bettingStrategy', bettingStrategy);
      formData.append('computationEngine', computationEngine);
      formData.append('parallelProcessing', parallelProcessing);
      formData.append('cacheSettings', cacheSettings);
      formData.append('logLevel', logLevel);
      
      // Call the API with FormData
      const response = await fetch('/api/backtest', {
        method: 'POST',
        body: formData
      });
      
      // Handle the response
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to run backtest');
      }
      
      // Parse the result
      const resultData = await response.json();
      setResult(resultData);
    } catch (err) {
      console.error('Error running backtest:', err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
      setProgress(100);
      setProcessingStage("Complete");
    }
  };

  // Progress bar component
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

  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Backtesting</h1>
        <div className="flex space-x-2">
          <Link href="/predict">
            <Button className="bg-blue-600 hover:bg-blue-700">Make Predictions</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Run Backtesting</h2>
          <form className="space-y-4" onSubmit={handleRunBacktest}>
            <div>
              <label className="block mb-2 text-sm font-medium">Prediction Model</label>
              <select
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              >
                <option value="ensemble">Ensemble (Recommended)</option>
                <option value="random_forest">Random Forest</option>
                <option value="gradient_boosting">Gradient Boosting</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Number of Time Periods</label>
              <input
                type="number"
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                min="2"
                max="10"
                value={timePeriods}
                onChange={handleTimePeriodsChange}
              />
              <p className="mt-1 text-xs opacity-70">Number of time periods to use for backtesting (2-10)</p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Betting Strategy</label>
              <select
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={bettingStrategy}
                onChange={(e) => setBettingStrategy(e.target.value)}
              >
                <option value="value">Value Betting</option>
                <option value="favorite">Favorite</option>
                <option value="probability">Highest Probability</option>
              </select>
            </div>

            <div>
              <FileUpload
                label="Upload Dataset (CSV, Excel, or JSON)"
                helperText="Upload your historical race data for backtesting"
                onFileChange={handleFileChange}
                accept=".csv,.xlsx,.json,.tar"
                id="dataset-upload"
              />
              {selectedFile && (
                <p className="mt-2 text-sm text-green-400">
                  File ready: {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={loading}
            >
              {loading ? 'Running Backtest...' : 'Run Backtest'}
            </Button>
            
            {loading && <ProgressBar progress={progress} stage={processingStage} />}
            
            {error && (
              <div className="mt-4 p-3 bg-red-900/30 border border-red-500/30 rounded-md text-red-300">
                <p className="text-sm">{error}</p>
              </div>
            )}
          </form>
        </div>

        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Backtesting Information</h2>

          <div className="mb-6">
            <h3 className="font-bold mb-2">What is Backtesting?</h3>
            <p className="mb-4">
              Backtesting is the process of testing a predictive model on historical data to evaluate
              its performance. It helps assess how well the model would have performed in the past,
              which can indicate its potential future performance.
            </p>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Evaluation Metrics</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <div>
                  <span className="font-medium">Top-1 Accuracy</span>: Percentage of races where the predicted winner finished first
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <div>
                  <span className="font-medium">Top-3 Accuracy</span>: Percentage of races where the predicted winner finished in the top 3
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <div>
                  <span className="font-medium">Top-4 Accuracy</span>: Percentage of races where the predicted winner finished in the top 4
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <div>
                  <span className="font-medium">ROI</span>: Return on Investment from following the betting strategy
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <div>
                  <span className="font-medium">Probability Calibration</span>: How well predicted probabilities match actual outcomes
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg">
            <h3 className="font-bold mb-2 text-blue-300">Note</h3>
            <p className="text-sm">
              Backtesting uses synthetic data for demonstration purposes. In a production environment,
              it would use your historical race data.
            </p>
          </div>
        </div>
      </div>

      {/* Backend Settings Section */}
      <div className="bg-white/10 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Backend Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Computation Engine</label>
              <select
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={computationEngine}
                onChange={(e) => setComputationEngine(e.target.value)}
              >
                <option value="local">Local (CPU)</option>
                <option value="gpu">Local (GPU)</option>
                <option value="cloud">Cloud Computing</option>
              </select>
              <p className="mt-1 text-xs opacity-70">Select where computations will be performed</p>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Parallel Processing</label>
              <select
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={parallelProcessing}
                onChange={(e) => setParallelProcessing(e.target.value)}
              >
                <option value="1">Single Thread</option>
                <option value="2">2 Threads</option>
                <option value="4">4 Threads</option>
                <option value="8">8 Threads</option>
                <option value="max">Maximum Available</option>
              </select>
              <p className="mt-1 text-xs opacity-70">Number of parallel threads to use for computation</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Cache Settings</label>
              <select
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={cacheSettings}
                onChange={(e) => setCacheSettings(e.target.value)}
              >
                <option value="none">No Caching</option>
                <option value="memory">Memory Cache</option>
                <option value="disk">Disk Cache</option>
                <option value="both">Memory + Disk Cache</option>
              </select>
              <p className="mt-1 text-xs opacity-70">How to cache computation results</p>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Log Level</label>
              <select
                className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500 text-black"
                value={logLevel}
                onChange={(e) => setLogLevel(e.target.value)}
              >
                <option value="error">Error Only</option>
                <option value="warn">Warning</option>
                <option value="info">Information</option>
                <option value="debug">Debug</option>
                <option value="trace">Trace (Verbose)</option>
              </select>
              <p className="mt-1 text-xs opacity-70">Level of detail in computation logs</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700">Save Backend Settings</Button>
        </div>
      </div>

      {/* Results Section - Only shown when results are available */}
      {result && (
        <div className="bg-white/10 p-6 rounded-lg shadow-lg mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Backtest Results</h2>
            <div className="text-sm opacity-70">
              Computation Time: {result.computationTime}s
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-sm opacity-70 mb-1">Top-1 Accuracy</div>
              <div className="text-2xl font-bold">{result.summary.top1Accuracy}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-sm opacity-70 mb-1">Top-3 Accuracy</div>
              <div className="text-2xl font-bold">{result.summary.top3Accuracy}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-sm opacity-70 mb-1">Top-4 Accuracy</div>
              <div className="text-2xl font-bold">{result.summary.top4Accuracy}</div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg">
              <div className="text-sm opacity-70 mb-1">ROI</div>
              <div className={`text-2xl font-bold ${parseFloat(result.summary.roi) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {result.summary.roi}
              </div>
            </div>
          </div>
          
          <div className="mb-6">
            <h3 className="font-bold mb-3">Period Results</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left pb-2">Period</th>
                    <th className="text-left pb-2">Date</th>
                    <th className="text-left pb-2">Top-1 Accuracy</th>
                    <th className="text-left pb-2">Top-3 Accuracy</th>
                    <th className="text-left pb-2">Top-4 Accuracy</th>
                    <th className="text-left pb-2">ROI</th>
                  </tr>
                </thead>
                <tbody>
                  {result.periodResults.map((period, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-2">{period.period}</td>
                      <td className="py-2">{period.date}</td>
                      <td className="py-2">{period.top1Accuracy}%</td>
                      <td className="py-2">{period.top3Accuracy}%</td>
                      <td className="py-2">{period.top4Accuracy}%</td>
                      <td className={`py-2 ${parseFloat(period.roi) > 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {parseFloat(period.roi) > 0 ? '+' : ''}{period.roi}%
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 className="font-bold mb-3">Race Predictions</h3>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20">
                    <th className="text-left pb-2">Race</th>
                    <th className="text-left pb-2">Predicted Winner</th>
                    <th className="text-left pb-2">Predicted Odds</th>
                    <th className="text-left pb-2">Actual Winner</th>
                    <th className="text-left pb-2">Actual Odds</th>
                    <th className="text-left pb-2">Result</th>
                  </tr>
                </thead>
                <tbody>
                  {result.racePredictions.map((race, index) => (
                    <tr key={index} className="border-b border-white/10 hover:bg-white/5">
                      <td className="py-2">{race.race}</td>
                      <td className="py-2">{race.predictedWinner}</td>
                      <td className="py-2">${race.predictedOdds}</td>
                      <td className="py-2">{race.actualWinner}</td>
                      <td className="py-2">${race.actualOdds}</td>
                      <td className={`py-2 ${race.correct ? 'text-green-500' : 'text-red-500'}`}>
                        {race.correct ? 'Correct' : 'Incorrect'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white/10 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Backtests</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left pb-2">Date</th>
                <th className="text-left pb-2">Model</th>
                <th className="text-left pb-2">Periods</th>
                <th className="text-left pb-2">Top-1 Accuracy</th>
                <th className="text-left pb-2">ROI</th>
                <th className="text-left pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Mar 20, 2025</td>
                <td className="py-3">Ensemble</td>
                <td className="py-3">5</td>
                <td className="py-3">32.5%</td>
                <td className="py-3 text-green-500">+8.7%</td>
                <td className="py-3">
                  <Link href="/backtests/20250320">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Mar 19, 2025</td>
                <td className="py-3">Random Forest</td>
                <td className="py-3">4</td>
                <td className="py-3">28.3%</td>
                <td className="py-3 text-green-500">+5.2%</td>
                <td className="py-3">
                  <Link href="/backtests/20250319">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Mar 18, 2025</td>
                <td className="py-3">Gradient Boosting</td>
                <td className="py-3">6</td>
                <td className="py-3">30.1%</td>
                <td className="py-3 text-green-500">+7.5%</td>
                <td className="py-3">
                  <Link href="/backtests/20250318">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Mar 17, 2025</td>
                <td className="py-3">Ensemble</td>
                <td className="py-3">5</td>
                <td className="py-3">31.8%</td>
                <td className="py-3 text-green-500">+8.1%</td>
                <td className="py-3">
                  <Link href="/backtests/20250317">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Mar 16, 2025</td>
                <td className="py-3">Ensemble</td>
                <td className="py-3">3</td>
                <td className="py-3">33.2%</td>
                <td className="py-3 text-green-500">+9.3%</td>
                <td className="py-3">
                  <Link href="/backtests/20250316">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white/10 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Performance Comparison</h2>
        <div className="h-64 flex items-center justify-center">
          <p className="text-center opacity-70">
            [Performance comparison chart would be displayed here]
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Ensemble Model</h3>
            <div className="flex justify-between mb-1">
              <span>Top-1 Accuracy</span>
              <span>32.1%</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>ROI</span>
              <span className="text-green-500">+8.7%</span>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Random Forest</h3>
            <div className="flex justify-between mb-1">
              <span>Top-1 Accuracy</span>
              <span>28.5%</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>ROI</span>
              <span className="text-green-500">+5.3%</span>
            </div>
          </div>
          <div className="bg-white/5 p-4 rounded-lg">
            <h3 className="font-bold mb-2">Gradient Boosting</h3>
            <div className="flex justify-between mb-1">
              <span>Top-1 Accuracy</span>
              <span>30.2%</span>
            </div>
            <div className="flex justify-between mb-1">
              <span>ROI</span>
              <span className="text-green-500">+7.1%</span>
            </div>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-sm opacity-70">
          Australian Horse Racing Prediction System © 2025
        </p>
      </div>
    </main>
  )
}