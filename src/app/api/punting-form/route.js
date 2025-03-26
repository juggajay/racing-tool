// Punting Form API Integration
// This file integrates with the Punting Form API (https://www.puntingform.com.au/)

// API credentials - these should be stored in environment variables in production
// For now, we'll store them here for demonstration purposes
const API_BASE_URL = 'http://old.puntingform.com.au/api'; // Direct address as recommended in documentation
let API_KEY = '5b0df8bf-da9a-4d1e-995d-9b7a002aa836'; // Default API key

// Mock data for development and testing
const USE_MOCK_DATA = true; // Set to false to use the real API

// Disable mock API as per user request
const USE_MOCK_API = false;

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
    
    // Mock API is disabled as per user request
    
    // If using mock data, return mock data instead of making API calls
    if (USE_MOCK_DATA) {
      console.log('Using mock data for Punting Form API');
      
      // Return mock data based on the requested endpoint
      let mockData;
      
      switch(endpoint) {
        case 'races':
          mockData = getMockRaces();
          break;
        case 'scratchings':
          mockData = getMockScratchings();
          break;
        case 'ratings':
          mockData = getMockRatings();
          break;
        default:
          mockData = getMockRaces();
      }
      
      return Response.json({
        success: true,
        data: mockData,
        source: 'Mock Data',
        timestamp: new Date().toISOString()
      });
    }
    
    // Build the API URL based on the documentation
    let service = '';
    
    // Determine which service to use based on the endpoint
    switch(endpoint) {
      case 'races':
        service = 'formdataservice';
        break;
      case 'scratchings':
        service = 'scratchingsservice';
        break;
      case 'ratings':
        service = 'ratingsservice';
        break;
      default:
        service = 'formdataservice';
    }
    
    // Build the base URL with the service
    let apiUrl = `${API_BASE_URL}/${service}`;
    
    // Add specific endpoint based on the requested data
    if (endpoint === 'races') {
      apiUrl += '/ExportMeetings';
      
      // Add date parameter if provided
      if (date) {
        apiUrl += `/${date}`;
      }
      
      // Add includeBarrierTrials parameter
      apiUrl += '/false';
    } else if (endpoint === 'scratchings') {
      apiUrl += '/GetAllScratchings';
    } else if (endpoint === 'ratings') {
      apiUrl += '/GetRatings';
      
      // Add track and date parameters if provided
      if (track && date) {
        apiUrl += `/${track}/${date}`;
      }
    }
    
    // Create query parameters
    const queryParams = new URLSearchParams();
    
    // Add API key as query parameter
    queryParams.append('ApiKey', API_KEY);
    
    // Add additional parameters if they exist
    if (raceNumber) queryParams.append('race_number', raceNumber);
    if (horseId) queryParams.append('horse_id', horseId);
    
    // Add query parameters to URL
    apiUrl += `?${queryParams.toString()}`;
    
    console.log('Fetching from Punting Form API:', apiUrl);
    
    try {
      // Make the request to the Punting Form API
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': 'application/json'
        },
        // Add a timeout to prevent hanging
        signal: AbortSignal.timeout(10000) // Increased timeout for potentially large responses
      });
      
      if (!response.ok) {
        // Try to get error details from response
        let errorData;
        let errorText;
        
        try {
          errorData = await response.json();
        } catch (e) {
          try {
            errorText = await response.text();
          } catch (e2) {
            errorText = 'Could not extract error details';
          }
        }
        
        console.error('Punting Form API error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          errorText
        });
        
        // If the primary URL failed, try the fallback URL
        if (apiUrl.startsWith(API_BASE_URL)) {
          console.log('Trying fallback URL...');
          const fallbackUrl = apiUrl.replace(API_BASE_URL, API_FALLBACK_URL);
          
          try {
            const fallbackResponse = await fetch(fallbackUrl, {
              headers: {
                'Accept': 'application/json'
              },
              signal: AbortSignal.timeout(10000)
            });
            
            if (fallbackResponse.ok) {
              console.log('Fallback URL succeeded');
              const data = await fallbackResponse.json();
              
              return Response.json({
                success: true,
                data,
                source: 'Punting Form API (fallback)',
                timestamp: new Date().toISOString()
              });
            } else {
              console.error('Fallback URL also failed');
            }
          } catch (fallbackError) {
            console.error('Error with fallback URL:', fallbackError);
          }
        }
        
        // Return a clear error message
        return Response.json(
          {
            error: 'Error fetching data from Punting Form API',
            status: response.status,
            statusText: response.statusText,
            url: apiUrl,
            details: errorData || errorText,
            message: 'The Punting Form API is currently unavailable. Please check your API key and try again later.'
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
      console.error('Error fetching from Punting Form API:', error);
      
      // Return a clear error message
      return Response.json(
        {
          error: 'Error connecting to Punting Form API',
          message: 'Failed to connect to the Punting Form API. Please check your internet connection and try again later.',
          details: error.message,
          url: apiUrl
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Punting Form API error:', error);
    
    // Return a clear error message
    return Response.json(
      {
        error: 'Service temporarily unavailable',
        message: 'We are experiencing technical difficulties with the Punting Form API. Please try again later.',
        details: error.message
      },
      { status: 503 }
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
    
    // Mock API is disabled as per user request
    
    // The FormDataService API doesn't have POST endpoints according to the documentation
    // But we'll implement this for future use or custom endpoints
    
    // Build the API URL based on the FormDataService documentation
    let apiUrl = API_BASE_URL;
    
    // Add the endpoint and action
    if (action) {
      apiUrl += `/${action}`;
    } else {
      // Default to GetMeetings if no specific action is provided
      apiUrl += `/GetMeetings`;
    }
    
    // Add date parameter if provided
    if (parameters && parameters.date) {
      apiUrl += `/${parameters.date}`;
    } else {
      // Use current date as default
      apiUrl += `/${new Date().toLocaleDateString('en-AU')}`;
    }
    
    console.log('Posting to Punting Form API:', apiUrl);
    
    try {
      // Add API key as query parameter
      apiUrl += `?ApiKey=${API_KEY}`;
      
      // Make the request to the Punting Form API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(parameters || {}),
        // Add a timeout to prevent hanging
        signal: AbortSignal.timeout(10000)
      });
      
      if (!response.ok) {
        // Try to get error details from response
        let errorData;
        let errorText;
        
        try {
          errorData = await response.json();
        } catch (e) {
          try {
            errorText = await response.text();
          } catch (e2) {
            errorText = 'Could not extract error details';
          }
        }
        
        // Mock data functions for development and testing
        function getMockRaces() {
          return [
            {
              meetingId: 176739,
              track: "Coffs Harbour",
              railPosition: "+4m 1000m - 350m where cutaway applies, True remainder",
              TABMeeting: true,
              meetingDate: "2025-03-26T00:00:00.000Z",
              isBarrierTrial: false,
              hasSectionals: false,
              trackAbbrev: "COFF",
              resulted: true,
              races: [
                {
                  raceId: 868438,
                  meetingId: 176739,
                  raceName: "Lindsay Jacobs Memorial Hcp-C1",
                  raceNo: 1,
                  prizeMoney: 22000,
                  starters: 8,
                  startTime: "2025-03-26T12:40:00.000Z",
                  class: "Class 1",
                  distance: 1012,
                  ageRestrictions: "3YO+",
                  sexRestrictions: "No",
                  weightType: "Handicap"
                },
                {
                  raceId: 868439,
                  meetingId: 176739,
                  raceName: "John Sleeman Memorial Hcp (C1)",
                  raceNo: 2,
                  prizeMoney: 22000,
                  starters: 10,
                  startTime: "2025-03-26T13:15:00.000Z",
                  class: "Class 1",
                  distance: 1012,
                  ageRestrictions: "3YO+",
                  sexRestrictions: "No",
                  weightType: "Handicap"
                }
              ]
            },
            {
              meetingId: 176742,
              track: "Echuca",
              railPosition: "True Entire Circuit",
              TABMeeting: true,
              meetingDate: "2025-03-26T00:00:00.000Z",
              isBarrierTrial: false,
              hasSectionals: false,
              trackAbbrev: "ECHA",
              resulted: true,
              races: [
                {
                  raceId: 868432,
                  meetingId: 176742,
                  raceName: "Bruce Hopkins Memorial Mdn-3",
                  raceNo: 1,
                  prizeMoney: 22000,
                  starters: 12,
                  startTime: "2025-03-26T11:50:00.000Z",
                  class: "Maiden",
                  distance: 1315,
                  ageRestrictions: "3YO+",
                  sexRestrictions: "No",
                  weightType: "Set Weights"
                }
              ]
            }
          ];
        }
        
        function getMockScratchings() {
          return [
            {
              raceId: 868438,
              horseId: 123456,
              horseName: "Fast Runner",
              scratchTime: "2025-03-26T10:30:00.000Z",
              reason: "Veterinary advice"
            },
            {
              raceId: 868439,
              horseId: 234567,
              horseName: "Quick Silver",
              scratchTime: "2025-03-26T09:15:00.000Z",
              reason: "Trainer request"
            }
          ];
        }
        
        function getMockRatings() {
          return [
            {
              raceId: 868438,
              horseId: 345678,
              horseName: "Thunder Bolt",
              rating: 85,
              ratingChange: 2
            },
            {
              raceId: 868438,
              horseId: 456789,
              horseName: "Lightning Strike",
              rating: 78,
              ratingChange: -1
            },
            {
              raceId: 868439,
              horseId: 567890,
              horseName: "Storm Chaser",
              rating: 82,
              ratingChange: 0
            }
          ];
        }
        
        console.error('Punting Form API error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          errorText
        });
        
        // If the primary URL failed, try the fallback URL
        if (apiUrl.startsWith(API_BASE_URL)) {
          console.log('Trying fallback URL...');
          const fallbackUrl = apiUrl.replace(API_BASE_URL, API_FALLBACK_URL);
          
          try {
            const fallbackResponse = await fetch(fallbackUrl, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
              },
              body: JSON.stringify(parameters || {}),
              signal: AbortSignal.timeout(10000)
            });
            
            if (fallbackResponse.ok) {
              console.log('Fallback URL succeeded');
              const data = await fallbackResponse.json();
              
              return Response.json({
                success: true,
                data,
                source: 'Punting Form API (fallback)',
                timestamp: new Date().toISOString()
              });
            } else {
              console.error('Fallback URL also failed');
            }
          } catch (fallbackError) {
            console.error('Error with fallback URL:', fallbackError);
          }
        }
        
        // Return a clear error message
        return Response.json(
          {
            error: 'Error posting data to Punting Form API',
            status: response.status,
            statusText: response.statusText,
            url: apiUrl,
            details: errorData || errorText,
            message: 'The Punting Form API is currently unavailable. Please check your API key and try again later.'
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
      console.error('Error posting to Punting Form API:', error);
      
      // Return a clear error message
      return Response.json(
        {
          error: 'Error connecting to Punting Form API',
          message: 'Failed to connect to the Punting Form API. Please check your internet connection and try again later.',
          details: error.message,
          url: apiUrl
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('Punting Form API error:', error);
    
    // Return a clear error message
    return Response.json(
      {
        error: 'Service temporarily unavailable',
        message: 'We are experiencing technical difficulties with the Punting Form API. Please try again later.',
        details: error.message
      },
      { status: 503 }
    );
  }
}