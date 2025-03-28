// Punting Form API Integration
// Based on documentation:
// FormDataService: https://documenter.getpostman.com/view/10712595/TzJu8wZa
// ScratchingsService: https://documenter.getpostman.com/view/10712595/TzJuAy4a
// RatingsService: https://documenter.getpostman.com/view/10712595/TzJvdwbM

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


    // Get the endpoint from query parameters (e.g., "form/comment", "Updates/Scratchings", "Ratings/MeetingRatings")
    const endpointParam = searchParams.get('endpoint');

    // Base API URL
    const apiBaseUrl = 'https://api.puntingform.com.au/v2';

    // Date parameter (default to today)
    const date = searchParams.get('date') || formatDate(new Date());

    // Meeting ID parameter (used by several endpoints)
    const meetingId = searchParams.get('meetingId');

    // Race ID parameter
    const raceId = searchParams.get('raceId');

    // Horse ID parameter
    const horseId = searchParams.get('horseId');

    // Track Code parameter
    const trackCode = searchParams.get('trackCode');

    // Race Number parameter
    const raceNumber = searchParams.get('raceNumber');

    // End Date parameter
    const endDate = searchParams.get('endDate');

    // Include barrier trials parameter
    const includeBarrierTrials = searchParams.get('includeBarrierTrials') === 'true'; // Note: Check if PuntingForm API actually uses this

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
      'accept': 'application/json', // Default, might be overridden
      'X-API-KEY': apiKey
    };

    // Construct base URL part for different endpoints
    switch (endpointParam.toLowerCase()) { // Use lowercase for case-insensitivity
      // FormDataService
      case 'form/comment':
        apiUrl = `${apiBaseUrl}/form/comment?startDate=${date}`;
        break;
      case 'race':
        if (!raceId) return Response.json({ error: 'Race ID (raceId) is required for race endpoint' }, { status: 400 });
        apiUrl = `${apiBaseUrl}/race?raceid=${raceId}`;
        break;
      case 'horse':
        if (!horseId) return Response.json({ error: 'Horse ID (horseId) is required for horse endpoint' }, { status: 400 });
        apiUrl = `${apiBaseUrl}/horse?horseid=${horseId}`;
        break;
      case 'form/fields':
        apiUrl = `${apiBaseUrl}/form/fields?raceDate=${date}`;
        if (trackCode) apiUrl += `&trackCode=${trackCode}`;
        if (raceNumber) apiUrl += `&raceNumber=${raceNumber}`;
        headers['accept'] = 'text/csv';
        break;
      case 'form/results':
        apiUrl = `${apiBaseUrl}/form/results?startDate=${date}`;
        if (endDate) apiUrl += `&endDate=${endDate}`;
        if (trackCode) apiUrl += `&trackCode=${trackCode}`; // Assuming trackCode is used here too
        headers['accept'] = 'text/csv';
        break;
      case 'form/meetingslist': // Added based on support email example
         apiUrl = `${apiBaseUrl}/form/meetingslist?meetingDate=${date}`;
         break;
      case 'form/meeting': // Added based on support email example
         if (!meetingId) return Response.json({ error: 'Meeting ID (meetingId) is required for form/meeting endpoint' }, { status: 400 });
         apiUrl = `${apiBaseUrl}/form/meeting?meetingId=${meetingId}`;
         break;
      case 'form/form': // Added based on support email example
         if (!meetingId) return Response.json({ error: 'Meeting ID (meetingId) is required for form/form endpoint' }, { status: 400 });
         apiUrl = `${apiBaseUrl}/form/form?meetingId=${meetingId}`;
         break;

      // ScratchingsService
      case 'updates/scratchings': // Assuming endpoint path from docs/support email
        apiUrl = `${apiBaseUrl}/Updates/Scratchings?apiKey=${apiKey}`; // Scratchings might only need apiKey
        // Add optional date filter if needed and supported by the actual API
        // if (date) apiUrl += `&meetingDate=${date}`;
        break;

      // RatingsService
      case 'ratings/meetingratings': // Assuming endpoint path from docs/support email
        if (!meetingId) return Response.json({ error: 'Meeting ID (meetingId) is required for Ratings/MeetingRatings endpoint' }, { status: 400 });
        apiUrl = `${apiBaseUrl}/Ratings/MeetingRatings?meetingId=${meetingId}`;
        break;

      // Map 'races' endpoint for settings test
      case 'races':
         console.warn("'/api/punting-form?endpoint=races' called (likely from settings test). Mapping to 'form/comment'.");
         apiUrl = `${apiBaseUrl}/form/comment?startDate=${date}`;
         break;

      default:
        return Response.json(
          { error: `Invalid or unsupported endpoint '${endpointParam}'.` },
          { status: 400 }
        );
    }

    // Append apiKey to query string as well (belt and suspenders)
    apiUrl += `&apiKey=${apiKey}`;

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
      try { errorText = await response.text(); } catch (e) { errorText = 'Could not extract error details'; }
      console.error('Punting Form API error response:', { status: response.status, statusText: response.statusText, url: apiUrl, errorText });
      if (response.status === 401 || (errorText && errorText.includes('Authentication Failed'))) {
         return Response.json({ error: 'Authentication Failed', message: 'Invalid Punting Form API key provided.', details: errorText.substring(0, 200) }, { status: 401 });
      }
      return Response.json({ error: 'Punting Form API request failed', status: response.status, statusText: response.statusText, details: errorText.substring(0, 200) }, { status: response.status });
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
    return Response.json({ success: true, endpoint: endpointParam, data, timestamp: new Date().toISOString() });

  } catch (error) {
    console.error('Punting Form Proxy API error:', error);
     if (error.name === 'TimeoutError') {
       return Response.json({ error: 'Request Timeout', message: 'The request to the Punting Form API timed out after 15 seconds.' }, { status: 504 });
     }
    return Response.json({ error: 'Internal Server Error', message: error.message, details: 'An unexpected error occurred while processing your request in the proxy API.' }, { status: 500 });
  }
}