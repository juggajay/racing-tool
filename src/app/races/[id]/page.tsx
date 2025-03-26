'use client';

import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useState } from "react";

export default function RaceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const raceId = params.id;
  const [activeTab, setActiveTab] = useState<'entries' | 'value' | 'prediction'>('entries');

  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6">
      {/* Header Section - Responsive */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <div>
          <Link href="/races" className="text-xs md:text-sm text-blue-400 hover:text-blue-300 mb-1 md:mb-2 inline-block">
            ← Back to Races
          </Link>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-bold">Race {raceId} - Flemington</h1>
          <p className="text-sm md:text-lg opacity-70">March 21, 2025 | 1:40 PM | 1600m | Benchmark 78</p>
        </div>
        <div className="w-full sm:w-auto">
          <Link href={`/predict?race=${raceId}`} className="w-full sm:w-auto">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm md:text-base">Predict This Race</Button>
          </Link>
        </div>
      </div>

      {/* Race Info Cards - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-bold mb-2">Race Details</h2>
          <div className="space-y-2 text-sm md:text-base">
            <div className="flex justify-between">
              <span className="opacity-70">Track:</span>
              <span className="font-medium">Flemington</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Date:</span>
              <span className="font-medium">March 21, 2025</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Time:</span>
              <span className="font-medium">1:40 PM</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Distance:</span>
              <span className="font-medium">1600m</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Class:</span>
              <span className="font-medium">Benchmark 78</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Prize Money:</span>
              <span className="font-medium">$75,000</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Track Condition:</span>
              <span className="font-medium">Good</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Weather:</span>
              <span className="font-medium">Sunny, 22°C</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-bold mb-2">Track Analysis</h2>
          <p className="mb-4 text-sm md:text-base">
            Flemington is a spacious, pear-shaped course with a long straight of 450m.
            The track has wide, sweeping turns and a slight rise in the straight.
          </p>
          <h3 className="font-bold mt-3 md:mt-4 mb-2 text-sm md:text-base">Bias Analysis</h3>
          <div className="space-y-2 text-sm md:text-base">
            <div className="flex justify-between">
              <span className="opacity-70">Barrier Advantage:</span>
              <span className="font-medium">Middle barriers (4-8)</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Running Style:</span>
              <span className="font-medium">On-pace advantage</span>
            </div>
            <div className="flex justify-between">
              <span className="opacity-70">Recent Trend:</span>
              <span className="font-medium">Slight inside bias</span>
            </div>
          </div>
        </div>

        <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-bold mb-2">Pace Prediction</h2>
          <p className="mb-4 text-sm md:text-base">
            Expected to be a moderately run race with several horses likely to contest the lead.
          </p>
          <div className="h-32 md:h-40 flex items-center justify-center bg-white/5 rounded-lg mb-3 md:mb-4">
            [Pace map visualization]
          </div>
          <h3 className="font-bold mt-3 md:mt-4 mb-2 text-sm md:text-base">Pace Setters</h3>
          <ul className="space-y-1 text-sm md:text-base">
            <li>• Fast Thunder (Barrier 2)</li>
            <li>• Night Rider (Barrier 5)</li>
            <li>• Lucky Star (Barrier 8)</li>
          </ul>
        </div>
      </div>

      {/* Mobile Tabs - Only visible on mobile */}
      <div className="md:hidden mb-4">
        <div className="flex border-b border-white/20">
          <button 
            className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'entries' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('entries')}
          >
            Race Entries
          </button>
          <button 
            className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'value' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('value')}
          >
            Value Betting
          </button>
          <button 
            className={`flex-1 py-2 text-center text-sm font-medium ${activeTab === 'prediction' ? 'text-blue-400 border-b-2 border-blue-400' : 'text-gray-400'}`}
            onClick={() => setActiveTab('prediction')}
          >
            Prediction
          </button>
        </div>
      </div>

      {/* Race Entries - Responsive Table */}
      <div className={`bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6 md:mb-8 ${activeTab !== 'entries' && 'hidden md:block'}`}>
        <h2 className="text-lg md:text-xl font-bold mb-4">Race Entries</h2>
        
        {/* Mobile Cards - Only visible on small screens */}
        <div className="md:hidden space-y-4">
          {[...Array(8)].map((_, index) => {
            const horses = ["Fast Thunder", "Ocean Breeze", "Lucky Star", "Night Rider", "Desert Wind", "Mountain Peak", "River Flow", "Golden Touch"];
            const barriers = [2, 7, 8, 5, 1, 10, 3, 4];
            const weights = ["58.5kg", "57.0kg", "56.5kg", "56.0kg", "55.5kg", "54.5kg", "54.0kg", "53.5kg"];
            const jockeys = ["J. Smith", "M. Johnson", "R. Thompson", "A. Brown", "C. Taylor", "L. White", "D. Harris", "E. Clark"];
            const trainers = ["T. Williams", "S. Davis", "J. Wilson", "P. Miller", "R. Anderson", "G. Thomas", "K. Martin", "B. Lewis"];
            const lastFive = ["1-3-2-1-4", "2-1-5-3-2", "3-2-1-4-3", "4-3-2-1-2", "5-4-3-2-1", "6-5-4-3-5", "7-6-5-4-6", "8-7-6-5-7"];
            const odds = ["$4.50", "$6.00", "$5.50", "$7.00", "$8.00", "$12.00", "$15.00", "$20.00"];
            const predictions = ["25.2%", "18.5%", "20.8%", "16.3%", "14.2%", "9.5%", "7.8%", "5.8%"];
            const isValueBet = index < 5;

            return (
              <div key={index} className="bg-white/5 p-3 rounded-lg border border-white/10">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="bg-white/10 text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">{index + 1}</span>
                      <span className="font-medium">{horses[index]}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      Barrier: {barriers[index]} | Weight: {weights[index]}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm">{odds[index]}</div>
                    <div className={`text-xs ${isValueBet ? 'text-green-500' : ''}`}>{predictions[index]}</div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Jockey:</span> {jockeys[index]}
                  </div>
                  <div>
                    <span className="text-gray-400">Trainer:</span> {trainers[index]}
                  </div>
                  <div>
                    <span className="text-gray-400">Last 5:</span> {lastFive[index]}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Desktop Table - Hidden on small screens */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left pb-2 text-sm font-medium">No.</th>
                <th className="text-left pb-2 text-sm font-medium">Horse</th>
                <th className="text-left pb-2 text-sm font-medium">Barrier</th>
                <th className="text-left pb-2 text-sm font-medium">Weight</th>
                <th className="text-left pb-2 text-sm font-medium">Jockey</th>
                <th className="text-left pb-2 text-sm font-medium">Trainer</th>
                <th className="text-left pb-2 text-sm font-medium">Last 5</th>
                <th className="text-left pb-2 text-sm font-medium">Odds</th>
                <th className="text-left pb-2 text-sm font-medium">Prediction</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 text-sm">1</td>
                <td className="py-3 text-sm font-medium">Fast Thunder</td>
                <td className="py-3 text-sm">2</td>
                <td className="py-3 text-sm">58.5kg</td>
                <td className="py-3 text-sm">J. Smith</td>
                <td className="py-3 text-sm">T. Williams</td>
                <td className="py-3 text-sm">1-3-2-1-4</td>
                <td className="py-3 text-sm">$4.50</td>
                <td className="py-3 text-sm text-green-500">25.2%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 text-sm">2</td>
                <td className="py-3 text-sm font-medium">Ocean Breeze</td>
                <td className="py-3 text-sm">7</td>
                <td className="py-3 text-sm">57.0kg</td>
                <td className="py-3 text-sm">M. Johnson</td>
                <td className="py-3 text-sm">S. Davis</td>
                <td className="py-3 text-sm">2-1-5-3-2</td>
                <td className="py-3 text-sm">$6.00</td>
                <td className="py-3 text-sm text-green-500">18.5%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 text-sm">3</td>
                <td className="py-3 text-sm font-medium">Lucky Star</td>
                <td className="py-3 text-sm">8</td>
                <td className="py-3 text-sm">56.5kg</td>
                <td className="py-3 text-sm">R. Thompson</td>
                <td className="py-3 text-sm">J. Wilson</td>
                <td className="py-3 text-sm">3-2-1-4-3</td>
                <td className="py-3 text-sm">$5.50</td>
                <td className="py-3 text-sm text-green-500">20.8%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 text-sm">4</td>
                <td className="py-3 text-sm font-medium">Night Rider</td>
                <td className="py-3 text-sm">5</td>
                <td className="py-3 text-sm">56.0kg</td>
                <td className="py-3 text-sm">A. Brown</td>
                <td className="py-3 text-sm">P. Miller</td>
                <td className="py-3 text-sm">4-3-2-1-2</td>
                <td className="py-3 text-sm">$7.00</td>
                <td className="py-3 text-sm text-green-500">16.3%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 text-sm">5</td>
                <td className="py-3 text-sm font-medium">Desert Wind</td>
                <td className="py-3 text-sm">1</td>
                <td className="py-3 text-sm">55.5kg</td>
                <td className="py-3 text-sm">C. Taylor</td>
                <td className="py-3 text-sm">R. Anderson</td>
                <td className="py-3 text-sm">5-4-3-2-1</td>
                <td className="py-3 text-sm">$8.00</td>
                <td className="py-3 text-sm text-green-500">14.2%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 text-sm">6</td>
                <td className="py-3 text-sm font-medium">Mountain Peak</td>
                <td className="py-3 text-sm">10</td>
                <td className="py-3 text-sm">54.5kg</td>
                <td className="py-3 text-sm">L. White</td>
                <td className="py-3 text-sm">G. Thomas</td>
                <td className="py-3 text-sm">6-5-4-3-5</td>
                <td className="py-3 text-sm">$12.00</td>
                <td className="py-3 text-sm">9.5%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 text-sm">7</td>
                <td className="py-3 text-sm font-medium">River Flow</td>
                <td className="py-3 text-sm">3</td>
                <td className="py-3 text-sm">54.0kg</td>
                <td className="py-3 text-sm">D. Harris</td>
                <td className="py-3 text-sm">K. Martin</td>
                <td className="py-3 text-sm">7-6-5-4-6</td>
                <td className="py-3 text-sm">$15.00</td>
                <td className="py-3 text-sm">7.8%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3 text-sm">8</td>
                <td className="py-3 text-sm font-medium">Golden Touch</td>
                <td className="py-3 text-sm">4</td>
                <td className="py-3 text-sm">53.5kg</td>
                <td className="py-3 text-sm">E. Clark</td>
                <td className="py-3 text-sm">B. Lewis</td>
                <td className="py-3 text-sm">8-7-6-5-7</td>
                <td className="py-3 text-sm">$20.00</td>
                <td className="py-3 text-sm">5.8%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Value Betting and Race Prediction - Responsive Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:mb-8">
        {/* Value Betting Analysis */}
        <div className={`bg-white/10 p-4 md:p-6 rounded-lg shadow-lg ${activeTab !== 'value' && 'hidden md:block'}`}>
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Value Betting Analysis</h2>
          <p className="mb-3 md:mb-4 text-sm md:text-base">
            Based on our prediction model, the following horses represent value betting opportunities:
          </p>
          <div className="space-y-3 md:space-y-4">
            <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-green-500/30">
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <span className="font-bold text-sm md:text-base">Fast Thunder</span>
                <span className="text-green-500 font-bold text-sm md:text-base">+13.4% Value</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>Predicted: 25.2%</span>
                <span>Market: 22.2% ($4.50)</span>
              </div>
            </div>
            <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-green-500/30">
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <span className="font-bold text-sm md:text-base">Ocean Breeze</span>
                <span className="text-green-500 font-bold text-sm md:text-base">+11.0% Value</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>Predicted: 18.5%</span>
                <span>Market: 16.7% ($6.00)</span>
              </div>
            </div>
            <div className="bg-white/5 p-3 md:p-4 rounded-lg border border-green-500/30">
              <div className="flex justify-between items-center mb-1 md:mb-2">
                <span className="font-bold text-sm md:text-base">Night Rider</span>
                <span className="text-green-500 font-bold text-sm md:text-base">+2.0% Value</span>
              </div>
              <div className="flex justify-between text-xs md:text-sm">
                <span>Predicted: 16.3%</span>
                <span>Market: 14.3% ($7.00)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Race Prediction */}
        <div className={`bg-white/10 p-4 md:p-6 rounded-lg shadow-lg ${activeTab !== 'prediction' && 'hidden md:block'}`}>
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Race Prediction</h2>
          <div className="space-y-3 md:space-y-4">
            <div className="bg-white/5 p-3 md:p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-sm md:text-base">Predicted Finish</h3>
              <ol className="space-y-2">
                <li className="flex items-center">
                  <span className="bg-yellow-500 text-black font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center mr-2 text-xs md:text-sm">1</span>
                  <span className="text-sm md:text-base">Fast Thunder (25.2%)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-gray-400 text-black font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center mr-2 text-xs md:text-sm">2</span>
                  <span className="text-sm md:text-base">Lucky Star (20.8%)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-amber-700 text-white font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center mr-2 text-xs md:text-sm">3</span>
                  <span className="text-sm md:text-base">Ocean Breeze (18.5%)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-white/20 text-white font-bold rounded-full w-5 h-5 md:w-6 md:h-6 flex items-center justify-center mr-2 text-xs md:text-sm">4</span>
                  <span className="text-sm md:text-base">Night Rider (16.3%)</span>
                </li>
              </ol>
            </div>

            <div className="bg-white/5 p-3 md:p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-sm md:text-base">Betting Recommendation</h3>
              <p className="mb-2 text-xs md:text-sm">
                Based on our analysis, we recommend the following betting strategy:
              </p>
              <ul className="space-y-1 text-xs md:text-sm">
                <li>• <strong>Win:</strong> Fast Thunder ($4.50)</li>
                <li>• <strong>Place:</strong> Ocean Breeze ($6.00)</li>
                <li>• <strong>Exacta:</strong> Fast Thunder / Lucky Star</li>
                <li>• <strong>Trifecta:</strong> Fast Thunder, Lucky Star, Ocean Breeze</li>
              </ul>
            </div>

            <div className="bg-white/5 p-3 md:p-4 rounded-lg">
              <h3 className="font-bold mb-2 text-sm md:text-base">Confidence Level</h3>
              <div className="w-full bg-white/10 rounded-full h-3 md:h-4 mb-2">
                <div className="bg-blue-600 h-3 md:h-4 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-xs md:text-sm text-center">75% - High Confidence</p>
            </div>
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