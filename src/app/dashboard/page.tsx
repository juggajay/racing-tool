import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function DashboardPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex space-x-2">
          <Link href="/predict">
            <Button className="bg-blue-600 hover:bg-blue-700">Make Predictions</Button>
          </Link>
          <Link href="/backtest">
            <Button variant="outline">Run Backtest</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Prediction Accuracy</h2>
          <div className="text-4xl font-bold mb-2">32.5%</div>
          <p className="text-sm opacity-70">Top-1 accuracy over last 30 days</p>
        </div>
        
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">ROI</h2>
          <div className="text-4xl font-bold mb-2 text-green-500">+8.7%</div>
          <p className="text-sm opacity-70">Return on investment using value betting</p>
        </div>
        
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Races Analyzed</h2>
          <div className="text-4xl font-bold mb-2">1,248</div>
          <p className="text-sm opacity-70">Total races analyzed in system</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Recent Predictions</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left pb-2">Race</th>
                  <th className="text-left pb-2">Date</th>
                  <th className="text-left pb-2">Prediction</th>
                  <th className="text-left pb-2">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-2">Flemington R3</td>
                  <td className="py-2">Mar 20, 2025</td>
                  <td className="py-2">Horse 5</td>
                  <td className="py-2 text-green-500">Win</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2">Randwick R6</td>
                  <td className="py-2">Mar 20, 2025</td>
                  <td className="py-2">Horse 2</td>
                  <td className="py-2 text-red-500">Loss</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2">Caulfield R4</td>
                  <td className="py-2">Mar 19, 2025</td>
                  <td className="py-2">Horse 8</td>
                  <td className="py-2 text-green-500">Win</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2">Moonee Valley R2</td>
                  <td className="py-2">Mar 19, 2025</td>
                  <td className="py-2">Horse 3</td>
                  <td className="py-2 text-red-500">Loss</td>
                </tr>
                <tr>
                  <td className="py-2">Rosehill R5</td>
                  <td className="py-2">Mar 18, 2025</td>
                  <td className="py-2">Horse 1</td>
                  <td className="py-2 text-green-500">Win</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link href="/predictions">
              <Button variant="link">View all predictions →</Button>
            </Link>
          </div>
        </div>
        
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Today's Value Bets</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left pb-2">Race</th>
                  <th className="text-left pb-2">Horse</th>
                  <th className="text-left pb-2">Odds</th>
                  <th className="text-left pb-2">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-2">Flemington R5</td>
                  <td className="py-2">Fast Thunder</td>
                  <td className="py-2">$8.50</td>
                  <td className="py-2 text-green-500">+32%</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2">Randwick R3</td>
                  <td className="py-2">Ocean Breeze</td>
                  <td className="py-2">$12.00</td>
                  <td className="py-2 text-green-500">+28%</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2">Caulfield R7</td>
                  <td className="py-2">Lucky Star</td>
                  <td className="py-2">$6.50</td>
                  <td className="py-2 text-green-500">+25%</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2">Moonee Valley R4</td>
                  <td className="py-2">Night Rider</td>
                  <td className="py-2">$9.00</td>
                  <td className="py-2 text-green-500">+22%</td>
                </tr>
                <tr>
                  <td className="py-2">Rosehill R2</td>
                  <td className="py-2">Desert Wind</td>
                  <td className="py-2">$7.50</td>
                  <td className="py-2 text-green-500">+18%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link href="/value-bets">
              <Button variant="link">View all value bets →</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white/10 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Performance Over Time</h2>
        <div className="h-64 flex items-center justify-center">
          <p className="text-center opacity-70">
            [Performance chart would be displayed here]
          </p>
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
