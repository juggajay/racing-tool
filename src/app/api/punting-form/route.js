// Punting Form API Integration
// Based on documentation: https://documenter.getpostman.com/view/10712595/TzJu8wZa

import fs from 'fs';
import path from 'path';

// Path to the settings file
const settingsFilePath = path.join(process.cwd(), 'data', 'settings', 'punting-form-api.json');

// Get settings from the settings file
const getSettings = () => {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const settingsData = fs.readFileSync(settingsFilePath, 'utf8');
      return JSON.parse(settingsData);
    }
  } catch (error) {
    console.error('Error reading settings file:', error);
  }
  
  // Return default settings if file doesn't exist or there's an error
  return {
    apiKey: '5b0df8bf-da9a-4d1e-995d-9b7a002aa836', // Default API key
    endpoint: 'https://www.puntingform.com.au/api',
    isValid: false
  };
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get settings from the settings file
    const settings = getSettings();
    
    // Get the endpoint from query parameters
    const endpointParam = searchParams.get('endpoint');
    
    // API key from settings
    const apiKey = settings.apiKey;
    
    // Base API URL from settings
    const apiBaseUrl = settings.endpoint || 'https://www.puntingform.com.au/api';
    
    // Date parameter (default to today)
    const date = searchParams.get('date') || new Date().toISOString().split('T')[0];
    
    // Race ID parameter (for GetRatings endpoint)
    const raceId = searchParams.get('raceId');
    
    // Include barrier trials parameter
    const includeBarrierTrials = searchParams.get('includeBarrierTrials') === 'true';
    
    // Check if API key is available
    if (!apiKey) {
      return Response.json(
        {
          error: 'API key is not configured',
          message: 'Please configure your Punting Form API key in the settings page'
        },
        { status: 401 }
      );
    }
    
    // Validate required parameters
    if (!endpointParam) {
      return Response.json(
        { error: 'Endpoint parameter is required' },
        { status: 400 }
      );
    }
    
    // Determine which service to use based on the endpoint
    let service = '';
    
    if (['ExportMeetings', 'ExportRaces', 'ExportFields'].includes(endpointParam)) {
      service = 'formdataservice';
    } else if (endpointParam === 'GetAllScratchings') {
      service = 'scratchingsservice';
    } else if (endpointParam === 'GetRatings') {
      service = 'ratingsservice';
    } else {
      return Response.json(
        { error: 'Invalid endpoint' },
        { status: 400 }
      );
    }
    
    // Build the API URL according to the documentation
    let apiUrl = `${apiBaseUrl}/${service}/${endpointParam}/${date}`;
    
    // Add includeBarrierTrials parameter for endpoints that support it
    if (['ExportMeetings', 'ExportRaces', 'ExportFields'].includes(endpointParam)) {
      apiUrl += `/${includeBarrierTrials ? 'true' : 'false'}`;
    }
    
    // Add raceId parameter for GetRatings endpoint
    if (endpointParam === 'GetRatings' && raceId) {
      apiUrl += `/${raceId}`;
    }
    
    // Add API key as query parameter
    apiUrl += `?ApiKey=${apiKey}`;
    
    console.log(`Fetching from Punting Form API: ${apiUrl}`);
    
    // Make the request to the API with proper headers
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Accept': '*/*',
        'User-Agent': 'Racing-Tool/1.0'
      },
      // Add a timeout to prevent hanging
      signal: AbortSignal.timeout(15000) // 15 seconds timeout
    });
    
    // Check if the response is successful
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
      
      return Response.json(
        { 
          error: 'API request failed',
          status: response.status,
          statusText: response.statusText,
          details: errorText
        },
        { status: response.status }
      );
    }
    
    // Parse the response based on the content type
    let data;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
      
      // Try to parse as JSON if it looks like JSON
      if (data.startsWith('{') || data.startsWith('[')) {
        try {
          data = JSON.parse(data);
        } catch (e) {
          // Keep as text if parsing fails
        }
      }
    }
    
    // Return the data
    return Response.json({
      success: true,
      endpoint,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Punting Form API error:', error);
    
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