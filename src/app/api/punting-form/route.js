// Punting Form API Integration
// This file integrates with the Punting Form API (https://www.puntingform.com.au/)

// API credentials - these should be stored in environment variables in production
// For now, we'll store them here for demonstration purposes
const API_BASE_URL = 'https://api.puntingform.com.au';
let API_KEY = '5b0df8bf-da9a-4d1e-995d-9b7a002aa836'; // Default API key

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get API key from query parameters (for testing purposes)
    // In production, this should be stored securely in environment variables
    API_KEY = searchParams.get('api_key') || API_KEY;
    
    if (!API_KEY) {
      return Response.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }
    
    // Parse query parameters
    const endpoint = searchParams.get('endpoint') || 'races'; // Default to races endpoint
    const date = searchParams.get('date');
    const track = searchParams.get('track');
    const raceNumber = searchParams.get('race_number');
    const horseId = searchParams.get('horse_id');
    
    // Build the API URL based on the requested endpoint and parameters
    let apiUrl = `${API_BASE_URL}/${endpoint}`;
    const queryParams = new URLSearchParams();
    
    // Add parameters if they exist
    if (date) queryParams.append('date', date);
    if (track) queryParams.append('track', track);
    if (raceNumber) queryParams.append('race_number', raceNumber);
    if (horseId) queryParams.append('horse_id', horseId);
    
    // Add query parameters to URL if any exist
    if (queryParams.toString()) {
      apiUrl += `?${queryParams.toString()}`;
    }
    
    // Make the request to the Punting Form API
    const response = await fetch(apiUrl, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(
        { 
          error: 'Error fetching data from Punting Form API', 
          status: response.status,
          details: errorData
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    return Response.json({
      success: true,
      data,
      source: 'Punting Form API',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Punting Form API error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Parse the request body
    const body = await request.json();
    
    // Extract API key from the request body
    API_KEY = body.api_key || API_KEY;
    
    if (!API_KEY) {
      return Response.json(
        { error: 'API key is required' },
        { status: 401 }
      );
    }
    
    // Extract other parameters from the request body
    const { endpoint, action, parameters } = body;
    
    if (!endpoint) {
      return Response.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }
    
    // Build the API URL
    let apiUrl = `${API_BASE_URL}/${endpoint}`;
    
    // Add action to URL if provided
    if (action) {
      apiUrl += `/${action}`;
    }
    
    // Make the request to the Punting Form API
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(parameters || {}),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return Response.json(
        { 
          error: 'Error posting data to Punting Form API', 
          status: response.status,
          details: errorData
        },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    
    return Response.json({
      success: true,
      data,
      source: 'Punting Form API',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Punting Form API error:', error);
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}