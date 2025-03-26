// Racing Data API Integration with Punting Form API
// Based on the FormDataService API documentation: https://documenter.getpostman.com/view/10712595/TzJu8wZa

// API credentials - these should be stored in environment variables in production
const API_BASE_URL = 'https://www.puntingform.com.au/api';
const API_KEY = '5b0df8bf-da9a-4d1e-995d-9b7a002aa836'; // User's API key

// Configuration
const USE_MOCK_DATA = true; // Set to true for development/testing without making real API calls
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache duration in milliseconds

// In-memory cache
const cache = {
  meetings: { data: null, timestamp: 0 },
  races: { data: {}, timestamp: {} },
  fields: { data: {}, timestamp: {} },
  scratchings: { data: null, timestamp: 0 },
  ratings: { data: {}, timestamp: {} }
};

// Helper function to format date in the required format (d-MMM-yyyy)
function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Helper function to parse ISO date string to formatted date
function parseAndFormatDate(dateString) {
  try {
    const date = new Date(dateString);
    return formatDate(date);
  } catch (e) {
    console.error('Error parsing date:', e);
    return formatDate(new Date()); // Default to today
  }
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

// Function to fetch data from the Punting Form API
async function fetchFromPuntingFormAPI(endpoint, date, includeBarrierTrials = false, raceId = null) {
  // If using mock data, return mock data
  if (USE_MOCK_DATA) {
    console.log('Using mock data for Punting Form API');
    return getMockData(endpoint, raceId);
  }

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
  
  // Add raceId parameter for GetRatings endpoint
  if (endpoint === 'GetRatings' && raceId) {
    apiUrl += `/${raceId}`;
  }
  
  // Add API key as query parameter
  apiUrl += `?ApiKey=${API_KEY}`;
  
  console.log(`Fetching from Punting Form API: ${apiUrl}`);
  
  try {
    // Make the request to the API
    const response = await fetch(apiUrl, {
      headers: {
        'Accept': '*/*',  // Accept any content type as the API returns different formats
        'User-Agent': 'Racing-Tool/1.0' // Add a user agent to identify the client
      },
      // Add a timeout to prevent hanging
      signal: AbortSignal.timeout(15000) // 15 seconds timeout
    });
    
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
      
      throw new Error(`API error: ${response.status} ${response.statusText} - ${errorText}`);
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
        default:
          // For unknown endpoints, just return the raw text
          data = { raw: text };
      }
    }
    
    return data;
  } catch (error) {
    console.error(`Error fetching from Punting Form API (${endpoint}):`, error);
    throw error;
  }
}

// Function to check if cache is valid
function isCacheValid(cacheEntry) {
  return cacheEntry.data && (Date.now() - cacheEntry.timestamp < CACHE_DURATION);
}

