'use client';

import { Button } from "@/components/ui/button"
import Link from "next/link"
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar
} from 'recharts';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Info } from "lucide-react";

// Sample data for charts
const performanceData = [
  { month: 'Jan', accuracy: 28, roi: 5.2 },
  { month: 'Feb', accuracy: 30, roi: 6.8 },
  { month: 'Mar', accuracy: 26, roi: 4.5 },
  { month: 'Apr', accuracy: 32, roi: 7.9 },
  { month: 'May', accuracy: 29, roi: 6.2 },
  { month: 'Jun', accuracy: 31, roi: 7.4 },
  { month: 'Jul', accuracy: 33, roi: 8.1 },
  { month: 'Aug', accuracy: 30, roi: 7.0 },
  { month: 'Sep', accuracy: 31, roi: 7.5 },
  { month: 'Oct', accuracy: 34, roi: 8.3 },
  { month: 'Nov', accuracy: 32, roi: 8.0 },
  { month: 'Dec', accuracy: 32.5, roi: 8.7 },
];

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState('30days');
  const [predictionFilter, setPredictionFilter] = useState('all');
  return (
    <main className="flex min-h-screen flex-col p-4 md:p-6 max-w-[1600px] mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 md:mb-8">
        <h1 className="text-2xl md:text-3xl font-bold">Dashboard</h1>
        <div className="flex flex-wrap w-full sm:w-auto gap-2">
          <Link href="/predict" className="w-full sm:w-auto">
            <Button className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto text-sm md:text-base">Make Predictions</Button>
          </Link>
          <Link href="/backtest" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto text-sm md:text-base">Run Backtest</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-bold mb-2">Prediction Accuracy</h2>
          <div className="text-3xl md:text-4xl font-bold mb-1 md:mb-2">32.5%</div>
          <p className="text-xs md:text-sm opacity-70">Top-1 accuracy over last 30 days</p>
        </div>

        <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-bold mb-2">ROI</h2>
          <div className="text-3xl md:text-4xl font-bold mb-1 md:mb-2 text-green-500">+8.7%</div>
          <p className="text-xs md:text-sm opacity-70">Return on investment using value betting</p>
        </div>

        <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-bold mb-2">Races Analyzed</h2>
          <div className="text-3xl md:text-4xl font-bold mb-1 md:mb-2">1,248</div>
          <p className="text-xs md:text-sm opacity-70">Total races analyzed in system</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6 md:mb-8">
        <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-3 md:mb-4">
            <h2 className="text-lg md:text-xl font-bold">Recent Predictions</h2>
            <div className="flex items-center gap-2">
              <Select value={predictionFilter} onValueChange={setPredictionFilter}>
                <SelectTrigger className="w-[100px] h-8 text-xs">
                  <SelectValue placeholder="Filter" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="wins">Wins</SelectItem>
                  <SelectItem value="losses">Losses</SelectItem>
                </SelectContent>
              </Select>
              <TooltipProvider>
                <UITooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <Info className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p className="max-w-xs text-xs">
                      Filter predictions to see only wins, losses, or all results.
                    </p>
                  </TooltipContent>
                </UITooltip>
              </TooltipProvider>
            </div>
          </div>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left pb-2 text-xs md:text-sm font-medium">Race</th>
                  <th className="text-left pb-2 text-xs md:text-sm font-medium">Date</th>
                  <th className="text-left pb-2 text-xs md:text-sm font-medium">Prediction</th>
                  <th className="text-left pb-2 text-xs md:text-sm font-medium">Result</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-2 text-xs md:text-sm">Flemington R3</td>
                  <td className="py-2 text-xs md:text-sm">Mar 20, 2025</td>
                  <td className="py-2 text-xs md:text-sm">Horse 5</td>
                  <td className="py-2 text-xs md:text-sm text-green-500">Win</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 text-xs md:text-sm">Randwick R6</td>
                  <td className="py-2 text-xs md:text-sm">Mar 20, 2025</td>
                  <td className="py-2 text-xs md:text-sm">Horse 2</td>
                  <td className="py-2 text-xs md:text-sm text-red-500">Loss</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 text-xs md:text-sm">Caulfield R4</td>
                  <td className="py-2 text-xs md:text-sm">Mar 19, 2025</td>
                  <td className="py-2 text-xs md:text-sm">Horse 8</td>
                  <td className="py-2 text-xs md:text-sm text-green-500">Win</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 text-xs md:text-sm">Moonee Valley R2</td>
                  <td className="py-2 text-xs md:text-sm">Mar 19, 2025</td>
                  <td className="py-2 text-xs md:text-sm">Horse 3</td>
                  <td className="py-2 text-xs md:text-sm text-red-500">Loss</td>
                </tr>
                <tr>
                  <td className="py-2 text-xs md:text-sm">Rosehill R5</td>
                  <td className="py-2 text-xs md:text-sm">Mar 18, 2025</td>
                  <td className="py-2 text-xs md:text-sm">Horse 1</td>
                  <td className="py-2 text-xs md:text-sm text-green-500">Win</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link href="/predictions">
              <Button variant="link" className="text-xs md:text-sm">View all predictions →</Button>
            </Link>
          </div>
        </div>

        <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg">
          <h2 className="text-lg md:text-xl font-bold mb-3 md:mb-4">Today's Value Bets</h2>
          <div className="overflow-x-auto -mx-4 px-4">
            <table className="w-full min-w-[500px]">
              <thead>
                <tr className="border-b border-white/20">
                  <th className="text-left pb-2 text-xs md:text-sm font-medium">Race</th>
                  <th className="text-left pb-2 text-xs md:text-sm font-medium">Horse</th>
                  <th className="text-left pb-2 text-xs md:text-sm font-medium">Odds</th>
                  <th className="text-left pb-2 text-xs md:text-sm font-medium">Value</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-white/10">
                  <td className="py-2 text-xs md:text-sm">Flemington R5</td>
                  <td className="py-2 text-xs md:text-sm">Fast Thunder</td>
                  <td className="py-2 text-xs md:text-sm">$8.50</td>
                  <td className="py-2 text-xs md:text-sm text-green-500">+32%</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 text-xs md:text-sm">Randwick R3</td>
                  <td className="py-2 text-xs md:text-sm">Ocean Breeze</td>
                  <td className="py-2 text-xs md:text-sm">$12.00</td>
                  <td className="py-2 text-xs md:text-sm text-green-500">+28%</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 text-xs md:text-sm">Caulfield R7</td>
                  <td className="py-2 text-xs md:text-sm">Lucky Star</td>
                  <td className="py-2 text-xs md:text-sm">$6.50</td>
                  <td className="py-2 text-xs md:text-sm text-green-500">+25%</td>
                </tr>
                <tr className="border-b border-white/10">
                  <td className="py-2 text-xs md:text-sm">Moonee Valley R4</td>
                  <td className="py-2 text-xs md:text-sm">Night Rider</td>
                  <td className="py-2 text-xs md:text-sm">$9.00</td>
                  <td className="py-2 text-xs md:text-sm text-green-500">+22%</td>
                </tr>
                <tr>
                  <td className="py-2 text-xs md:text-sm">Rosehill R2</td>
                  <td className="py-2 text-xs md:text-sm">Desert Wind</td>
                  <td className="py-2 text-xs md:text-sm">$7.50</td>
                  <td className="py-2 text-xs md:text-sm text-green-500">+18%</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4 text-right">
            <Link href="/value-bets">
              <Button variant="link" className="text-xs md:text-sm">View all value bets →</Button>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-white/10 p-4 md:p-6 rounded-lg shadow-lg mb-6 md:mb-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
          <h2 className="text-lg md:text-xl font-bold">Performance Over Time</h2>
          <div className="flex items-center gap-2">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="Time Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7days">7 Days</SelectItem>
                <SelectItem value="30days">30 Days</SelectItem>
                <SelectItem value="90days">90 Days</SelectItem>
                <SelectItem value="1year">1 Year</SelectItem>
                <SelectItem value="all">All Time</SelectItem>
              </SelectContent>
            </Select>
            <TooltipProvider>
              <UITooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Info className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="max-w-xs text-xs">
                    This chart shows your prediction accuracy and ROI over time.
                    Higher accuracy and ROI indicate better performance.
                  </p>
                </TooltipContent>
              </UITooltip>
            </TooltipProvider>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Prediction Accuracy Chart */}
          <div className="bg-white/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Prediction Accuracy</h3>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={performanceData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '4px',
                      color: 'white'
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="accuracy"
                    name="Accuracy (%)"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* ROI Chart */}
          <div className="bg-white/5 p-3 rounded-lg">
            <h3 className="text-sm font-medium mb-2">Return on Investment (ROI)</h3>
            <div className="h-48 md:h-64">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart
                  data={performanceData}
                  margin={{ top: 5, right: 20, left: 0, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis dataKey="month" stroke="rgba(255,255,255,0.5)" />
                  <YAxis stroke="rgba(255,255,255,0.5)" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'rgba(0,0,0,0.8)',
                      border: '1px solid rgba(255,255,255,0.2)',
                      borderRadius: '4px',
                      color: 'white'
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="roi"
                    name="ROI (%)"
                    stroke="#4ade80"
                    fill="#4ade80"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
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