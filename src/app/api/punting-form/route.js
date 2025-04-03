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
  const requestTimestamp = new Date().toISOString(); // Timestamp for logging
  console.log(`[${requestTimestamp}] Punting Form Proxy Request Received`);

  try {
    const { searchParams } = new URL(request.url);

    // --- Get API Key from Environment Variable ---
    const apiKey = process.env.PUNTING_FORM_API_KEY;

    if (!apiKey) {
       console.error(`[${requestTimestamp}] PUNTING_FORM_API_KEY environment variable is not set.`);
       return Response.json(
         {
           error: 'API key not configured',
           message: 'The Punting Form API key needs to be configured in the server environment variables (PUNTING_FORM_API_KEY).'
         },
         { status: 500 } // Internal Server Error because config is missing
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
    // const includeBarrierTrials = searchParams.get('includeBarrierTrials') === 'true'; // Note: Check if PuntingForm API actually uses this

    // Validate required parameters
    if (!endpointParam) {
      console.error(`[${requestTimestamp}] Endpoint parameter missing.`);
      return Response.json({ error: 'Endpoint parameter is required' }, { status: 400 });
    }

    console.log(`[${requestTimestamp}] Processing endpoint: ${endpointParam}, Date: ${date}`);

    let apiUrl;
    let headers = { 'accept': 'application/json', 'X-API-KEY': apiKey };

    // Construct base URL part for different endpoints
    switch (endpointParam.toLowerCase()) { // Use lowercase for case-insensitivity
      // FormDataService
      case 'form/meetingslist':
         // If a specific date is provided, use it
         if (date) {
            apiUrl = `${apiBaseUrl}/form/meetingslist?meetingDate=${date}`;
            console.log(`[${requestTimestamp}] Using provided date for meetingslist: ${date}`);
         } else {
            // If no date is provided, default to today
            const today = formatDate(new Date());
            apiUrl = `${apiBaseUrl}/form/meetingslist?meetingDate=${today}`;
            console.log(`[${requestTimestamp}] Using default date (today) for meetingslist: ${today}`);
         }
         break;
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
        if (trackCode) apiUrl += `&trackCode=${trackCode}`;
        headers['accept'] = 'text/csv';
        break;
      case 'form/meeting':
         if (!meetingId) return Response.json({ error: 'Meeting ID (meetingId) is required for form/meeting endpoint' }, { status: 400 });
         apiUrl = `${apiBaseUrl}/form/meeting?meetingId=${meetingId}`;
         break;
      case 'form/form':
         if (!meetingId) return Response.json({ error: 'Meeting ID (meetingId) is required for form/form endpoint' }, { status: 400 });
         apiUrl = `${apiBaseUrl}/form/form?meetingId=${meetingId}`;
         break;

      // ScratchingsService
      case 'updates/scratchings':
        apiUrl = `${apiBaseUrl}/Updates/Scratchings?apiKey=${apiKey}`;
        // if (date) apiUrl += `&meetingDate=${date}`; // Check Punting Form docs
        break;

      // RatingsService
      case 'ratings/meetingratings':
        if (!meetingId) return Response.json({ error: 'Meeting ID (meetingId) is required for Ratings/MeetingRatings endpoint' }, { status: 400 });
        apiUrl = `${apiBaseUrl}/Ratings/MeetingRatings?meetingId=${meetingId}`;
        break;

      // Map 'races' endpoint for settings test (no longer needed as settings UI removed)
      // case 'races':
      //    console.warn(`[${requestTimestamp}] '/api/punting-form?endpoint=races' called. Mapping to 'form/comment'.`);
      //    apiUrl = `${apiBaseUrl}/form/comment?startDate=${date}`;
      //    break;

      default:
        console.error(`[${requestTimestamp}] Invalid endpoint requested: ${endpointParam}`);
        return Response.json({ error: `Invalid or unsupported endpoint '${endpointParam}'.` }, { status: 400 });
    }

    // Append apiKey to query string as well (belt and suspenders)
    apiUrl += `&apiKey=${apiKey}`;

    console.log(`[${requestTimestamp}] Fetching from Punting Form API URL: ${apiUrl}`);

    // Make the request to the API
    const response = await fetch(apiUrl, { method: 'GET', headers, signal: AbortSignal.timeout(15000) });
    const responseStatus = response.status;
    const responseStatusText = response.statusText;
    const responseContentType = response.headers.get('content-type');
    let responseBodyText = '';

    console.log(`[${requestTimestamp}] Punting Form API Response Status: ${responseStatus} ${responseStatusText}`);

    try {
        responseBodyText = await response.text();
    } catch (e) {
        responseBodyText = '(Could not read response body)';
        console.error(`[${requestTimestamp}] Error reading response body:`, e);
    }

    // Log raw response only for meetingslist for debugging, limit length
    if (endpointParam.toLowerCase() === 'form/meetingslist') {
        console.log(`[${requestTimestamp}] Raw response for meetingslist (truncated): ${responseBodyText.substring(0, 500)}`);
        
        // Try to parse the response to see its structure
        try {
            const parsedResponse = JSON.parse(responseBodyText);
            console.log(`[${requestTimestamp}] Parsed meetingslist response structure:`, {
                status: parsedResponse.status,
                statusCode: parsedResponse.statusCode,
                hasError: !!parsedResponse.error,
                errorMessage: parsedResponse.error,
                hasPayload: !!parsedResponse.payload,
                payloadType: parsedResponse.payload ? typeof parsedResponse.payload : 'undefined',
                isPayloadArray: Array.isArray(parsedResponse.payload),
                payloadLength: Array.isArray(parsedResponse.payload) ? parsedResponse.payload.length : 0
            });
            
            // If payload is empty array, log a more specific message
            if (Array.isArray(parsedResponse.payload) && parsedResponse.payload.length === 0) {
                console.log(`[${requestTimestamp}] Punting Form API returned empty meetings array for date: ${date}`);
            }
        } catch (e) {
            console.error(`[${requestTimestamp}] Failed to parse meetingslist response for logging:`, e);
        }
    }

    // Check if the response is successful
    if (!response.ok) {
      console.error(`[${requestTimestamp}] Punting Form API error response details:`, { status: responseStatus, statusText: responseStatusText, url: apiUrl, body: responseBodyText.substring(0, 500) });
      if (responseStatus === 401 || responseBodyText.includes('Authentication Failed')) {
         return Response.json({ error: 'Authentication Failed', message: 'Invalid Punting Form API key provided (check environment variable PUNTING_FORM_API_KEY).', details: responseBodyText.substring(0, 200) }, { status: 401 });
      }
      return Response.json({ error: 'Punting Form API request failed', status: responseStatus, statusText: responseStatusText, details: responseBodyText.substring(0, 200) }, { status: responseStatus });
    }

    // Parse the response based on the content type
    let data;
    if (responseContentType && responseContentType.includes('application/json')) {
      try {
        data = JSON.parse(responseBodyText);
        
        // Special handling for meetingslist endpoint based on API documentation
        if (endpointParam.toLowerCase() === 'form/meetingslist') {
          console.log(`[${requestTimestamp}] Meetingslist response structure:`, {
            hasPayload: !!data.payload,
            isPayloadArray: !!(data.payload && Array.isArray(data.payload)),
            payloadLength: data.payload ? data.payload.length : 0
          });
          
          // If the response has a payload property and it's an array, that's where the meetings are
          if (data.payload && Array.isArray(data.payload)) {
            console.log(`[${requestTimestamp}] Found ${data.payload.length} meetings in payload array`);
          } else {
            console.log(`[${requestTimestamp}] No meetings found in payload or payload is not an array`);
          }
        }
      } catch (e) {
        console.error(`[${requestTimestamp}] Failed to parse JSON response:`, e, responseBodyText.substring(0,500));
        data = { parseError: e.message, raw: responseBodyText.substring(0,500) };
      }
    } else if (responseContentType && responseContentType.includes('text/csv')) {
      data = responseBodyText;
    } else {
      data = responseBodyText;
      if (data.startsWith('{') || data.startsWith('[')) {
        try { data = JSON.parse(data); } catch (e) { /* Keep as text */ }
      }
    }

    // Return the data
    console.log(`[${requestTimestamp}] Successfully processed endpoint ${endpointParam}.`);
    return Response.json({ success: true, endpoint: endpointParam, data, timestamp: requestTimestamp });

  } catch (error) {
    console.error(`[${requestTimestamp}] Punting Form Proxy API error:`, error);
     if (error.name === 'TimeoutError') {
       return Response.json({ error: 'Request Timeout', message: 'The request to the Punting Form API timed out after 15 seconds.' }, { status: 504 });
     }
    return Response.json({ error: 'Internal Server Error', message: error.message, details: 'An unexpected error occurred while processing your request in the proxy API.' }, { status: 500 });
  }
}