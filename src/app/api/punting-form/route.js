// Punting Form API Integration
// Based on documentation: https://documenter.getpostman.com/view/10712595/TzJu8wZa

import fs from 'fs';
import path from 'path';

// Format date as DD-Mon-YYYY (e.g., 01-Mar-2025)
function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);

    // --- Get API Key from Query Parameter ---
    let apiKey = searchParams.get('api_key');

    if (!apiKey) {
       return Response.json(
         {
           error: 'API key is required',
           message: 'Please provide the Punting Form API key via the api_key query parameter or configure it in settings.'
         },
         { status: 401 }
       );
    }
    // --- End API Key Handling ---


    // Get the endpoint from query parameters
    const endpointParam = searchParams.get('endpoint');

    // --- Updated Base API URL based on documentation ---
    // Documentation mentions http://www.puntingform.com.au/api/xxxx
    // Assuming v2 is correct and using HTTPS for security.
    const apiBaseUrl = 'https://www.puntingform.com.au/api/v2';
    // --- End URL Update ---

    // Date parameter (default to today)
    const date = searchParams.get('date') || formatDate(new Date());

    // Race ID parameter (for GetRatings endpoint)
    const raceId = searchParams.get('raceId');

    // Include barrier trials parameter
    const includeBarrierTrials = searchParams.get('includeBarrierTrials') === 'true';

    // Validate required parameters
    if (!endpointParam) {
      return Response.json(
        { error: 'Endpoint parameter is required' },
        { status: 400 }
      );
    }

    // Build the API URL based on the endpoint
    let apiUrl;
    let headers = {
      'accept': 'application/json',
      'X-API-KEY': apiKey // Use the apiKey from query param
    };

    switch (endpointParam) {
      case 'form/comment':
        apiUrl = `${apiBaseUrl}/form/comment?startDate=${date}`;
        break;
      case 'race':
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
      case 'form/fields':
        apiUrl = `${apiBaseUrl}/form/fields?raceDate=${date}`;

        // Add optional parameters if provided
        const trackCode = searchParams.get('trackCode');
        const raceNumber = searchParams.get('raceNumber');

        if (trackCode) {
          apiUrl += `&trackCode=${trackCode}`;
        }

        if (raceNumber) {
          apiUrl += `&raceNumber=${raceNumber}`;
        }

        // Request CSV format for fields
        headers['accept'] = 'text/csv';
        break;
      case 'form/results':
        apiUrl = `${apiBaseUrl}/form/results?startDate=${date}`;

        // Add optional parameters if provided
        const endDate = searchParams.get('endDate');
        const trackCodeResults = searchParams.get('trackCode');

        if (endDate) {
          apiUrl += `&endDate=${endDate}`;
        }

        if (trackCodeResults) {
          apiUrl += `&trackCode=${trackCodeResults}`;
        }

        // Request CSV format for results
        headers['accept'] = 'text/csv';
        break;
      // Map 'races' endpoint for settings test
      case 'races':
         console.warn("'/api/punting-form?endpoint=races' called (likely from settings test). Mapping to 'form/comment'.");
         apiUrl = `${apiBaseUrl}/form/comment?startDate=${date}`;
         break;
      default:
        return Response.json(
          { error: `Invalid endpoint '${endpointParam}'. Supported endpoints are: form/comment, race, horse, form/fields, form/results` },
          { status: 400 }
        );
    }

    // Add API key to the URL (Punting Form API requires it in header)
    // apiUrl += `&apiKey=${apiKey}`; // Redundant

    console.log(`Fetching from Punting Form API: ${apiUrl}`);

    // Make the request to the API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
      signal: AbortSignal.timeout(15000) // 15 seconds timeout
    });

    // Check if the response is successful
    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Could not extract error details';
      }

      console.error('Punting Form API error response:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        errorText
      });

      // Check for specific authentication error
      if (response.status === 401 || (errorText && errorText.includes('Authentication Failed'))) {
         return Response.json(
           {
             error: 'Authentication Failed',
             message: 'Invalid Punting Form API key provided.',
             details: errorText.substring(0, 200) // Limit details length
           },
           { status: 401 }
         );
      }

      return Response.json(
        {
          error: 'Punting Form API request failed',
          status: response.status,
          statusText: response.statusText,
          details: errorText.substring(0, 200) // Limit details length
        },
        { status: response.status }
      );
    }

    // Parse the response based on the content type
    let data;
    const contentType = response.headers.get('content-type');

    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else if (contentType && contentType.includes('text/csv')) {
      data = await response.text();
    } else {
      data = await response.text();
      if (data.startsWith('{') || data.startsWith('[')) {
        try { data = JSON.parse(data); } catch (e) { /* Keep as text */ }
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
    console.error('Punting Form Proxy API error:', error);

     if (error.name === 'TimeoutError') {
       return Response.json(
         {
           error: 'Request Timeout',
           message: 'The request to the Punting Form API timed out after 15 seconds.',
         },
         { status: 504 } // Gateway Timeout
       );
     }

    return Response.json(
      {
        error: 'Internal Server Error',
        message: error.message,
        details: 'An unexpected error occurred while processing your request in the proxy API.'
      },
      { status: 500 }
    );
  }
}