// Mock Punting Form API
// This file provides mock data when the real Punting Form API is not available

// Sample race data
const mockRaces = [
  {
    id: "race_1",
    race_number: 1,
    track_name: "Flemington",
    race_date: "2025-03-28",
    race_time: "12:30 PM",
    distance: 1200,
    race_class: "Group 3",
    prize_money: "$75,000",
    track_condition: "Good",
    weather: "Sunny, 22°C",
    entries: [
      { id: "horse_1", name: "Fast Thunder", barrier: 2, weight: "58.5kg", jockey: "J. Smith", trainer: "T. Williams", last_five: "1-3-2-1-4", odds: 4.5, prediction: 25.2 },
      { id: "horse_2", name: "Ocean Breeze", barrier: 7, weight: "57.0kg", jockey: "M. Johnson", trainer: "S. Davis", last_five: "2-1-5-3-2", odds: 6.0, prediction: 18.5 },
      { id: "horse_3", name: "Lucky Star", barrier: 8, weight: "56.5kg", jockey: "R. Thompson", trainer: "J. Wilson", last_five: "3-2-1-4-3", odds: 5.5, prediction: 20.8 },
      { id: "horse_4", name: "Night Rider", barrier: 5, weight: "56.0kg", jockey: "A. Brown", trainer: "P. Miller", last_five: "4-3-2-1-2", odds: 7.0, prediction: 16.3 },
      { id: "horse_5", name: "Desert Wind", barrier: 1, weight: "55.5kg", jockey: "C. Taylor", trainer: "R. Anderson", last_five: "5-4-3-2-1", odds: 8.0, prediction: 14.2 },
      { id: "horse_6", name: "Mountain Peak", barrier: 10, weight: "54.5kg", jockey: "L. White", trainer: "G. Thomas", last_five: "6-5-4-3-5", odds: 12.0, prediction: 9.5 },
      { id: "horse_7", name: "River Flow", barrier: 3, weight: "54.0kg", jockey: "D. Harris", trainer: "K. Martin", last_five: "7-6-5-4-6", odds: 15.0, prediction: 7.8 },
      { id: "horse_8", name: "Golden Touch", barrier: 4, weight: "53.5kg", jockey: "E. Clark", trainer: "B. Lewis", last_five: "8-7-6-5-7", odds: 20.0, prediction: 5.8 }
    ]
  },
  {
    id: "race_2",
    race_number: 2,
    track_name: "Flemington",
    race_date: "2025-03-28",
    race_time: "1:05 PM",
    distance: 1400,
    race_class: "Maiden",
    prize_money: "$50,000",
    track_condition: "Good",
    weather: "Sunny, 22°C",
    entries: [
      { id: "horse_9", name: "Silver Lining", barrier: 3, weight: "58.0kg", jockey: "P. Johnson", trainer: "M. Williams", last_five: "2-3-2-4-3", odds: 3.5, prediction: 28.5 },
      { id: "horse_10", name: "Midnight Run", barrier: 5, weight: "57.5kg", jockey: "T. Smith", trainer: "J. Davis", last_five: "3-4-2-3-2", odds: 4.0, prediction: 25.0 },
      { id: "horse_11", name: "Coastal Breeze", barrier: 1, weight: "57.0kg", jockey: "R. Brown", trainer: "S. Wilson", last_five: "4-3-5-2-4", odds: 6.0, prediction: 16.7 },
      { id: "horse_12", name: "Mountain Echo", barrier: 8, weight: "56.5kg", jockey: "J. Thompson", trainer: "T. Miller", last_five: "5-4-3-5-3", odds: 7.5, prediction: 13.3 },
      { id: "horse_13", name: "Valley Mist", barrier: 6, weight: "56.0kg", jockey: "M. Taylor", trainer: "P. Anderson", last_five: "4-5-4-3-5", odds: 9.0, prediction: 11.1 },
      { id: "horse_14", name: "Desert Storm", barrier: 2, weight: "55.5kg", jockey: "C. White", trainer: "R. Thomas", last_five: "5-6-4-5-4", odds: 10.0, prediction: 10.0 },
      { id: "horse_15", name: "Ocean Wave", barrier: 7, weight: "55.0kg", jockey: "L. Harris", trainer: "G. Martin", last_five: "6-5-6-4-6", odds: 15.0, prediction: 6.7 },
      { id: "horse_16", name: "Highland Dancer", barrier: 4, weight: "54.5kg", jockey: "D. Clark", trainer: "K. Lewis", last_five: "7-6-5-6-5", odds: 20.0, prediction: 5.0 }
    ]
  },
  {
    id: "race_3",
    race_number: 3,
    track_name: "Flemington",
    race_date: "2025-03-28",
    race_time: "1:40 PM",
    distance: 1600,
    race_class: "Benchmark 78",
    prize_money: "$65,000",
    track_condition: "Good",
    weather: "Sunny, 23°C",
    entries: [
      { id: "horse_17", name: "Royal Flush", barrier: 5, weight: "59.0kg", jockey: "J. Smith", trainer: "T. Williams", last_five: "1-2-1-3-1", odds: 2.8, prediction: 35.7 },
      { id: "horse_18", name: "Golden Mile", barrier: 3, weight: "58.5kg", jockey: "M. Johnson", trainer: "S. Davis", last_five: "2-1-3-1-2", odds: 3.2, prediction: 31.3 },
      { id: "horse_19", name: "Silver Streak", barrier: 7, weight: "57.5kg", jockey: "R. Thompson", trainer: "J. Wilson", last_five: "3-2-1-2-3", odds: 5.0, prediction: 20.0 },
      { id: "horse_20", name: "Midnight Star", barrier: 1, weight: "57.0kg", jockey: "A. Brown", trainer: "P. Miller", last_five: "1-3-4-2-1", odds: 5.5, prediction: 18.2 },
      { id: "horse_21", name: "Valley Runner", barrier: 8, weight: "56.5kg", jockey: "C. Taylor", trainer: "R. Anderson", last_five: "4-3-2-4-3", odds: 8.0, prediction: 12.5 },
      { id: "horse_22", name: "Mountain King", barrier: 2, weight: "56.0kg", jockey: "L. White", trainer: "G. Thomas", last_five: "3-4-5-3-4", odds: 10.0, prediction: 10.0 },
      { id: "horse_23", name: "Ocean Gem", barrier: 6, weight: "55.5kg", jockey: "D. Harris", trainer: "K. Martin", last_five: "5-4-3-5-4", odds: 12.0, prediction: 8.3 },
      { id: "horse_24", name: "Desert Prince", barrier: 4, weight: "55.0kg", jockey: "E. Clark", trainer: "B. Lewis", last_five: "4-5-6-4-5", odds: 15.0, prediction: 6.7 }
    ]
  },
  {
    id: "race_4",
    race_number: 1,
    track_name: "Randwick",
    race_date: "2025-03-28",
    race_time: "12:45 PM",
    distance: 1100,
    race_class: "2YO",
    prize_money: "$80,000",
    track_condition: "Good",
    weather: "Partly Cloudy, 24°C",
    entries: [
      { id: "horse_25", name: "Future Star", barrier: 4, weight: "57.0kg", jockey: "J. Smith", trainer: "T. Williams", last_five: "1-2", odds: 2.5, prediction: 40.0 },
      { id: "horse_26", name: "Young Talent", barrier: 6, weight: "57.0kg", jockey: "M. Johnson", trainer: "S. Davis", last_five: "2-1", odds: 3.0, prediction: 33.3 },
      { id: "horse_27", name: "New Hope", barrier: 2, weight: "57.0kg", jockey: "R. Thompson", trainer: "J. Wilson", last_five: "3", odds: 6.0, prediction: 16.7 },
      { id: "horse_28", name: "Rising Sun", barrier: 8, weight: "57.0kg", jockey: "A. Brown", trainer: "P. Miller", last_five: "4-3", odds: 8.0, prediction: 12.5 },
      { id: "horse_29", name: "Bright Future", barrier: 1, weight: "57.0kg", jockey: "C. Taylor", trainer: "R. Anderson", last_five: "2-4", odds: 10.0, prediction: 10.0 },
      { id: "horse_30", name: "Young Prince", barrier: 5, weight: "57.0kg", jockey: "L. White", trainer: "G. Thomas", last_five: "5-3", odds: 12.0, prediction: 8.3 },
      { id: "horse_31", name: "New Dawn", barrier: 3, weight: "57.0kg", jockey: "D. Harris", trainer: "K. Martin", last_five: "4-5", odds: 15.0, prediction: 6.7 },
      { id: "horse_32", name: "Rising Star", barrier: 7, weight: "57.0kg", jockey: "E. Clark", trainer: "B. Lewis", last_five: "6-4", odds: 20.0, prediction: 5.0 }
    ]
  },
  {
    id: "race_5",
    race_number: 2,
    track_name: "Randwick",
    race_date: "2025-03-28",
    race_time: "1:20 PM",
    distance: 1400,
    race_class: "Group 2",
    prize_money: "$200,000",
    track_condition: "Good",
    weather: "Partly Cloudy, 24°C",
    entries: [
      { id: "horse_33", name: "Champion's Way", barrier: 3, weight: "59.5kg", jockey: "J. Smith", trainer: "T. Williams", last_five: "1-1-2-1-3", odds: 2.2, prediction: 45.5 },
      { id: "horse_34", name: "Royal Command", barrier: 5, weight: "59.0kg", jockey: "M. Johnson", trainer: "S. Davis", last_five: "2-1-1-3-1", odds: 2.8, prediction: 35.7 },
      { id: "horse_35", name: "Elite Force", barrier: 1, weight: "58.5kg", jockey: "R. Thompson", trainer: "J. Wilson", last_five: "1-3-2-1-2", odds: 4.0, prediction: 25.0 },
      { id: "horse_36", name: "Master Class", barrier: 7, weight: "58.0kg", jockey: "A. Brown", trainer: "P. Miller", last_five: "3-2-3-2-1", odds: 5.0, prediction: 20.0 },
      { id: "horse_37", name: "Supreme Power", barrier: 2, weight: "57.5kg", jockey: "C. Taylor", trainer: "R. Anderson", last_five: "2-4-1-3-4", odds: 8.0, prediction: 12.5 },
      { id: "horse_38", name: "Noble Spirit", barrier: 8, weight: "57.0kg", jockey: "L. White", trainer: "G. Thomas", last_five: "4-3-4-2-3", odds: 10.0, prediction: 10.0 },
      { id: "horse_39", name: "Grand Design", barrier: 4, weight: "56.5kg", jockey: "D. Harris", trainer: "K. Martin", last_five: "3-5-3-4-5", odds: 15.0, prediction: 6.7 },
      { id: "horse_40", name: "Majestic Vision", barrier: 6, weight: "56.0kg", jockey: "E. Clark", trainer: "B. Lewis", last_five: "5-4-5-3-4", odds: 20.0, prediction: 5.0 }
    ]
  }
];

