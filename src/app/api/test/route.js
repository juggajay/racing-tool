// Test API route to demonstrate how to use the racing-data API

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get the test type from query parameters
    const testType = searchParams.get('type') || 'meetings';
    
    // Format today's date for the API
    const today = new Date();
    const formattedDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
    
    let apiUrl;
    
    // Build the appropriate API URL based on the test type
    switch (testType) {
      case 'meetings':
        // Get all meetings for today
        apiUrl = `/api/racing-data?endpoint=ExportMeetings&date=${formattedDate}`;
        break;
      case 'races':
        // Get races for a specific meeting
        const meetingId = searchParams.get('meetingId');
        if (!meetingId) {
          return Response.json(
            { error: 'meetingId is required for races test' },
            { status: 400 }
          );
        }
        apiUrl = `/api/racing-data?endpoint=ExportRaces&date=${formattedDate}&meetingId=${meetingId}`;
        break;
      case 'fields':
        // Get fields for a specific race
        const raceId = searchParams.get('raceId');
        if (!raceId) {
          return Response.json(
            { error: 'raceId is required for fields test' },
            { status: 400 }
          );
        }
        apiUrl = `/api/racing-data?endpoint=ExportFields&date=${formattedDate}&raceId=${raceId}`;
        break;
      case 'complex':
        // Test the POST endpoint with a complex operation
        const meetingIdComplex = searchParams.get('meetingId');
        const raceIdComplex = searchParams.get('raceId');
        
        if (raceIdComplex) {
          // Get race with fields
          const response = await fetch(`${new URL(request.url).origin}/api/racing-data`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              action: 'getRaceWithFields',
              date: formattedDate,
              raceId: raceIdComplex,
              meetingId: meetingIdComplex // Optional
            })
          });
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          return Response.json(data);
        } else if (meetingIdComplex) {
          // Get meetings with races
          const response = await fetch(`${new URL(request.url).origin}/api/racing-data`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              action: 'getMeetingsWithRaces',
              date: formattedDate,
              includeBarrierTrials: false
            })
          });
          
          if (!response.ok) {
            throw new Error(`API error: ${response.status} ${response.statusText}`);
          }
          
          const data = await response.json();
          return Response.json(data);
        } else {
          return Response.json(
            { error: 'meetingId or raceId is required for complex test' },
            { status: 400 }
          );
        }
        break;
      default:
        return Response.json(
          { error: 'Invalid test type' },
          { status: 400 }
        );
    }
    
    // Make the request to the racing-data API
    if (apiUrl) {
      const response = await fetch(`${new URL(request.url).origin}${apiUrl}`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status} ${response.statusText}`);
      }
      
      const data = await response.json();
      return Response.json(data);
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