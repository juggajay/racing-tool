import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RacesPage() {
  return (
    <main className="flex min-h-screen flex-col p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Upcoming Races</h1>
        <div className="flex space-x-2">
          <Link href="/predict">
            <Button className="bg-blue-600 hover:bg-blue-700">Make Predictions</Button>
          </Link>
        </div>
      </div>

      <div className="bg-white/10 p-6 rounded-lg shadow-lg mb-8">
        <div className="flex flex-col md:flex-row justify-between mb-4">
          <div className="mb-4 md:mb-0">
            <input
              type="text"
              placeholder="Search races or tracks..."
              className="w-full md:w-64 px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex space-x-2">
            <select className="px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Tracks</option>
              <option value="flemington">Flemington</option>
              <option value="randwick">Randwick</option>
              <option value="caulfield">Caulfield</option>
              <option value="moonee-valley">Moonee Valley</option>
              <option value="rosehill">Rosehill</option>
            </select>
            <select className="px-4 py-2 rounded-md bg-white/5 border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">All Dates</option>
              <option value="today">Today</option>
              <option value="tomorrow">Tomorrow</option>
              <option value="this-week">This Week</option>
              <option value="next-week">Next Week</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left pb-2">Race</th>
                <th className="text-left pb-2">Track</th>
                <th className="text-left pb-2">Date</th>
                <th className="text-left pb-2">Time</th>
                <th className="text-left pb-2">Distance</th>
                <th className="text-left pb-2">Class</th>
                <th className="text-left pb-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Race 1</td>
                <td className="py-3">Flemington</td>
                <td className="py-3">Mar 21, 2025</td>
                <td className="py-3">12:30 PM</td>
                <td className="py-3">1200m</td>
                <td className="py-3">Group 3</td>
                <td className="py-3">
                  <Link href="/races/1">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Race 2</td>
                <td className="py-3">Flemington</td>
                <td className="py-3">Mar 21, 2025</td>
                <td className="py-3">1:05 PM</td>
                <td className="py-3">1400m</td>
                <td className="py-3">Maiden</td>
                <td className="py-3">
                  <Link href="/races/2">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Race 3</td>
                <td className="py-3">Flemington</td>
                <td className="py-3">Mar 21, 2025</td>
                <td className="py-3">1:40 PM</td>
                <td className="py-3">1600m</td>
                <td className="py-3">Benchmark 78</td>
                <td className="py-3">
                  <Link href="/races/3">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Race 1</td>
                <td className="py-3">Randwick</td>
                <td className="py-3">Mar 21, 2025</td>
                <td className="py-3">12:45 PM</td>
                <td className="py-3">1100m</td>
                <td className="py-3">2YO</td>
                <td className="py-3">
                  <Link href="/races/4">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Race 2</td>
                <td className="py-3">Randwick</td>
                <td className="py-3">Mar 21, 2025</td>
                <td className="py-3">1:20 PM</td>
                <td className="py-3">1400m</td>
                <td className="py-3">Group 2</td>
                <td className="py-3">
                  <Link href="/races/5">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Race 1</td>
                <td className="py-3">Caulfield</td>
                <td className="py-3">Mar 22, 2025</td>
                <td className="py-3">12:15 PM</td>
                <td className="py-3">1000m</td>
                <td className="py-3">Handicap</td>
                <td className="py-3">
                  <Link href="/races/6">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Race 2</td>
                <td className="py-3">Caulfield</td>
                <td className="py-3">Mar 22, 2025</td>
                <td className="py-3">12:50 PM</td>
                <td className="py-3">1200m</td>
                <td className="py-3">Listed</td>
                <td className="py-3">
                  <Link href="/races/7">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">Race 3</td>
                <td className="py-3">Caulfield</td>
                <td className="py-3">Mar 22, 2025</td>
                <td className="py-3">1:25 PM</td>
                <td className="py-3">1400m</td>
                <td className="py-3">Open</td>
                <td className="py-3">
                  <Link href="/races/8">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <div>
            <span className="text-sm opacity-70">Showing 1-8 of 24 races</span>
          </div>
          <div className="flex space-x-2">
            <Button variant="outline" size="sm" disabled>Previous</Button>
            <Button variant="outline" size="sm">Next</Button>
          </div>
        </div>
      </div>

      <div className="bg-white/10 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Featured Races</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-bold mb-2">Melbourne Cup</h3>
            <p className="text-sm mb-2">Flemington | Nov 4, 2025</p>
            <p className="text-sm mb-4">3200m | Group 1</p>
            <Link href="/races/melbourne-cup">
              <Button variant="outline" size="sm" className="w-full">View Details</Button>
            </Link>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-bold mb-2">Cox Plate</h3>
            <p className="text-sm mb-2">Moonee Valley | Oct 25, 2025</p>
            <p className="text-sm mb-4">2040m | Group 1</p>
            <Link href="/races/cox-plate">
              <Button variant="outline" size="sm" className="w-full">View Details</Button>
            </Link>
          </div>
          <div className="bg-white/5 p-4 rounded-lg border border-white/10">
            <h3 className="font-bold mb-2">Golden Slipper</h3>
            <p className="text-sm mb-2">Rosehill | Mar 22, 2025</p>
            <p className="text-sm mb-4">1200m | Group 1</p>
            <Link href="/races/golden-slipper">
              <Button variant="outline" size="sm" className="w-full">View Details</Button>
            </Link>
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
