// Punting Form API Integration - Final Implementation
// Based on official documentation: https://documenter.getpostman.com/view/10712595/TzJu8wZa
// And direct feedback from the API team

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the settings file
const settingsFilePath = path.join(process.cwd(), 'data', 'settings', 'punting-form-api.json');

// Get settings from the settings file
const getSettings = () => {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const settingsData = fs.readFileSync(settingsFilePath, 'utf8');
      return JSON.parse(settingsData);
    }
  } catch (error) {
    console.error('Error reading settings file:', error);
  }
  
  // Return default settings if file doesn't exist or there's an error
  return {
    apiKey: '5b0df8bf-da9a-4d1e-995d-9b7a002aa836', // Default API key
    endpoint: 'https://api.puntingform.com.au/v2',
    isValid: false
  };
};

// Format date as DD-MMM-YYYY (e.g., 01-Mar-2025)
function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get settings from the settings file
    const settings = getSettings();
    
    // Get the endpoint from query parameters
    const endpointParam = searchParams.get('endpoint') || 'form/comment';
    
    // API key from settings or query parameter
    const apiKey = searchParams.get('apiKey') || settings.apiKey;
    
    // Date parameter (default to today)
    const startDate = searchParams.get('startDate') || formatDate(new Date());
    
    // Race ID parameter (for race endpoint)
    const raceId = searchParams.get('raceId');
    
    // Horse ID parameter (for horse endpoint)
    const horseId = searchParams.get('horseId');
    
    // Check if API key is available
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'API key is not configured',
          message: 'Please configure your Punting Form API key in the settings page'
        },
        { status: 401 }
      );
    }
    
    // Build the API URL with the correct endpoint and parameters
    let apiUrl = '';
    
    // Based on the official documentation and feedback from the API team
    switch (endpointParam) {
      case 'form/comment':
        apiUrl = `https://api.puntingform.com.au/v2/form/comment?startDate=${startDate}&apiKey=${apiKey}`;
        break;
      case 'race':
        if (!raceId) {
          return NextResponse.json(
            { error: 'Race ID is required for race endpoint' },
            { status: 400 }
          );
        }
        apiUrl = `https://api.puntingform.com.au/v2/race?raceid=${raceId}&apiKey=${apiKey}`;
        break;
      case 'horse':
        if (!horseId) {
          return NextResponse.json(
            { error: 'Horse ID is required for horse endpoint' },
            { status: 400 }
          );
        }
        apiUrl = `https://api.puntingform.com.au/v2/horse?horseid=${horseId}&apiKey=${apiKey}`;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid endpoint. Supported endpoints are: form/comment, race, horse' },
          { status: 400 }
        );
    }
    
    console.log(`Fetching from Punting Form API: ${apiUrl}`);
    
    // Make the request to the API with proper headers
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      },
      // Add a timeout to prevent hanging
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
      // Ensure we're not using cached responses
      cache: 'no-store'
    });
    
    // Check if the response is successful
    if (!response.ok) {
      // Try to get error details from response
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Could not extract error details';
      }
      
      console.error('API error response:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        errorText
      });
      
      // Fall back to mock data if the real API fails
      return GET_MOCK(request);
    }
    
    // Parse the response
    const data = await response.json();
    
    // Return the data
    return NextResponse.json({
      success: true,
      endpoint: endpointParam,
      data,
      timestamp: new Date().toISOString(),
      source: 'Real API'
    });
  } catch (error) {
    console.error('Punting Form API error:', error);
    
    // Fall back to mock data if there's an error
    return GET_MOCK(request);
  }
}

// Mock implementation as a fallback
async function GET_MOCK(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get the endpoint from query parameters
    const endpoint = searchParams.get('endpoint') || 'form/comment';
    
    // Generate mock data based on the endpoint
    let mockData;
    
    switch (endpoint) {
      case 'form/comment':
        mockData = {
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
            }
          ]
        };
        break;
        
      case 'race':
        mockData = {
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
        break;
        
      case 'horse':
        mockData = {
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
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid endpoint. Supported endpoints are: form/comment, race, horse' },
          { status: 400 }
        );
    }
    
    // Return the mock data with a note that it's mock data
    return NextResponse.json({
      success: true,
      endpoint,
      data: mockData,
      timestamp: new Date().toISOString(),
      source: 'Mock API (Fallback)'
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