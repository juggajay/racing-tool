'use client';

import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function PredictPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Make Predictions</h1>
        <div className="flex space-x-2">
          <Link href="/backtest">
            <Button variant="outline">Run Backtest</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Upload Race Data for Prediction</h2>
          <form className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Select a CSV file with race data</label>
              <input
                type="file"
                className="block w-full text-sm rounded-lg cursor-pointer bg-white/5 border border-white/20 focus:outline-none"
                accept=".csv"
              />
              <p className="mt-1 text-xs opacity-70">Upload a CSV file containing race entries to predict.</p>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Prediction Model</label>
              <select className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="ensemble" selected>Ensemble (Recommended)</option>
                <option value="random_forest">Random Forest</option>
                <option value="gradient_boosting">Gradient Boosting</option>
              </select>
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">Betting Strategy</label>
              <select className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="value" selected>Value Betting</option>
                <option value="favorite">Favorite</option>
                <option value="probability">Highest Probability</option>
              </select>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700">Generate Predictions</Button>
          </form>
        </div>

        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Prediction Options</h2>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Available Models</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <div>
                  <span className="font-medium">Ensemble</span>: Combines multiple models for optimal performance
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <div>
                  <span className="font-medium">Random Forest</span>: Good for handling non-linear relationships
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <div>
                  <span className="font-medium">Gradient Boosting</span>: High accuracy with proper tuning
                </div>
              </li>
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="font-bold mb-2">Betting Strategies</h3>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <div>
                  <span className="font-medium">Value Betting</span>: Identifies horses with odds higher than their true probability
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <div>
                  <span className="font-medium">Favorite</span>: Bets on the horse with the lowest odds in each race
                </div>
              </li>
              <li className="flex items-start">
                <span className="mr-2">•</span>
                <div>
                  <span className="font-medium">Highest Probability</span>: Bets on the horse with the highest predicted probability
                </div>
              </li>
            </ul>
          </div>

          <div className="bg-blue-900/30 border border-blue-500/30 p-4 rounded-lg">
            <h3 className="font-bold mb-2 text-blue-300">Pro Tip</h3>
            <p className="text-sm">
              For best results, ensure your data includes all required fields and follows the format guidelines.
              The Ensemble model with Value Betting strategy typically provides the highest ROI.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white/10 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Recent Predictions</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left pb-2">Date</th>
                <th className="text-left pb-2">Races</th>
                <th className="text-left pb-2">Model</th>
                <th className="text-left pb-2">Strategy</th>
                <th className="text-left pb-2">Accuracy</th>
                <th className="text-left pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Mar 20, 2025</td>
                <td className="py-3">5</td>
                <td className="py-3">Ensemble</td>
                <td className="py-3">Value Betting</td>
                <td className="py-3">35.2%</td>
                <td className="py-3">
                  <Link href="/predictions/20250320">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Mar 19, 2025</td>
                <td className="py-3">3</td>
                <td className="py-3">Random Forest</td>
                <td className="py-3">Value Betting</td>
                <td className="py-3">33.1%</td>
                <td className="py-3">
                  <Link href="/predictions/20250319">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Mar 18, 2025</td>
                <td className="py-3">7</td>
                <td className="py-3">Gradient Boosting</td>
                <td className="py-3">Highest Probability</td>
                <td className="py-3">29.8%</td>
                <td className="py-3">
                  <Link href="/predictions/20250318">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Mar 17, 2025</td>
                <td className="py-3">4</td>
                <td className="py-3">Ensemble</td>
                <td className="py-3">Favorite</td>
                <td className="py-3">31.5%</td>
                <td className="py-3">
                  <Link href="/predictions/20250317">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Mar 16, 2025</td>
                <td className="py-3">6</td>
                <td className="py-3">Ensemble</td>
                <td className="py-3">Value Betting</td>
                <td className="py-3">34.2%</td>
                <td className="py-3">
                  <Link href="/predictions/20250316">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white/10 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Data Format Guidelines</h2>
        <p className="mb-4">
          Your CSV file should include the following columns for each race entry:
        </p>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left pb-2">Column</th>
                <th className="text-left pb-2">Description</th>
                <th className="text-left pb-2">Example</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10">
                <td className="py-2 font-medium">race_id</td>
                <td className="py-2">Unique identifier for the race</td>
                <td className="py-2">1</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 font-medium">horse_id</td>
                <td className="py-2">Unique identifier for the horse</td>
                <td className="py-2">101</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 font-medium">jockey_id</td>
                <td className="py-2">Unique identifier for the jockey</td>
                <td className="py-2">201</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 font-medium">trainer_id</td>
                <td className="py-2">Unique identifier for the trainer</td>
                <td className="py-2">301</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 font-medium">barrier</td>
                <td className="py-2">Starting barrier number</td>
                <td className="py-2">5</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 font-medium">weight</td>
                <td className="py-2">Weight carried in kg</td>
                <td className="py-2">56.5</td>
              </tr>
              <tr className="border-b border-white/10">
                <td className="py-2 font-medium">odds</td>
                <td className="py-2">Starting odds (decimal)</td>
                <td className="py-2">8.5</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
          <h3 className="font-bold mb-2">Example CSV Format:</h3>
          <pre className="bg-black/30 p-3 rounded-lg overflow-x-auto text-sm">
            race_id,horse_id,jockey_id,trainer_id,barrier,weight,odds
            1,101,201,301,5,56.5,8.5
            1,102,202,302,8,55.0,4.0
            1,103,203,303,2,57.0,12.0
          </pre>
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