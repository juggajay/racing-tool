import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function BacktestPage() {
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
          <form className="space-y-4">
            <div>
              <label className="block mb-2 text-sm font-medium">Prediction Model</label>
              <select className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="ensemble" selected>Ensemble (Recommended)</option>
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
                value="5"
              />
              <p className="mt-1 text-xs opacity-70">Number of time periods to use for backtesting (2-10)</p>
            </div>
            
            <div>
              <label className="block mb-2 text-sm font-medium">Betting Strategy</label>
              <select className="w-full px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="value" selected>Value Betting</option>
                <option value="favorite">Favorite</option>
                <option value="probability">Highest Probability</option>
              </select>
            </div>
            
            <Button className="w-full bg-blue-600 hover:bg-blue-700">Run Backtest</Button>
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
