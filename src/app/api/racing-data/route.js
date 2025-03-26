// Racing Data API
// This API provides access to horse racing data using static mock data

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
      { id: "horse_3", name: "Lucky Star", barrier: 8, weight: "56.5kg", jockey: "R. Thompson", trainer: "J. Wilson", last_five: "3-2-1-4-3", odds: 5.5, prediction: 20.8 }
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
      { id: "horse_11", name: "Coastal Breeze", barrier: 1, weight: "57.0kg", jockey: "R. Brown", trainer: "S. Wilson", last_five: "4-3-5-2-4", odds: 6.0, prediction: 16.7 }
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
      { date: "2025-01-25", track: "Caulfield", distance: 1100, position: 3, weight: "58.5kg", jockey: "J. Smith", margin: "1.2L", time: "1:03.22", track_condition: "Good" }
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
    
    // Process the data based on the endpoint
    let processedData;
    
    if (endpoint === 'races') {
      if (horseId) {
        // Return a specific horse's data
        processedData = mockHorses[horseId] || { error: 'Horse not found' };
      } else if (raceNumber && track) {
        // Return a specific race
        const race = mockRaces.find(r =>
          r.track_name.toLowerCase() === track.toLowerCase() &&
          r.race_number.toString() === raceNumber.toString()
        );
        processedData = race || { error: 'Race not found' };
      } else if (track) {
        // Return races for a specific track
        const filteredRaces = mockRaces.filter(r =>
          r.track_name.toLowerCase() === track.toLowerCase()
        );
        processedData = filteredRaces.length > 0 ? filteredRaces : { error: 'No races found for this track' };
      } else if (date) {
        // Return races for a specific date
        const filteredRaces = mockRaces.filter(r => r.race_date === date);
        processedData = filteredRaces.length > 0 ? filteredRaces : { error: 'No races found for this date' };
      } else {
        // Return all races
        processedData = mockRaces;
      }
    } else if (endpoint === 'horses') {
      if (horseId) {
        // Return a specific horse's data
        processedData = mockHorses[horseId] || { error: 'Horse not found' };
      } else {
        // Return all horses
        processedData = Object.values(mockHorses);
      }
    } else {
      processedData = { error: 'Invalid endpoint' };
    }
    
    // Add additional metadata
    return Response.json({
      success: true,
      data: processedData,
      source: 'Racing Data API (Mock)',
      endpoint,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Racing Data API error:', error);
    
    return Response.json(
      {
        error: 'Internal server error',
        message: error.message,
        details: 'An unexpected error occurred while processing your request'
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    
    // Extract parameters from the request body
    const { action, date, track, raceNumber, horseId } = body;
    
    if (!action) {
      return Response.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }
    
    // Handle different actions
    if (action === 'getRaceWithEntries') {
      if (!track || !raceNumber) {
        return Response.json(
          { error: 'Track and race number are required' },
          { status: 400 }
        );
      }
      
      // Find the race in the mock data
      const race = mockRaces.find(r =>
        r.track_name.toLowerCase() === track.toLowerCase() &&
        r.race_number.toString() === raceNumber.toString()
      );
      
      if (!race) {
        return Response.json(
          { error: 'Race not found' },
          { status: 404 }
        );
      }
      
      return Response.json({
        success: true,
        data: race,
        source: 'Racing Data API (Static)',
        action,
        timestamp: new Date().toISOString()
      });
    }
    
    if (action === 'getHorseDetails') {
      if (!horseId) {
        return Response.json(
          { error: 'Horse ID is required' },
          { status: 400 }
        );
      }
      
      // Get horse data from the mock data
      const horse = mockHorses[horseId];
      
      if (!horse) {
        return Response.json(
          { error: 'Horse not found' },
          { status: 404 }
        );
      }
      
      return Response.json({
        success: true,
        data: horse,
        source: 'Racing Data API (Static)',
        action,
        timestamp: new Date().toISOString()
      });
    }
    
    if (action === 'getRacesByTrack') {
      if (!track) {
        return Response.json(
          { error: 'Track is required' },
          { status: 400 }
        );
      }
      
      // Filter races by track
      const filteredRaces = mockRaces.filter(r =>
        r.track_name.toLowerCase() === track.toLowerCase()
      );
      
      if (filteredRaces.length === 0) {
        return Response.json(
          { error: 'No races found for this track' },
          { status: 404 }
        );
      }
      
      return Response.json({
        success: true,
        data: filteredRaces,
        source: 'Racing Data API (Static)',
        action,
        timestamp: new Date().toISOString()
      });
    }
    
    if (action === 'getRacesByDate') {
      if (!date) {
        return Response.json(
          { error: 'Date is required' },
          { status: 400 }
        );
      }
      
      // Filter races by date
      const filteredRaces = mockRaces.filter(r => r.race_date === date);
      
      if (filteredRaces.length === 0) {
        return Response.json(
          { error: 'No races found for this date' },
          { status: 404 }
        );
      }
      
      return Response.json({
        success: true,
        data: filteredRaces,
        source: 'Racing Data API (Static)',
        action,
        timestamp: new Date().toISOString()
      });
    }
    
    // If we get here, the action was not recognized
    return Response.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Racing Data API error:', error);
    
    return Response.json(
      {
        error: 'Internal server error',
        message: error.message,
        details: 'An unexpected error occurred while processing your request'
      },
      { status: 500 }
    );
  }
}