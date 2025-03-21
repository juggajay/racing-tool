import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function RaceDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const raceId = params.id;
  
  return (
    <main className="flex min-h-screen flex-col p-6">
      {/* Rest of your component */}
    </main>
  )
}

    <main className="flex min-h-screen flex-col p-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <Link href="/races" className="text-sm text-blue-400 hover:text-blue-300 mb-2 inline-block">
            ← Back to Races
          </Link>
          <h1 className="text-3xl font-bold">Race {raceId} - Flemington</h1>
          <p className="text-lg opacity-70">March 21, 2025 | 1:40 PM | 1600m | Benchmark 78</p>
        </div>
        <div className="flex space-x-2">
          <Link href={`/predict?race=${raceId}`}>
            <Button className="bg-blue-600 hover:bg-blue-700">Predict This Race</Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Race Details</h2>
          <div className="space-y-2">
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
        
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Track Analysis</h2>
          <p className="mb-4">
            Flemington is a spacious, pear-shaped course with a long straight of 450m. 
            The track has wide, sweeping turns and a slight rise in the straight.
          </p>
          <h3 className="font-bold mt-4 mb-2">Bias Analysis</h3>
          <div className="space-y-2">
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
        
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-2">Pace Prediction</h2>
          <p className="mb-4">
            Expected to be a moderately run race with several horses likely to contest the lead.
          </p>
          <div className="h-40 flex items-center justify-center bg-white/5 rounded-lg mb-4">
            [Pace map visualization]
          </div>
          <h3 className="font-bold mt-4 mb-2">Pace Setters</h3>
          <ul className="space-y-1">
            <li>• Fast Thunder (Barrier 2)</li>
            <li>• Night Rider (Barrier 5)</li>
            <li>• Lucky Star (Barrier 8)</li>
          </ul>
        </div>
      </div>

      <div className="bg-white/10 p-6 rounded-lg shadow-lg mb-8">
        <h2 className="text-xl font-bold mb-4">Race Entries</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20">
                <th className="text-left pb-2">No.</th>
                <th className="text-left pb-2">Horse</th>
                <th className="text-left pb-2">Barrier</th>
                <th className="text-left pb-2">Weight</th>
                <th className="text-left pb-2">Jockey</th>
                <th className="text-left pb-2">Trainer</th>
                <th className="text-left pb-2">Last 5</th>
                <th className="text-left pb-2">Odds</th>
                <th className="text-left pb-2">Prediction</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">1</td>
                <td className="py-3 font-medium">Fast Thunder</td>
                <td className="py-3">2</td>
                <td className="py-3">58.5kg</td>
                <td className="py-3">J. Smith</td>
                <td className="py-3">T. Williams</td>
                <td className="py-3">1-3-2-1-4</td>
                <td className="py-3">$4.50</td>
                <td className="py-3 text-green-500">25.2%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">2</td>
                <td className="py-3 font-medium">Ocean Breeze</td>
                <td className="py-3">7</td>
                <td className="py-3">57.0kg</td>
                <td className="py-3">M. Johnson</td>
                <td className="py-3">S. Davis</td>
                <td className="py-3">2-1-5-3-2</td>
                <td className="py-3">$6.00</td>
                <td className="py-3 text-green-500">18.5%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">3</td>
                <td className="py-3 font-medium">Lucky Star</td>
                <td className="py-3">8</td>
                <td className="py-3">56.5kg</td>
                <td className="py-3">R. Thompson</td>
                <td className="py-3">J. Wilson</td>
                <td className="py-3">3-2-1-4-3</td>
                <td className="py-3">$5.50</td>
                <td className="py-3 text-green-500">20.8%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">4</td>
                <td className="py-3 font-medium">Night Rider</td>
                <td className="py-3">5</td>
                <td className="py-3">56.0kg</td>
                <td className="py-3">A. Brown</td>
                <td className="py-3">P. Miller</td>
                <td className="py-3">4-3-2-1-2</td>
                <td className="py-3">$7.00</td>
                <td className="py-3 text-green-500">16.3%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">5</td>
                <td className="py-3 font-medium">Desert Wind</td>
                <td className="py-3">1</td>
                <td className="py-3">55.5kg</td>
                <td className="py-3">C. Taylor</td>
                <td className="py-3">R. Anderson</td>
                <td className="py-3">5-4-3-2-1</td>
                <td className="py-3">$8.00</td>
                <td className="py-3 text-green-500">14.2%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">6</td>
                <td className="py-3 font-medium">Mountain Peak</td>
                <td className="py-3">10</td>
                <td className="py-3">54.5kg</td>
                <td className="py-3">L. White</td>
                <td className="py-3">G. Thomas</td>
                <td className="py-3">6-5-4-3-5</td>
                <td className="py-3">$12.00</td>
                <td className="py-3">9.5%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">7</td>
                <td className="py-3 font-medium">River Flow</td>
                <td className="py-3">3</td>
                <td className="py-3">54.0kg</td>
                <td className="py-3">D. Harris</td>
                <td className="py-3">K. Martin</td>
                <td className="py-3">7-6-5-4-6</td>
                <td className="py-3">$15.00</td>
                <td className="py-3">7.8%</td>
              </tr>
              <tr className="border-b border-white/10 hover:bg-white/5">
                <td className="py-3">8</td>
                <td className="py-3 font-medium">Golden Touch</td>
                <td className="py-3">4</td>
                <td className="py-3">53.5kg</td>
                <td className="py-3">E. Clark</td>
                <td className="py-3">B. Lewis</td>
                <td className="py-3">8-7-6-5-7</td>
                <td className="py-3">$20.00</td>
                <td className="py-3">5.8%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Value Betting Analysis</h2>
          <p className="mb-4">
            Based on our prediction model, the following horses represent value betting opportunities:
          </p>
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-lg border border-green-500/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Fast Thunder</span>
                <span className="text-green-500 font-bold">+13.4% Value</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Predicted: 25.2%</span>
                <span>Market: 22.2% ($4.50)</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-green-500/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Ocean Breeze</span>
                <span className="text-green-500 font-bold">+11.0% Value</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Predicted: 18.5%</span>
                <span>Market: 16.7% ($6.00)</span>
              </div>
            </div>
            <div className="bg-white/5 p-4 rounded-lg border border-green-500/30">
              <div className="flex justify-between items-center mb-2">
                <span className="font-bold">Night Rider</span>
                <span className="text-green-500 font-bold">+2.0% Value</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Predicted: 16.3%</span>
                <span>Market: 14.3% ($7.00)</span>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white/10 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">Race Prediction</h2>
          <div className="space-y-4">
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Predicted Finish</h3>
              <ol className="space-y-2">
                <li className="flex items-center">
                  <span className="bg-yellow-500 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">1</span>
                  <span>Fast Thunder (25.2%)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-gray-400 text-black font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">2</span>
                  <span>Lucky Star (20.8%)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-amber-700 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">3</span>
                  <span>Ocean Breeze (18.5%)</span>
                </li>
                <li className="flex items-center">
                  <span className="bg-white/20 text-white font-bold rounded-full w-6 h-6 flex items-center justify-center mr-2">4</span>
                  <span>Night Rider (16.3%)</span>
                </li>
              </ol>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Betting Recommendation</h3>
              <p className="mb-2">
                Based on our analysis, we recommend the following betting strategy:
              </p>
              <ul className="space-y-1">
                <li>• <strong>Win:</strong> Fast Thunder ($4.50)</li>
                <li>• <strong>Place:</strong> Ocean Breeze ($6.00)</li>
                <li>• <strong>Exacta:</strong> Fast Thunder / Lucky Star</li>
                <li>• <strong>Trifecta:</strong> Fast Thunder, Lucky Star, Ocean Breeze</li>
              </ul>
            </div>
            
            <div className="bg-white/5 p-4 rounded-lg">
              <h3 className="font-bold mb-2">Confidence Level</h3>
              <div className="w-full bg-white/10 rounded-full h-4 mb-2">
                <div className="bg-blue-600 h-4 rounded-full" style={{ width: '75%' }}></div>
              </div>
              <p className="text-sm text-center">75% - High Confidence</p>
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
