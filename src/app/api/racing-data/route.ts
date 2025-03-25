import { NextRequest, NextResponse } from 'next/server';

// Mock data for demonstration purposes
// In a real application, you would fetch this data from an external API
const races = [
  {
    id: 1,
    name: 'Melbourne Cup',
    location: 'Flemington Racecourse',
    date: '2025-11-04T03:00:00.000Z',
    distance: 3200,
    grade: 'Group 1',
    prize_money: 8000000,
    status: 'scheduled',
    horses: [
      { id: 101, name: 'Northern Star', jockey: 'James McDonald', trainer: 'Chris Waller', odds: 6.5, barrier: 3 },
      { id: 102, name: 'Swift Thunder', jockey: 'Hugh Bowman', trainer: 'Gai Waterhouse', odds: 8.0, barrier: 7 },
      { id: 103, name: 'Midnight Runner', jockey: 'Damien Oliver', trainer: 'James Cummings', odds: 10.0, barrier: 12 },
      { id: 104, name: 'Golden Horizon', jockey: 'Craig Williams', trainer: 'Danny O\'Brien', odds: 12.0, barrier: 5 },
      { id: 105, name: 'Silver Streak', jockey: 'Kerrin McEvoy', trainer: 'Anthony Freedman', odds: 15.0, barrier: 9 },
    ]
  },
  {
    id: 2,
    name: 'Cox Plate',
    location: 'Moonee Valley Racecourse',
    date: '2025-10-25T04:00:00.000Z',
    distance: 2040,
    grade: 'Group 1',
    prize_money: 5000000,
    status: 'scheduled',
    horses: [
      { id: 201, name: 'Mountain King', jockey: 'Damien Oliver', trainer: 'Chris Waller', odds: 4.5, barrier: 1 },
      { id: 202, name: 'Ocean Breeze', jockey: 'James McDonald', trainer: 'James Cummings', odds: 5.0, barrier: 8 },
      { id: 203, name: 'Desert Storm', jockey: 'Hugh Bowman', trainer: 'Ciaron Maher', odds: 7.0, barrier: 4 },
      { id: 204, name: 'Valley Mist', jockey: 'Craig Williams', trainer: 'Gai Waterhouse', odds: 9.0, barrier: 6 },
      { id: 205, name: 'Thunder Cloud', jockey: 'Kerrin McEvoy', trainer: 'Anthony Freedman', odds: 11.0, barrier: 2 },
    ]
  },
  {
    id: 3,
    name: 'Caulfield Cup',
    location: 'Caulfield Racecourse',
    date: '2025-10-18T05:00:00.000Z',
    distance: 2400,
    grade: 'Group 1',
    prize_money: 5000000,
    status: 'scheduled',
    horses: [
      { id: 301, name: 'Royal Flush', jockey: 'Hugh Bowman', trainer: 'Chris Waller', odds: 7.0, barrier: 5 },
      { id: 302, name: 'Lucky Charm', jockey: 'James McDonald', trainer: 'Gai Waterhouse', odds: 8.5, barrier: 2 },
      { id: 303, name: 'Victory Lane', jockey: 'Damien Oliver', trainer: 'James Cummings', odds: 9.0, barrier: 10 },
      { id: 304, name: 'Champion Spirit', jockey: 'Craig Williams', trainer: 'Ciaron Maher', odds: 10.0, barrier: 7 },
      { id: 305, name: 'Winning Edge', jockey: 'Kerrin McEvoy', trainer: 'Anthony Freedman', odds: 12.0, barrier: 4 },
    ]
  }
];

// Get all races or filter by query parameters
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const id = searchParams.get('id');
    const location = searchParams.get('location');
    const status = searchParams.get('status');
    const fromDate = searchParams.get('from_date');
    const toDate = searchParams.get('to_date');
    
    // Filter races based on query parameters
    let filteredRaces = [...races];
    
    if (id) {
      const raceId = parseInt(id);
      filteredRaces = filteredRaces.filter(race => race.id === raceId);
    }
    
    if (location) {
      filteredRaces = filteredRaces.filter(race => 
        race.location.toLowerCase().includes(location.toLowerCase())
      );
    }
    
    if (status) {
      filteredRaces = filteredRaces.filter(race => race.status === status);
    }
    
    if (fromDate) {
      const fromDateObj = new Date(fromDate);
      filteredRaces = filteredRaces.filter(race => new Date(race.date) >= fromDateObj);
    }
    
    if (toDate) {
      const toDateObj = new Date(toDate);
      filteredRaces = filteredRaces.filter(race => new Date(race.date) <= toDateObj);
    }
    
    return NextResponse.json({
      success: true,
      data: filteredRaces,
      count: filteredRaces.length,
      total: races.length
    });
  } catch (error) {
    console.error('Racing data API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Get a specific race by ID
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, raceId, horseId, data } = body;
    
    if (!action) {
      return NextResponse.json(
        { error: 'Missing required action field' },
        { status: 400 }
      );
    }
    
    // Handle different actions
    if (action === 'get_race_details') {
      if (!raceId) {
        return NextResponse.json(
          { error: 'Missing required raceId field' },
          { status: 400 }
        );
      }
      
      const race = races.find(r => r.id === raceId);
      
      if (!race) {
        return NextResponse.json(
          { error: 'Race not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({
        success: true,
        data: race
      });
    }
    
    if (action === 'get_horse_details') {
      if (!raceId || !horseId) {
        return NextResponse.json(
          { error: 'Missing required raceId or horseId field' },
          { status: 400 }
        );
      }
      
      const race = races.find(r => r.id === raceId);
      
      if (!race) {
        return NextResponse.json(
          { error: 'Race not found' },
          { status: 404 }
        );
      }
      
      const horse = race.horses.find(h => h.id === horseId);
      
      if (!horse) {
        return NextResponse.json(
          { error: 'Horse not found in this race' },
          { status: 404 }
        );
      }
      
      // Add more detailed horse information
      const detailedHorse = {
        ...horse,
        age: 5,
        weight: 56.5,
        form: '1-3-2-1',
        career: {
          starts: 12,
          wins: 5,
          places: 3,
          prize_money: 1250000
        },
        statistics: {
          win_rate: 0.42,
          place_rate: 0.67,
          favorite_win_rate: 0.60
        }
      };
      
      return NextResponse.json({
        success: true,
        data: detailedHorse
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Racing data API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}