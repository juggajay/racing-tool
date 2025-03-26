// Mock API for Punting Form
// This provides mock responses for testing without relying on the external API

export async function GET(request) {
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
        return Response.json(
          { error: 'Invalid endpoint. Supported endpoints are: comment, race, horse' },
          { status: 400 }
        );
    }
    
    // Return the mock data
    return Response.json({
      success: true,
      endpoint,
      data: mockData,
      timestamp: new Date().toISOString(),
      source: 'Mock API'
    });
  } catch (error) {
    console.error('Mock API error:', error);
    
    return Response.json(
      {
        error: 'Mock API error',
        message: error.message,
        details: 'An error occurred in the mock API'
      },
      { status: 500 }
    );
  }
}