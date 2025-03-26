// Racing Data API
// This API provides access to horse racing data using the mock Punting Form API

// We'll use fetch to call the mock API instead of importing it directly
// This avoids potential issues with circular imports or module resolution

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const endpoint = searchParams.get('endpoint') || 'races'; // Default to races endpoint
    const date = searchParams.get('date');
    const track = searchParams.get('track');
    const raceNumber = searchParams.get('race_number');
    const horseId = searchParams.get('horse_id');
    
    // Build the URL for the mock API
    const mockApiUrl = new URL('/api/punting-form-mock', request.url);
    mockApiUrl.searchParams.set('endpoint', endpoint);
    if (date) mockApiUrl.searchParams.set('date', date);
    if (track) mockApiUrl.searchParams.set('track', track);
    if (raceNumber) mockApiUrl.searchParams.set('race_number', raceNumber);
    if (horseId) mockApiUrl.searchParams.set('horse_id', horseId);
    
    // Fetch data from the mock API
    const mockResponse = await fetch(mockApiUrl.toString());
    
    if (!mockResponse.ok) {
      throw new Error(`Mock API error: ${mockResponse.status} ${mockResponse.statusText}`);
    }
    
    const mockData = await mockResponse.json();
    
    // Process the data based on the endpoint
    let processedData = mockData.data;
    
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
      
      // Build the URL for the mock API
      const mockApiUrl = new URL('/api/punting-form-mock', request.url);
      mockApiUrl.searchParams.set('endpoint', 'races');
      if (date) mockApiUrl.searchParams.set('date', date);
      mockApiUrl.searchParams.set('track', track);
      mockApiUrl.searchParams.set('race_number', raceNumber);
      
      // Fetch data from the mock API
      const mockResponse = await fetch(mockApiUrl.toString());
      
      if (!mockResponse.ok) {
        throw new Error(`Mock API error: ${mockResponse.status} ${mockResponse.statusText}`);
      }
      
      const mockData = await mockResponse.json();
      
      return Response.json({
        success: true,
        data: mockData.data,
        source: 'Racing Data API (Mock)',
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
      
      // Build the URL for the mock API
      const mockApiUrl = new URL('/api/punting-form-mock', request.url);
      mockApiUrl.searchParams.set('endpoint', 'horses');
      mockApiUrl.searchParams.set('horse_id', horseId);
      
      // Fetch data from the mock API
      const mockResponse = await fetch(mockApiUrl.toString());
      
      if (!mockResponse.ok) {
        throw new Error(`Mock API error: ${mockResponse.status} ${mockResponse.statusText}`);
      }
      
      const mockData = await mockResponse.json();
      
      return Response.json({
        success: true,
        data: mockData.data,
        source: 'Racing Data API (Mock)',
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
      
      // Build the URL for the mock API
      const mockApiUrl = new URL('/api/punting-form-mock', request.url);
      mockApiUrl.searchParams.set('endpoint', 'races');
      mockApiUrl.searchParams.set('track', track);
      
      // Fetch data from the mock API
      const mockResponse = await fetch(mockApiUrl.toString());
      
      if (!mockResponse.ok) {
        throw new Error(`Mock API error: ${mockResponse.status} ${mockResponse.statusText}`);
      }
      
      const mockData = await mockResponse.json();
      
      return Response.json({
        success: true,
        data: mockData.data,
        source: 'Racing Data API (Mock)',
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
      
      // Build the URL for the mock API
      const mockApiUrl = new URL('/api/punting-form-mock', request.url);
      mockApiUrl.searchParams.set('endpoint', 'races');
      mockApiUrl.searchParams.set('date', date);
      
      // Fetch data from the mock API
      const mockResponse = await fetch(mockApiUrl.toString());
      
      if (!mockResponse.ok) {
        throw new Error(`Mock API error: ${mockResponse.status} ${mockResponse.statusText}`);
      }
      
      const mockData = await mockResponse.json();
      
      return Response.json({
        success: true,
        data: mockData.data,
        source: 'Racing Data API (Mock)',
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