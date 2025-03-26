// Punting Form API Integration
// This file integrates with the Punting Form API (https://www.puntingform.com.au/)
// Based on the FormDataService API documentation: https://documenter.getpostman.com/view/10712595/TzJu8wZa

// API credentials - these should be stored in environment variables in production
// For now, we'll store them here for demonstration purposes
const API_BASE_URL = 'http://www.puntingform.com.au/api'; // Base URL from documentation
let API_KEY = '5b0df8bf-da9a-4d1e-995d-9b7a002aa836'; // User's API key

// Mock data for development and testing
const USE_MOCK_DATA = false; // Using the real API with the provided key

// Helper function to format date in the required format (d-MMM-yyyy)
function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Helper functions to parse caret-delimited responses
function parseExportMeetingsResponse(text) {
  if (!text) return [];
  
  const lines = text.split('\n').filter(line => line.trim());
  const meetings = [];
  
  for (const line of lines) {
    const fields = line.split('^');
    if (fields.length < 10) continue;
    
    const meeting = {
      meetingId: parseInt(fields[0], 10) || 0,
      track: fields[1] || '',
      railPosition: fields[2] || '',
      TABMeeting: fields[3] === 'True',
      meetingDate: fields[4] || '',
      isBarrierTrial: fields[5] === 'True',
      hasSectionals: fields[6] === 'True',
      trackAbbrev: fields[7] || '',
      resulted: fields[8] === 'True',
      races: []
    };
    
    meetings.push(meeting);
  }
  
  return meetings;
}

function parseExportRacesResponse(text) {
  if (!text) return [];
  
  const lines = text.split('\n').filter(line => line.trim());
  const races = [];
  
  for (const line of lines) {
    const fields = line.split('^');
    if (fields.length < 15) continue;
    
    const race = {
      raceId: parseInt(fields[0], 10) || 0,
      meetingId: parseInt(fields[1], 10) || 0,
      raceName: fields[2] || '',
      raceNo: parseInt(fields[3], 10) || 0,
      prizeMoney: parseInt(fields[4], 10) || 0,
      starters: parseInt(fields[5], 10) || 0,
      startTime: fields[6] || '',
      class: fields[7] || '',
      distance: parseInt(fields[8], 10) || 0,
      ageRestrictions: fields[9] || '',
      sexRestrictions: fields[10] || '',
      weightType: fields[11] || ''
    };
    
    races.push(race);
  }
  
  return races;
}

