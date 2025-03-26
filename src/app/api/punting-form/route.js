// Punting Form API Integration
// This file integrates with the Punting Form API (https://www.puntingform.com.au/)

// API credentials - these should be stored in environment variables in production
// For now, we'll store them here for demonstration purposes
const API_BASE_URL = 'http://old.puntingform.com.au/api'; // Alternative URL suggested in documentation
let API_KEY = '5b0df8bf-da9a-4d1e-995d-9b7a002aa836'; // Default API key

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
    
    // Build the API URL based on the requested endpoint and parameters
    // The correct format is: baseUrl/service/endpoint/parameters?ApiKey=key
    // For example: https://www.puntingform.com.au/api/formdataservice/ExportMeetings/10-Apr-2021?ApiKey=12345
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
    } else if (endpoint === 'scratchings') {
      apiUrl += '/GetAllScratchings';
    } else if (endpoint === 'ratings') {
      apiUrl += '/GetRatings';
      
      // Add track and date parameters if provided
      if (track && date) {
        apiUrl += `/${track}/${date}`;
      }
    }
    
    const queryParams = new URLSearchParams();
    
    // Add API key to query parameters with the correct parameter name
    queryParams.append('ApiKey', API_KEY);
    
    // Add parameters if they exist
    if (date) queryParams.append('date', date);
    if (track) queryParams.append('track', track);
    if (raceNumber) queryParams.append('race_number', raceNumber);
    if (horseId) queryParams.append('horse_id', horseId);
    
    // Add query parameters to URL
    apiUrl += `?${queryParams.toString()}`;
    
    console.log('Fetching from Punting Form API:', apiUrl);
    
    try {
      // Make the request to the Punting Form API
      const response = await fetch(apiUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        // Add a timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
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
    
    // Build the API URL based on the requested endpoint and parameters
    // The correct format is: baseUrl/service/endpoint/parameters?ApiKey=key
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
    
    // Add specific endpoint based on the action
    if (action) {
      apiUrl += `/${action}`;
    }
    
    // Add API key as query parameter with the correct parameter name
    const queryParams = new URLSearchParams();
    queryParams.append('ApiKey', API_KEY);
    apiUrl += `?${queryParams.toString()}`;
    
    console.log('Posting to Punting Form API:', apiUrl);
    
    try {
      // Make the request to the Punting Form API
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(parameters || {}),
        // Add a timeout to prevent hanging
        signal: AbortSignal.timeout(5000)
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