// Sample horse data
const mockHorses = {
  "horse_1": {
    id: "horse_1",
    name: "Fast Thunder",
    age: 5,
    sex: "Gelding",
    color: "Bay",
    sire: "Thunder Bolt",
    dam: "Fast Lady",
    trainer: "T. Williams",
    owner: "Thunder Racing Syndicate",
    career: {
      starts: 18,
      wins: 6,
      seconds: 4,
      thirds: 3,
      prize_money: "$320,000"
    },
    form: [
      { date: "2025-02-15", track: "Flemington", distance: 1200, position: 1, weight: "58.0kg", jockey: "J. Smith", margin: "0.5L", time: "1:09.45", track_condition: "Good" },
      { date: "2025-01-25", track: "Caulfield", distance: 1100, position: 3, weight: "58.5kg", jockey: "J. Smith", margin: "1.2L", time: "1:03.22", track_condition: "Good" },
      { date: "2025-01-01", track: "Flemington", distance: 1200, position: 2, weight: "58.0kg", jockey: "M. Johnson", margin: "0.2L", time: "1:09.78", track_condition: "Good" },
      { date: "2024-12-14", track: "Moonee Valley", distance: 1200, position: 1, weight: "57.5kg", jockey: "J. Smith", margin: "1.0L", time: "1:10.05", track_condition: "Good" },
      { date: "2024-11-30", track: "Sandown", distance: 1100, position: 4, weight: "58.0kg", jockey: "J. Smith", margin: "2.1L", time: "1:03.85", track_condition: "Soft" }
    ]
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const endpoint = searchParams.get('endpoint') || 'races'; // Default to races endpoint
    const date = searchParams.get('date');
    const track = searchParams.get('track');
    const raceNumber = searchParams.get('race_number');
    const horseId = searchParams.get('horse_id');
    
    // Simulate a slight delay to mimic a real API call
    await new Promise(resolve => setTimeout(resolve, 300));
    
    let responseData;
    
    if (endpoint === 'races') {
      if (horseId) {
        // Return a specific horse's data
        responseData = mockHorses[horseId] || { error: 'Horse not found' };
      } else if (raceNumber && track) {
        // Return a specific race
        const race = mockRaces.find(r => 
          r.track_name.toLowerCase() === track.toLowerCase() && 
          r.race_number.toString() === raceNumber.toString()
        );
        responseData = race || { error: 'Race not found' };
      } else if (track) {
        // Return races for a specific track
        const filteredRaces = mockRaces.filter(r => 
          r.track_name.toLowerCase() === track.toLowerCase()
        );
        responseData = filteredRaces.length > 0 ? filteredRaces : { error: 'No races found for this track' };
      } else if (date) {
        // Return races for a specific date
        const filteredRaces = mockRaces.filter(r => r.race_date === date);
        responseData = filteredRaces.length > 0 ? filteredRaces : { error: 'No races found for this date' };
      } else {
        // Return all races
        responseData = mockRaces;
      }
    } else if (endpoint === 'horses') {
      if (horseId) {
        // Return a specific horse's data
        responseData = mockHorses[horseId] || { error: 'Horse not found' };
      } else {
        // Return all horses
        responseData = Object.values(mockHorses);
      }
    } else {
      responseData = { error: 'Invalid endpoint' };
    }
    
    return Response.json({
      success: true,
      data: responseData,
      source: 'Mock Punting Form API',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Mock API error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}