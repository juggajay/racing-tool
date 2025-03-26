// Test API for Racing Data
// This API provides a simple way to test the Racing Data API

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get the test type from query parameters
    const testType = searchParams.get('type') || 'races';
    
    // Get other parameters
    const date = searchParams.get('date') || '2025-03-28'; // Default to a date with mock data
    const track = searchParams.get('track');
    const raceNumber = searchParams.get('race_number');
    const horseId = searchParams.get('horse_id');
    
    let apiUrl;
    let method = 'GET';
    let body;
    
    // Build the appropriate API URL based on the test type
    switch (testType) {
      case 'races':
        // Get all races
        apiUrl = `/api/racing-data?endpoint=races`;
        if (date) apiUrl += `&date=${date}`;
        break;
      case 'race':
        // Get a specific race
        if (!track || !raceNumber) {
          return Response.json(
            { error: 'Track and race_number are required for race test' },
            { status: 400 }
          );
        }
        apiUrl = `/api/racing-data?endpoint=races&track=${track}&race_number=${raceNumber}`;
        break;
      case 'horse':
        // Get a specific horse
        if (!horseId) {
          return Response.json(
            { error: 'horse_id is required for horse test' },
            { status: 400 }
          );
        }
        apiUrl = `/api/racing-data?endpoint=horses&horse_id=${horseId}`;
        break;
      case 'track':
        // Get races for a specific track
        if (!track) {
          return Response.json(
            { error: 'track is required for track test' },
            { status: 400 }
          );
        }
        apiUrl = `/api/racing-data?endpoint=races&track=${track}`;
        break;
      case 'complex':
        // Test the POST endpoint with a complex operation
        method = 'POST';
        
        if (track && raceNumber) {
          // Get race with entries
          body = {
            action: 'getRaceWithEntries',
            track,
            raceNumber,
            date
          };
        } else if (horseId) {
          // Get horse details
          body = {
            action: 'getHorseDetails',
            horseId
          };
        } else if (track) {
          // Get races by track
          body = {
            action: 'getRacesByTrack',
            track
          };
        } else if (date) {
          // Get races by date
          body = {
            action: 'getRacesByDate',
            date
          };
        } else {
          return Response.json(
            { error: 'track, race_number, horse_id, or date is required for complex test' },
            { status: 400 }
          );
        }
        
        apiUrl = `/api/racing-data`;
        break;
      default:
        return Response.json(
          { error: 'Invalid test type' },
          { status: 400 }
        );
    }
    
    // Make the request to the racing-data API
    if (apiUrl) {
      const options = {
        method,
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      if (body) {
        options.body = JSON.stringify(body);
      }
      
      const response = await fetch(`${new URL(request.url).origin}${apiUrl}`, options);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return Response.json({
        success: true,
        test_type: testType,
        api_url: apiUrl,
        method,
        body,
        data
      });
    }
    
    return Response.json(
      { error: 'No API URL generated' },
      { status: 500 }
    );
  } catch (error) {
    console.error('Test API error:', error);
    
    return Response.json(
      {
        error: 'Test API error',
        message: error.message,
        details: 'An error occurred while testing the racing-data API'
      },
      { status: 500 }
    );
  }
}