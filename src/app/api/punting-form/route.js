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
    
    // Map the endpoint parameter to the actual API endpoint
    let apiUrl = '';
    
    // Based on the official documentation: https://docs.puntingform.com.au/reference/comment-1
    switch (endpointParam) {
      case 'comment':
        apiUrl = `${apiBaseUrl}/comment`;
        break;
      case 'race':
        const raceId = searchParams.get('raceId');
        if (!raceId) {
          return Response.json(
            { error: 'Race ID is required for race endpoint' },
            { status: 400 }
          );
        }
        apiUrl = `${apiBaseUrl}/race?raceid=${raceId}`;
        break;
      case 'horse':
        const horseId = searchParams.get('horseId');
        if (!horseId) {
          return Response.json(
            { error: 'Horse ID is required for horse endpoint' },
            { status: 400 }
          );
        }
        apiUrl = `${apiBaseUrl}/horse?horseid=${horseId}`;
        break;
      default:
        return Response.json(
          { error: 'Invalid endpoint. Supported endpoints are: comment, race, horse' },
          { status: 400 }
        );
    }
    
    console.log(`Fetching from Punting Form API: ${apiUrl}`);
    
    console.log(`Fetching from Punting Form API: ${apiUrl}`);
    
    // Make the request to the API with proper headers
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': apiKey
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
      endpoint: endpointParam,
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