// Main API handler
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const endpoint = searchParams.get('endpoint') || 'ExportMeetings'; // Default endpoint
    const dateParam = searchParams.get('date');
    const date = dateParam ? parseAndFormatDate(dateParam) : formatDate(new Date()); // Default to today
    const includeBarrierTrials = searchParams.get('includeBarrierTrials') === 'true'; // Default to false
    const raceId = searchParams.get('raceId'); // For GetRatings endpoint
    const meetingId = searchParams.get('meetingId'); // For filtering races
    const skipCache = searchParams.get('skipCache') === 'true'; // Option to bypass cache
    
    let data;
    
    // Check cache based on endpoint
    if (!skipCache) {
      if (endpoint === 'ExportMeetings' && isCacheValid(cache.meetings)) {
        data = cache.meetings.data;
        console.log('Using cached meetings data');
      } else if (endpoint === 'ExportRaces' && meetingId && cache.races.data[meetingId] && isCacheValid({ data: true, timestamp: cache.races.timestamp[meetingId] })) {
        data = cache.races.data[meetingId];
        console.log(`Using cached races data for meeting ${meetingId}`);
      } else if (endpoint === 'ExportFields' && raceId && cache.fields.data[raceId] && isCacheValid({ data: true, timestamp: cache.fields.timestamp[raceId] })) {
        data = cache.fields.data[raceId];
        console.log(`Using cached fields data for race ${raceId}`);
      }
    }
    
    // If no valid cache, fetch from API
    if (!data) {
      try {
        data = await fetchFromPuntingFormAPI(endpoint, date, includeBarrierTrials, raceId);
        
        // Update cache
        if (endpoint === 'ExportMeetings') {
          cache.meetings.data = data;
          cache.meetings.timestamp = Date.now();
        } else if (endpoint === 'ExportRaces' && meetingId) {
          // Filter races by meetingId if provided
          const filteredData = data.filter(race => race.meetingId.toString() === meetingId);
          cache.races.data[meetingId] = filteredData;
          cache.races.timestamp[meetingId] = Date.now();
          data = filteredData;
        } else if (endpoint === 'ExportFields' && raceId) {
          // Filter fields by raceId if provided
          const filteredData = data.filter(field => field.raceId.toString() === raceId);
          cache.fields.data[raceId] = filteredData;
          cache.fields.timestamp[raceId] = Date.now();
          data = filteredData;
        }
      } catch (error) {
        return Response.json(
          {
            error: 'Error fetching data from Punting Form API',
            message: error.message,
            endpoint,
            date
          },
          { status: 503 }
        );
      }
    }
    
    // Process data based on endpoint and parameters
    let processedData = data;
    
    // For ExportMeetings, we might want to include races for each meeting
    if (endpoint === 'ExportMeetings') {
      // If we have races data in cache, add them to the meetings
      for (const meeting of processedData) {
        const meetingId = meeting.meetingId.toString();
        if (cache.races.data[meetingId]) {
          meeting.races = cache.races.data[meetingId];
        }
      }
    }
    
    // For ExportRaces, filter by meetingId if provided
    if (endpoint === 'ExportRaces' && meetingId) {
      processedData = processedData.filter(race => race.meetingId.toString() === meetingId);
    }
    
    // For ExportFields, filter by raceId if provided
    if (endpoint === 'ExportFields' && raceId) {
      processedData = processedData.filter(field => field.raceId.toString() === raceId);
    }
    
    return Response.json({
      success: true,
      data: processedData,
      source: 'Punting Form API',
      endpoint,
      date,
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

// POST endpoint for more complex operations
export async function POST(request) {
  try {
    const body = await request.json();
    
    // Extract parameters from the request body
    const { action, date, includeBarrierTrials, raceId, meetingId } = body;
    
    if (!action) {
      return Response.json(
        { error: 'Action is required' },
        { status: 400 }
      );
    }
    
    // Format date or use today's date
    const formattedDate = date ? parseAndFormatDate(date) : formatDate(new Date());
    
    // Handle different actions
    if (action === 'getMeetingsWithRaces') {
      try {
        // First, get all meetings
        let meetings;
        
        // Check cache
        if (isCacheValid(cache.meetings)) {
          meetings = cache.meetings.data;
          console.log('Using cached meetings data');
        } else {
          meetings = await fetchFromPuntingFormAPI('ExportMeetings', formattedDate, includeBarrierTrials);
          cache.meetings.data = meetings;
          cache.meetings.timestamp = Date.now();
        }
        
        // For each meeting, get races
        for (const meeting of meetings) {
          const meetingId = meeting.meetingId.toString();
          
          // Check cache for races
          if (cache.races.data[meetingId] && isCacheValid({ data: true, timestamp: cache.races.timestamp[meetingId] })) {
            meeting.races = cache.races.data[meetingId];
            console.log(`Using cached races data for meeting ${meetingId}`);
          } else {
            try {
              const races = await fetchFromPuntingFormAPI('ExportRaces', formattedDate, includeBarrierTrials);
              const meetingRaces = races.filter(race => race.meetingId.toString() === meetingId);
              meeting.races = meetingRaces;
              
              // Update cache
              cache.races.data[meetingId] = meetingRaces;
              cache.races.timestamp[meetingId] = Date.now();
            } catch (error) {
              console.error(`Error fetching races for meeting ${meetingId}:`, error);
              meeting.races = [];
              meeting.error = 'Failed to fetch races for this meeting';
            }
          }
        }
        
        return Response.json({
          success: true,
          data: meetings,
          source: 'Punting Form API',
          date: formattedDate,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        return Response.json(
          {
            error: 'Error fetching meetings with races',
            message: error.message
          },
          { status: 503 }
        );
      }
    }
    
    if (action === 'getRaceWithFields') {
      if (!raceId) {
        return Response.json(
          { error: 'Race ID is required' },
          { status: 400 }
        );
      }
      
      try {
        // Get race details
        let races;
        let race;
        
        // If meetingId is provided, we can use it to get races more efficiently
        if (meetingId) {
          // Check cache for races
          if (cache.races.data[meetingId] && isCacheValid({ data: true, timestamp: cache.races.timestamp[meetingId] })) {
            races = cache.races.data[meetingId];
            console.log(`Using cached races data for meeting ${meetingId}`);
          } else {
            races = await fetchFromPuntingFormAPI('ExportRaces', formattedDate, includeBarrierTrials);
            const meetingRaces = races.filter(r => r.meetingId.toString() === meetingId);
            
            // Update cache
            cache.races.data[meetingId] = meetingRaces;
            cache.races.timestamp[meetingId] = Date.now();
            
            races = meetingRaces;
          }
          
          race = races.find(r => r.raceId.toString() === raceId);
        } else {
          // We need to get all races and find the one we want
          races = await fetchFromPuntingFormAPI('ExportRaces', formattedDate, includeBarrierTrials);
          race = races.find(r => r.raceId.toString() === raceId);
          
          if (race) {
            // Update cache for this meeting
            const meetingId = race.meetingId.toString();
            const meetingRaces = races.filter(r => r.meetingId.toString() === meetingId);
            cache.races.data[meetingId] = meetingRaces;
            cache.races.timestamp[meetingId] = Date.now();
          }
        }
        
        if (!race) {
          return Response.json(
            { error: 'Race not found' },
            { status: 404 }
          );
        }
        
        // Get fields for this race
        let fields;
        
        // Check cache for fields
        if (cache.fields.data[raceId] && isCacheValid({ data: true, timestamp: cache.fields.timestamp[raceId] })) {
          fields = cache.fields.data[raceId];
          console.log(`Using cached fields data for race ${raceId}`);
        } else {
          const allFields = await fetchFromPuntingFormAPI('ExportFields', formattedDate, includeBarrierTrials);
          fields = allFields.filter(field => field.raceId.toString() === raceId);
          
          // Update cache
          cache.fields.data[raceId] = fields;
          cache.fields.timestamp[raceId] = Date.now();
        }
        
        // Combine everything into a single response
        const result = {
          ...race,
          fields: fields
        };
        
        return Response.json({
          success: true,
          data: result,
          source: 'Punting Form API',
          date: formattedDate,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        return Response.json(
          {
            error: 'Error fetching race with fields',
            message: error.message
          },
          { status: 503 }
        );
      }
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

// Mock data functions for development and testing
function getMockData(endpoint, raceId, meetingId) {
  switch (endpoint) {
    case 'ExportMeetings':
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
          races: []
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
          races: []
        }
      ];
    case 'ExportRaces':
      const races = [
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
        },
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
      ];
      
      // Filter by meetingId if provided
      if (meetingId) {
        return races.filter(race => race.meetingId.toString() === meetingId);
      }
      
      return races;
    case 'ExportFields':
      const fields = [
        {
          fieldId: 123456,
          raceId: 868438,
          tabNo: 1,
          position: 1,
          margin: 0,
          horse: "Northern Star",
          trainer: "John Smith",
          jockey: "James Johnson",
          weight: 56.5,
          barrier: 3,
          inRun: "1-1-1",
          flucs: "6.0-5.5-6.5",
          priceSP: 6.5,
          priceTAB: 6.0
        },
        {
          fieldId: 123457,
          raceId: 868438,
          tabNo: 2,
          position: 2,
          margin: 0.5,
          horse: "Swift Thunder",
          trainer: "Mary Jones",
          jockey: "Sarah Williams",
          weight: 55.0,
          barrier: 5,
          inRun: "3-2-2",
          flucs: "8.0-7.5-8.0",
          priceSP: 8.0,
          priceTAB: 7.5
        },
        {
          fieldId: 123458,
          raceId: 868439,
          tabNo: 1,
          position: 1,
          margin: 0,
          horse: "Midnight Runner",
          trainer: "David Brown",
          jockey: "Michael Davis",
          weight: 57.0,
          barrier: 2,
          inRun: "2-1-1",
          flucs: "4.0-4.5-4.0",
          priceSP: 4.0,
          priceTAB: 4.2
        }
      ];
      
      // Filter by raceId if provided
      if (raceId) {
        return fields.filter(field => field.raceId.toString() === raceId);
      }
      
      return fields;
    default:
      return [];
  }
}
