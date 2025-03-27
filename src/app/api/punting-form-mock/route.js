// Mock API for Punting Form
// This provides static data for testing and development

import { NextResponse } from 'next/server';

// Sample comment data
const mockCommentData = {
  "comments": [
    {
      "id": 1,
      "raceId": "race123",
      "text": "This horse has been performing well in recent races, showing good form.",
      "author": "Racing Expert",
      "timestamp": new Date().toISOString()
    },
    {
      "id": 2,
      "raceId": "race123",
      "text": "Track conditions may affect performance today, keep an eye on the weather.",
      "author": "Weather Analyst",
      "timestamp": new Date().toISOString()
    },
    {
      "id": 3,
      "raceId": "race456",
      "text": "This jockey has a great record at this track, which could be an advantage.",
      "author": "Jockey Specialist",
      "timestamp": new Date().toISOString()
    }
  ]
};

// Sample race data
const mockRaceData = {
  "id": "race123",
  "name": "Melbourne Cup",
  "trackName": "Flemington",
  "date": new Date().toISOString().split('T')[0],
  "time": "15:00",
  "distance": 3200,
  "horses": [
    { "id": "horse1", "name": "Thunder Strike", "jockey": "James Smith", "trainer": "David Williams", "odds": 3.5 },
    { "id": "horse2", "name": "Rapid Runner", "jockey": "Michael Johnson", "trainer": "Sarah Brown", "odds": 4.2 },
    { "id": "horse3", "name": "Golden Gallop", "jockey": "Emma Davis", "trainer": "Robert Jones", "odds": 5.0 }
  ]
};

// Sample horse data
const mockHorseData = {
  "id": "horse1",
  "name": "Thunder Strike",
  "age": 5,
  "sex": "Gelding",
  "color": "Bay",
  "sire": "Lightning Bolt",
  "dam": "Thunder Cloud",
  "trainer": "David Williams",
  "owner": "Thunder Racing Syndicate",
  "record": {
    "starts": 15,
    "wins": 5,
    "places": 3,
    "earnings": 250000
  },
  "form": [
    { "date": "2023-01-15", "track": "Flemington", "position": 1, "distance": 1200 },
    { "date": "2023-02-10", "track": "Caulfield", "position": 3, "distance": 1400 },
    { "date": "2023-03-05", "track": "Moonee Valley", "position": 2, "distance": 1600 }
  ]
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get the endpoint from query parameters
    const endpoint = searchParams.get('endpoint') || 'comment';
    
    // Get mock data based on the endpoint
    let data;
    
    switch (endpoint) {
      case 'comment':
      case 'form/comment':
        data = mockCommentData;
        break;
      case 'race':
        data = mockRaceData;
        break;
      case 'horse':
        data = mockHorseData;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid endpoint. Supported endpoints are: comment, form/comment, race, horse' },
          { status: 400 }
        );
    }
    
    // Return the mock data
    return NextResponse.json({
      success: true,
      endpoint,
      data,
      timestamp: new Date().toISOString(),
      source: 'Mock API'
    });
  } catch (error) {
    console.error('Mock API error:', error);
    
    return NextResponse.json(
      {
        error: 'Mock API error',
        message: error.message,
        details: 'An error occurred in the mock API'
      },
      { status: 500 }
    );
  }
}