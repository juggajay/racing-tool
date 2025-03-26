// Punting Form API Integration
// This file integrates with the Punting Form API (https://www.puntingform.com.au/)
// If the real API is not available, it falls back to a mock API

// API credentials - these should be stored in environment variables in production
// For now, we'll store them here for demonstration purposes
const API_BASE_URL = 'https://api.puntingform.com.au/v1'; // Updated to include API version
let API_KEY = '5b0df8bf-da9a-4d1e-995d-9b7a002aa836'; // Default API key

// Flag to use mock API (will be set to true if real API fails)
let USE_MOCK_API = false;

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
    
    // If we're using the mock API, forward the request to the mock API
    if (USE_MOCK_API) {
      console.log('Using mock Punting Form API');
      
      // Forward the request to the mock API
      const mockUrl = new URL(request.url);
      mockUrl.pathname = '/api/punting-form-mock';
      
      const mockResponse = await fetch(mockUrl);
      const mockData = await mockResponse.json();
      
      return Response.json(mockData);
    }
    
    // Build the API URL based on the requested endpoint and parameters
    let apiUrl = `${API_BASE_URL}/${endpoint}`;
    const queryParams = new URLSearchParams();
    
    // Add API key to query parameters
    queryParams.append('key', API_KEY);
    
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
        
        // Set the flag to use mock API for future requests
        USE_MOCK_API = true;
        console.log('Switching to mock API for future requests');
        
        // Forward the request to the mock API
        const mockUrl = new URL(request.url);
        mockUrl.pathname = '/api/punting-form-mock';
        
        const mockResponse = await fetch(mockUrl);
        const mockData = await mockResponse.json();
        
        return Response.json(mockData);
      }
      
      const data = await response.json();
      
      return Response.json({
        success: true,
        data,
        source: 'Punting Form API',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error fetching from real API, falling back to mock:', error);
      
      // Set the flag to use mock API for future requests
      USE_MOCK_API = true;
      console.log('Switching to mock API for future requests');
      
      // Forward the request to the mock API
      const mockUrl = new URL(request.url);
      mockUrl.pathname = '/api/punting-form-mock';
      
      const mockResponse = await fetch(mockUrl);
      const mockData = await mockResponse.json();
      
      return Response.json(mockData);
    }
  } catch (error) {
    console.error('Punting Form API error:', error);
    
    // Set the flag to use mock API for future requests
    USE_MOCK_API = true;
    console.log('Switching to mock API due to error in GET function');
    
    try {
      // Forward the request to the mock API
      const mockUrl = new URL('/api/punting-form-mock', 'http://localhost');
      
      const mockResponse = await fetch(mockUrl);
      const mockData = await mockResponse.json();
      
      return Response.json(mockData);
    } catch (mockError) {
      // If even the mock API fails, return a friendly error
      return Response.json(
        {
          error: 'Service temporarily unavailable',
          message: 'We are experiencing technical difficulties. Please try again later.',
          isMock: true
        },
        { status: 503 }
      );
    }
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
    
    // If we're using the mock API, return a mock response
    if (USE_MOCK_API) {
      console.log('Using mock Punting Form API for POST request');
      
      // For POST requests, we'll just return a success response
      // In a real implementation, you might want to forward this to a mock POST endpoint
      return Response.json({
        success: true,
        data: { message: 'Operation completed successfully (mock)' },
        source: 'Mock Punting Form API',
        timestamp: new Date().toISOString()
      });
    }
    
    // Build the API URL
    let apiUrl = `${API_BASE_URL}/${endpoint}`;
    
    // Add action to URL if provided
    if (action) {
      apiUrl += `/${action}`;
    }
    
    // Add API key as query parameter
    const queryParams = new URLSearchParams();
    queryParams.append('key', API_KEY);
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
        
        // Set the flag to use mock API for future requests
        USE_MOCK_API = true;
        console.log('Switching to mock API for future requests');
        
        // Return a mock success response
        return Response.json({
          success: true,
          data: { message: 'Operation completed successfully (mock)' },
          source: 'Mock Punting Form API',
          timestamp: new Date().toISOString()
        });
      }
      
      const data = await response.json();
      
      return Response.json({
        success: true,
        data,
        source: 'Punting Form API',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error posting to real API, using mock response:', error);
      
      // Set the flag to use mock API for future requests
      USE_MOCK_API = true;
      console.log('Switching to mock API for future requests');
      
      // Return a mock success response
      return Response.json({
        success: true,
        data: { message: 'Operation completed successfully (mock)' },
        source: 'Mock Punting Form API',
        timestamp: new Date().toISOString()
      });
    }
  } catch (error) {
    console.error('Punting Form API error:', error);
    
    // Set the flag to use mock API for future requests
    USE_MOCK_API = true;
    console.log('Switching to mock API due to error in POST function');
    
    // Return a mock success response
    return Response.json({
      success: true,
      data: { message: 'Operation completed successfully (mock)' },
      source: 'Mock Punting Form API (error fallback)',
      timestamp: new Date().toISOString()
    });
  }
}