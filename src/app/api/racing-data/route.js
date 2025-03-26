// Racing Data API
// This API provides access to horse racing data using the mock Punting Form API

// Import mock data from the punting-form-mock API
import { GET as getMockData } from '../punting-form-mock/route';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const endpoint = searchParams.get('endpoint') || 'races'; // Default to races endpoint
    const date = searchParams.get('date');
    const track = searchParams.get('track');
    const raceNumber = searchParams.get('race_number');
    const horseId = searchParams.get('horse_id');
    
    // Create a new request to the mock API
    const mockRequest = new Request(
      `${new URL(request.url).origin}/api/punting-form-mock?endpoint=${endpoint}` +
      (date ? `&date=${date}` : '') +
      (track ? `&track=${track}` : '') +
      (raceNumber ? `&race_number=${raceNumber}` : '') +
      (horseId ? `&horse_id=${horseId}` : '')
    );
    
    // Get data from the mock API
    const mockResponse = await getMockData(mockRequest);
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
      
      // Create a new request to the mock API
      const mockRequest = new Request(
        `${new URL(request.url).origin}/api/punting-form-mock?endpoint=races` +
        (date ? `&date=${date}` : '') +
        `&track=${track}` +
        `&race_number=${raceNumber}`
      );
      
      // Get data from the mock API
      const mockResponse = await getMockData(mockRequest);
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
      
      // Create a new request to the mock API
      const mockRequest = new Request(
        `${new URL(request.url).origin}/api/punting-form-mock?endpoint=horses&horse_id=${horseId}`
      );
      
      // Get data from the mock API
      const mockResponse = await getMockData(mockRequest);
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
      
      // Create a new request to the mock API
      const mockRequest = new Request(
        `${new URL(request.url).origin}/api/punting-form-mock?endpoint=races&track=${track}`
      );
      
      // Get data from the mock API
      const mockResponse = await getMockData(mockRequest);
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
      
      // Create a new request to the mock API
      const mockRequest = new Request(
        `${new URL(request.url).origin}/api/punting-form-mock?endpoint=races&date=${date}`
      );
      
      // Get data from the mock API
      const mockResponse = await getMockData(mockRequest);
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