function parseExportFieldsResponse(text) {
  if (!text) return [];
  
  const lines = text.split('\n').filter(line => line.trim());
  const fields = [];
  
  for (const line of lines) {
    const parts = line.split('^');
    if (parts.length < 15) continue;
    
    const field = {
      fieldId: parseInt(parts[0], 10) || 0,
      raceId: parseInt(parts[1], 10) || 0,
      tabNo: parseInt(parts[2], 10) || 0,
      position: parseInt(parts[3], 10) || 0,
      margin: parseFloat(parts[4]) || 0,
      horse: parts[5] || '',
      trainer: parts[6] || '',
      jockey: parts[7] || '',
      weight: parseFloat(parts[8]) || 0,
      barrier: parseInt(parts[9], 10) || 0,
      inRun: parts[10] || '',
      flucs: parts[11] || '',
      priceSP: parseFloat(parts[12]) || 0,
      priceTAB: parseFloat(parts[13]) || 0
    };
    
    fields.push(field);
  }
  
  return fields;
}

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
    const endpoint = searchParams.get('endpoint') || 'ExportMeetings'; // Default to ExportMeetings endpoint
    const date = searchParams.get('date') || formatDate(new Date()); // Default to today's date
    const includeBarrierTrials = searchParams.get('includeBarrierTrials') === 'true'; // Default to false
    
    // If using mock data, return mock data instead of making API calls
    if (USE_MOCK_DATA) {
      console.log('Using mock data for Punting Form API');
      
      // Return mock data based on the requested endpoint
      let mockData;
      
      switch(endpoint) {
        case 'ExportMeetings':
          mockData = getMockRaces();
          break;
        case 'ExportRaces':
          mockData = getMockRaces();
          break;
        case 'ExportFields':
          mockData = getMockRatings();
          break;
        case 'GetMeetings':
          mockData = getMockMeetings();
          break;
        case 'GetMeetingList':
          mockData = getMockMeetingList();
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
    // The format is: http://www.puntingform.com.au/api/service/endpoint/parameters?ApiKey=key
    
    // Determine which service to use based on the endpoint
    let service = '';
    
    if (['ExportMeetings', 'ExportRaces', 'ExportFields'].includes(endpoint)) {
      service = 'formdataservice';
    } else if (endpoint === 'GetAllScratchings') {
      service = 'scratchingsservice';
    } else if (endpoint === 'GetRatings') {
      service = 'ratingsservice';
    } else {
      service = 'formdataservice';
    }
    
    // Build the base URL with the service
    let apiUrl = `${API_BASE_URL}/${service}/${endpoint}`;
    
    // Add date parameter
    apiUrl += `/${date}`;
    
    // Add includeBarrierTrials parameter for endpoints that support it
    if (['ExportMeetings', 'ExportRaces', 'ExportFields'].includes(endpoint)) {
      apiUrl += `/${includeBarrierTrials ? 'true' : 'false'}`;
    }
    
    // Add API key as query parameter
    apiUrl += `?ApiKey=${API_KEY}`;
    
    console.log('Fetching from Punting Form API:', apiUrl);
    
    try {
      // Make the request to the FormDataService API
      const response = await fetch(apiUrl, {
        headers: {
          'Accept': '*/*'  // Accept any content type as the API returns different formats
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
        
        console.error('FormDataService API error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          errorText
        });
        
        // Return a clear error message
        return Response.json(
          {
            error: 'Error fetching data from FormDataService API',
            status: response.status,
            statusText: response.statusText,
            url: apiUrl,
            details: errorData || errorText,
            message: 'The FormDataService API is currently unavailable. Please check your API key and try again later.'
          },
          { status: response.status }
        );
      }
      
      // For most endpoints, the response is a caret (^) delimited list of strings
      // We need to parse this into a more usable format
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // If the response is JSON, parse it directly
        data = await response.json();
      } else {
        // Otherwise, assume it's a caret-delimited string
        const text = await response.text();
        
        // Parse the response based on the endpoint
        switch (endpoint) {
          case 'ExportMeetings':
            data = parseExportMeetingsResponse(text);
            break;
          case 'ExportRaces':
            data = parseExportRacesResponse(text);
            break;
          case 'ExportFields':
            data = parseExportFieldsResponse(text);
            break;
          case 'GetMeetings':
          case 'GetMeetingList':
            // These endpoints return JSON
            try {
              data = JSON.parse(text);
            } catch (e) {
              console.error('Error parsing JSON response:', e);
              data = { raw: text };
            }
            break;
          default:
            // For unknown endpoints, just return the raw text
            data = { raw: text };
        }
      }
      
      return Response.json({
        success: true,
        data,
        source: 'FormDataService API',
        endpoint,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching from FormDataService API:', error);
      
      // Return a clear error message
      return Response.json(
        {
          error: 'Error connecting to FormDataService API',
          message: 'Failed to connect to the FormDataService API. Please check your internet connection and try again later.',
          details: error.message,
          url: apiUrl
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('FormDataService API error:', error);
    
    // Return a clear error message
    return Response.json(
      {
        error: 'API Connection Issue',
        message: 'Unable to connect to the Punting Form API. Please check your API key and try again.',
        details: 'Using the recommended URL format: http://www.puntingform.com.au/api/service/endpoint'
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
    const { endpoint, date, includeBarrierTrials } = body;
    
    if (!endpoint) {
      return Response.json(
        { error: 'Endpoint is required' },
        { status: 400 }
      );
    }
    
    // Note: The FormDataService API primarily uses GET requests according to the documentation
    // This POST method is provided for convenience to allow clients to send parameters in the request body
    
    // Build the API URL based on the documentation
    // The format is: http://www.puntingform.com.au/api/service/endpoint/parameters?ApiKey=key
    
    // Determine which service to use based on the endpoint
    let service = '';
    
    if (['ExportMeetings', 'ExportRaces', 'ExportFields'].includes(endpoint)) {
      service = 'formdataservice';
    } else if (endpoint === 'GetAllScratchings') {
      service = 'scratchingsservice';
    } else if (endpoint === 'GetRatings') {
      service = 'ratingsservice';
    } else {
      service = 'formdataservice';
    }
    
    // Build the base URL with the service
    let apiUrl = `${API_BASE_URL}/${service}/${endpoint}`;
    
    // Add date parameter if provided, otherwise use today's date
    const formattedDate = date ? date : formatDate(new Date());
    apiUrl += `/${formattedDate}`;
    
    // Add includeBarrierTrials parameter for endpoints that support it
    if (['ExportMeetings', 'ExportRaces', 'ExportFields'].includes(endpoint)) {
      const useBarrierTrials = includeBarrierTrials === true;
      apiUrl += `/${useBarrierTrials ? 'true' : 'false'}`;
    }
    
    console.log('Accessing FormDataService API via POST:', apiUrl);
    
    try {
      // Add API key as query parameter
      apiUrl += `?ApiKey=${API_KEY}`;
      
      // Make the request to the FormDataService API
      // Note: We're using GET method even though this is a POST endpoint in our API
      // This is because the FormDataService API uses GET requests
      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Accept': '*/*'  // Accept any content type as the API returns different formats
        },
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
        
        console.error('FormDataService API error response:', {
          status: response.status,
          statusText: response.statusText,
          errorData,
          errorText
        });
        
        // Return a clear error message
        return Response.json(
          {
            error: 'Error fetching data from FormDataService API',
            status: response.status,
            statusText: response.statusText,
            url: apiUrl,
            details: errorData || errorText,
            message: 'The FormDataService API is currently unavailable. Please check your API key and try again later.'
          },
          { status: response.status }
        );
      }
      
      // For most endpoints, the response is a caret (^) delimited list of strings
      // We need to parse this into a more usable format
      let data;
      const contentType = response.headers.get('content-type');
      
      if (contentType && contentType.includes('application/json')) {
        // If the response is JSON, parse it directly
        data = await response.json();
      } else {
        // Otherwise, assume it's a caret-delimited string
        const text = await response.text();
        
        // Parse the response based on the endpoint
        switch (endpoint) {
          case 'ExportMeetings':
            data = parseExportMeetingsResponse(text);
            break;
          case 'ExportRaces':
            data = parseExportRacesResponse(text);
            break;
          case 'ExportFields':
            data = parseExportFieldsResponse(text);
            break;
          case 'GetMeetings':
          case 'GetMeetingList':
            // These endpoints return JSON
            try {
              data = JSON.parse(text);
            } catch (e) {
              console.error('Error parsing JSON response:', e);
              data = { raw: text };
            }
            break;
          default:
            // For unknown endpoints, just return the raw text
            data = { raw: text };
        }
      }
      
      return Response.json({
        success: true,
        data,
        source: 'FormDataService API',
        endpoint,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching from FormDataService API:', error);
      
      // Return a clear error message
      return Response.json(
        {
          error: 'Error connecting to FormDataService API',
          message: 'Failed to connect to the FormDataService API. Please check your internet connection and try again later.',
          details: error.message,
          url: apiUrl
        },
        { status: 503 }
      );
    }
  } catch (error) {
    console.error('FormDataService API error:', error);
    
    // Return a clear error message
    return Response.json(
      {
        error: 'Service temporarily unavailable',
        message: 'We are experiencing technical difficulties with the FormDataService API. Please try again later.',
        details: error.message
      },
      { status: 503 }
    );
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

function getMockMeetings() {
  return [
    {
      "Key": "scone-20-4-2021",
      "Value": "Scone"
    },
    {
      "Key": "nowra-20-4-2021",
      "Value": "Nowra"
    }
  ];
}

function getMockMeetingList() {
  return [
    {
      "Key": "scone-20-4-2021",
      "Value": "Scone",
      "Date": "2021-04-20T00:00:00",
      "RaceCount": 8,
      "RaceNumbers": [1, 2, 3, 4, 5, 6, 7, 8]
    },
    {
      "Key": "nowra-20-4-2021",
      "Value": "Nowra",
      "Date": "2021-04-20T00:00:00",
      "RaceCount": 7,
      "RaceNumbers": [1, 2, 3, 4, 5, 6, 7]
    }
  ];
}