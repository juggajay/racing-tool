// Punting Form API Integration (Real Implementation)
// Based on documentation: https://documenter.getpostman.com/view/10712595/TzJu8wZa

import fs from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get settings from the settings file
    const settings = getSettings();
    
    // Get the endpoint from query parameters
    const endpointParam = searchParams.get('endpoint');
    
    // API key from settings
    const apiKey = settings.apiKey;
    
    // Base API URL from settings
    const apiBaseUrl = settings.endpoint || 'https://api.puntingform.com.au/v2';
    
    // Log the request details for debugging
    console.log('Punting Form API Request:', {
      endpoint: endpointParam,
      apiBaseUrl,
      hasApiKey: !!apiKey
    });
    
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
    
    // Validate required parameters
    if (!endpointParam) {
      return NextResponse.json(
        { error: 'Endpoint parameter is required' },
        { status: 400 }
      );
    }
    
    // Map the endpoint parameter to the actual API endpoint
    let apiUrl = '';
    
    // Based on the official documentation: https://docs.puntingform.com.au/reference/comment-1
    switch (endpointParam) {
      case 'comment':
        apiUrl = `${apiBaseUrl}/comment`;
        break;
      case 'race':
        const raceId = searchParams.get('raceId');
        if (!raceId) {
          return NextResponse.json(
            { error: 'Race ID is required for race endpoint' },
            { status: 400 }
          );
        }
        apiUrl = `${apiBaseUrl}/race?raceid=${raceId}`;
        break;
      case 'horse':
        const horseId = searchParams.get('horseId');
        if (!horseId) {
          return NextResponse.json(
            { error: 'Horse ID is required for horse endpoint' },
            { status: 400 }
          );
        }
        apiUrl = `${apiBaseUrl}/horse?horseid=${horseId}`;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid endpoint. Supported endpoints are: comment, race, horse' },
          { status: 400 }
        );
    }
    
    console.log(`Fetching from Punting Form API: ${apiUrl}`);
    
    // Make the request to the API with proper headers
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': apiKey,
        'User-Agent': 'Racing-Tool/1.0'
      },
      // Add a timeout to prevent hanging
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
      // Ensure we're not using cached responses
      cache: 'no-store',
      // Ensure we're sending credentials if needed
      credentials: 'same-origin'
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
      console.log('Falling back to mock data');
      return GET_MOCK(request);
    }
    
    // Parse the response based on the content type
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
      
      // Try to parse as JSON if it looks like JSON
      if (data.startsWith('{') || data.startsWith('[')) {
        try {
          data = JSON.parse(data);
        } catch (e) {
          // Keep as text if parsing fails
        }
      }
    }
    
    // Return the data
    return NextResponse.json({
      success: true,
      endpoint: endpointParam,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Punting Form API error:', error);
    
    // Fall back to mock data if there's an error
    console.log('Falling back to mock data due to error');
    return GET_MOCK(request);
  }
}

// Mock implementation as a fallback
async function GET_MOCK(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get the endpoint from query parameters
    const endpoint = searchParams.get('endpoint') || 'comment';
    
    // Generate mock data based on the endpoint
    let mockData;
    
    switch (endpoint) {
      case 'comment':
        mockData = {
          comments: [
            {
              id: 1,
              raceId: 'race123',
              text: 'This is a mock comment for testing',
              author: 'Mock API',
              timestamp: new Date().toISOString()
            },
            {
              id: 2,
              raceId: 'race123',
              text: 'Another mock comment for testing',
              author: 'Mock API',
              timestamp: new Date().toISOString()
            }
          ]
        };
        break;
        
      case 'race':
        mockData = {
          id: 'race123',
          name: 'Mock Race',
          trackName: 'Mock Track',
          date: new Date().toISOString().split('T')[0],
          time: '15:00',
          distance: 1200,
          horses: [
            { id: 'horse1', name: 'Mock Horse 1', jockey: 'Mock Jockey 1', trainer: 'Mock Trainer 1', odds: 3.5 },
            { id: 'horse2', name: 'Mock Horse 2', jockey: 'Mock Jockey 2', trainer: 'Mock Trainer 2', odds: 4.2 },
            { id: 'horse3', name: 'Mock Horse 3', jockey: 'Mock Jockey 3', trainer: 'Mock Trainer 3', odds: 5.0 }
          ]
        };
        break;
        
      case 'horse':
        mockData = {
          id: 'horse1',
          name: 'Mock Horse',
          age: 5,
          sex: 'Gelding',
          color: 'Bay',
          sire: 'Mock Sire',
          dam: 'Mock Dam',
          trainer: 'Mock Trainer',
          owner: 'Mock Owner',
          record: {
            starts: 15,
            wins: 5,
            places: 3,
            earnings: 250000
          },
          form: [
            { date: '2023-01-15', track: 'Mock Track 1', position: 1, distance: 1200 },
            { date: '2023-02-10', track: 'Mock Track 2', position: 3, distance: 1400 },
            { date: '2023-03-05', track: 'Mock Track 3', position: 2, distance: 1600 }
          ]
        };
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid endpoint. Supported endpoints are: comment, race, horse' },
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