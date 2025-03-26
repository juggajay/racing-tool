'use client';

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react";

export default function PredictPage() {
  const [activeTab, setActiveTab] = useState<'upload' | 'recent' | 'format'>('upload');

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Make Predictions</h1>
        <div className="w-full sm:w-auto">
          <Link href="/backtest" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto text-sm md:text-base">Run Backtest</Button>
          </Link>
        </div>
      </div>

      {/* Mobile Tabs - Only visible on mobile */}
      <div className="md:hidden mb-4">
        <div className="flex border-b border-white/20">
          <button 
            className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'upload' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('upload')}
          >
            Upload
          </button>
          <button 
            className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'recent' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('recent')}
          >
            Recent
          </button>
          <button 
            className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'format' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('format')}
          >
            Format
          </button>
        </div>
      </div>

      {/* Upload and Options Section */}
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8 ${activeTab !== 'upload' && 'hidden md:grid'}`}>
        <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Upload Race Data for Prediction</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-2 text-xs md:text-sm font-medium">Select a CSV file with race data</label>
              <input
                type="file"
                className="block w-full text-xs md:text-sm rounded-lg cursor-pointer bg-white/5 border border-white/20 focus:outline-none p-2"
                accept=".csv"
              />
              <p className="mt-1 text-xs opacity-70">Upload a CSV file containing race entries to predict.</p>
            </div>

            <div>
              <label className="block mb-2 text-xs md:text-sm font-medium">Prediction Model</label>
              <select className="w-full px-3 py-2 text-sm rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="ensemble" selected>Ensemble (Recommended)</option>
                <option value="random_forest">Random Forest</option>
                <option value="gradient_boosting">Gradient Boosting</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-xs md:text-sm font-medium">Betting Strategy</label>
              <select className="w-full px-3 py-2 text-sm rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="value" selected>Value Betting</option>
                <option value="favorite">Favorite</option>
                <option value="probability">Highest Probability</option>
              </select>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 text-sm md:text-base py-2">Generate Predictions</Button>
          </form>
        </div>

        <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Prediction Options</h2>

          <div className="mb-4 md:mb-6">
            <h3 className="font-bold mb-2 text-sm md:text-base">Available Models</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-xs md:text-sm">•</span>
                <div className="text-xs md:text-sm">
                  <span className="font-medium">Ensemble</span>: Combines multiple models for optimal performance
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xs md:text-sm">•</span>
                <div className="text-xs md:text-sm">
                  <span className="font-medium">Random Forest</span>: Good for handling non-linear relationships
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xs md:text-sm">•</span>
                <div className="text-xs md:text-sm">
                  <span className="font-medium">Gradient Boosting</span>: High accuracy with proper tuning
                </div>
              </li>
            </ul>
          </div>

          <div className="mb-4 md:mb-6">
            <h3 className="font-bold mb-2 text-sm md:text-base">Betting Strategies</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-xs md:text-sm">•</span>
                <div className="text-xs md:text-sm">
                  <span className="font-medium">Value Betting</span>: Identifies horses with odds higher than their true probability
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xs md:text-sm">•</span>
                <div className="text-xs md:text-sm">
                  <span className="font-medium">Favorite</span>: Bets on the horse with the lowest odds in each race
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-xs md:text-sm">•</span>
                <div className="text-xs md:text-sm">
                  <span className="font-medium">Highest Probability</span>: Bets on the horse with the highest predicted probability
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-900/30 border border-blue-500/30 p-3 md:p-4 rounded-lg">
            <h3 className="font-bold mb-1 md:mb-2 text-blue-300 text-xs md:text-sm">Pro Tip</h3>
            <p className="text-xs">
              For best results, ensure your data includes all required fields and follows the format guidelines.
              The Ensemble model with Value Betting strategy typically provides the highest ROI.
            </p>
          </div>
        </div>
      </div>

      {/* Recent Predictions Section */}
      <div className={`bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6 md:mb-8 ${activeTab !== 'recent' && 'hidden md:block'}`}>
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Recent Predictions</h2>
        
        {/* Mobile Cards - Only visible on small screens */}
        <div className="md:hidden space-y-3">
          {[
            { date: 'Mar 20, 2025', races: 5, model: 'Ensemble', strategy: 'Value Betting', accuracy: '35.2%', id: '20250320' },
            { date: 'Mar 19, 2025', races: 3, model: 'Random Forest', strategy: 'Value Betting', accuracy: '33.1%', id: '20250319' },
            { date: 'Mar 18, 2025', races: 7, model: 'Gradient Boosting', strategy: 'Highest Probability', accuracy: '29.8%', id: '20250318' },
            { date: 'Mar 17, 2025', races: 4, model: 'Ensemble', strategy: 'Favorite', accuracy: '31.5%', id: '20250317' },
            { date: 'Mar 16, 2025', races: 6, model: 'Ensemble', strategy: 'Value Betting', accuracy: '34.2%', id: '20250316' }
          ].map((prediction, index) => (
            <div key={index} className="bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="font-medium text-sm">{prediction.date}</div>
                  <div className="text-xs text-gray-400">
                    {prediction.races} races
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{prediction.accuracy}</div>
                  <div className="text-xs text-gray-400">Accuracy</div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                <div>
                  <span className="text-gray-400">Model:</span> {prediction.model}
                </div>
                <div>
                  <span className="text-gray-400">Strategy:</span> {prediction.strategy}
                </div>
              </div>
              <Link href={`/predictions/${prediction.id}`} className="block w-full">
                <Button variant="outline" size="sm" className="w-full text-xs">View Details</Button>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Desktop Table - Hidden on small screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left pb-2 text-sm font-medium">Date</th>
                <th className="text-left pb-2 text-sm font-medium">Races</th>
                <th className="text-left pb-2 text-sm font-medium">Model</th>
                <th className="text-left pb-2 text-sm font-medium">Strategy</th>
                <th className="text-left pb-2 text-sm font-medium">Accuracy</th>
                <th className="text-left pb-2 text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 text-sm">Mar 20, 2025</td>
                <td className="py-3 text-sm">5</td>
                <td className="py-3 text-sm">Ensemble</td>
                <td className="py-3 text-sm">Value Betting</td>
                <td className="py-3 text-sm">35.2%</td>
                <td className="py-3 text-sm">
                  <Link href="/predictions/20250320">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 text-sm">Mar 19, 2025</td>
                <td className="py-3 text-sm">3</td>
                <td className="py-3 text-sm">Random Forest</td>
                <td className="py-3 text-sm">Value Betting</td>
                <td className="py-3 text-sm">33.1%</td>
                <td className="py-3 text-sm">
                  <Link href="/predictions/20250319">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 text-sm">Mar 18, 2025</td>
                <td className="py-3 text-sm">7</td>
                <td className="py-3 text-sm">Gradient Boosting</td>
                <td className="py-3 text-sm">Highest Probability</td>
                <td className="py-3 text-sm">29.8%</td>
                <td className="py-3 text-sm">
                  <Link href="/predictions/20250318">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 text-sm">Mar 17, 2025</td>
                <td className="py-3 text-sm">4</td>
                <td className="py-3 text-sm">Ensemble</td>
                <td className="py-3 text-sm">Favorite</td>
                <td className="py-3 text-sm">31.5%</td>
                <td className="py-3 text-sm">
                  <Link href="/predictions/20250317">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 text-sm">Mar 16, 2025</td>
                <td className="py-3 text-sm">6</td>
                <td className="py-3 text-sm">Ensemble</td>
                <td className="py-3 text-sm">Value Betting</td>
                <td className="py-3 text-sm">34.2%</td>
                <td className="py-3 text-sm">
                  <Link href="/predictions/20250316">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Data Format Guidelines Section */}
      <div className={`bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6 md:mb-8 ${activeTab !== 'format' && 'hidden md:block'}`}>
        <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Data Format Guidelines</h2>
        <p className="mb-3 md:mb-4 text-xs md:text-sm">
          Your CSV file should include the following columns for each race entry:
        </p>

        {/* Mobile Format - Only visible on small screens */}
        <div className="md:hidden space-y-3">
          {[
            { column: 'race_id', description: 'Unique identifier for the race', example: '1' },
            { column: 'horse_id', description: 'Unique identifier for the horse', example: '101' },
            { column: 'jockey_id', description: 'Unique identifier for the jockey', example: '201' },
            { column: 'trainer_id', description: 'Unique identifier for the trainer', example: '301' },
            { column: 'barrier', description: 'Starting barrier number', example: '5' },
            { column: 'weight', description: 'Weight carried in kg', example: '56.5' },
            { column: 'odds', description: 'Starting odds (decimal)', example: '8.5' }
          ].map((item, index) => (
            <div key={index} className="bg-white/5 p-3 rounded-lg border border-white/10">
              <div className="font-medium text-sm mb-1">{item.column}</div>
              <div className="text-xs text-gray-300 mb-1">{item.description}</div>
              <div className="text-xs">
                <span className="text-gray-400">Example:</span> {item.example}
              </div>
            </div>
          ))}
        </div>

        {/* Desktop Table - Hidden on small screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left pb-2 text-sm font-medium">Column</th>
                <th className="text-left pb-2 text-sm font-medium">Description</th>
                <th className="text-left pb-2 text-sm font-medium">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="py-2 text-sm font-medium">race_id</td>
                <td className="py-2 text-sm">Unique identifier for the race</td>
                <td className="py-2 text-sm">1</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 text-sm font-medium">horse_id</td>
                <td className="py-2 text-sm">Unique identifier for the horse</td>
                <td className="py-2 text-sm">101</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 text-sm font-medium">jockey_id</td>
                <td className="py-2 text-sm">Unique identifier for the jockey</td>
                <td className="py-2 text-sm">201</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 text-sm font-medium">trainer_id</td>
                <td className="py-2 text-sm">Unique identifier for the trainer</td>
                <td className="py-2 text-sm">301</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 text-sm font-medium">barrier</td>
                <td className="py-2 text-sm">Starting barrier number</td>
                <td className="py-2 text-sm">5</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 text-sm font-medium">weight</td>
                <td className="py-2 text-sm">Weight carried in kg</td>
                <td className="py-2 text-sm">56.5</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 text-sm font-medium">odds</td>
                <td className="py-2 text-sm">Starting odds (decimal)</td>
                <td className="py-2 text-sm">8.5</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <h3 className="font-bold mb-2 text-sm">Example CSV Format:</h3>
          <div className="bg-black/30 p-2 md:p-3 rounded-lg overflow-x-auto text-xs md:text-sm">
            <pre className="whitespace-pre-wrap">
race_id,horse_id,jockey_id,trainer_id,barrier,weight,odds
1,101,201,301,5,56.5,8.5
1,102,202,302,8,55.0,4.0
1,103,203,303,2,57.0,12.0
            </pre>
          </div>
        </div>
      </div>

      <div className="text-center">
        <p className="text-xs md:text-sm opacity-70">
          Australian Horse Racing Prediction System © 2025
        </p>
      </div>
    </main>
  )
}