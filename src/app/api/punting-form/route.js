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

    // --- Get API Key from Query Parameter ---
    let apiKey = searchParams.get('api_key');

    if (!apiKey) {
       console.error(`[${requestTimestamp}] API Key missing in query parameters.`);
       return Response.json(
         { error: 'API key is required', message: 'Please provide the Punting Form API key via the api_key query parameter or configure it in settings.' },
         { status: 401 }
       );
    }
    // --- End API Key Handling ---

    const endpointParam = searchParams.get('endpoint');
    const apiBaseUrl = 'https://api.puntingform.com.au/v2';
    const date = searchParams.get('date') || formatDate(new Date());
    const meetingId = searchParams.get('meetingId');
    const raceId = searchParams.get('raceId');
    const horseId = searchParams.get('horseId');
    const trackCode = searchParams.get('trackCode');
    const raceNumber = searchParams.get('raceNumber');
    const endDate = searchParams.get('endDate');

    if (!endpointParam) {
      console.error(`[${requestTimestamp}] Endpoint parameter missing.`);
      return Response.json({ error: 'Endpoint parameter is required' }, { status: 400 });
    }

    console.log(`[${requestTimestamp}] Processing endpoint: ${endpointParam}, Date: ${date}`);

    let apiUrl;
    let headers = { 'accept': 'application/json', 'X-API-KEY': apiKey };

    switch (endpointParam.toLowerCase()) {
      case 'form/meetingslist':
         apiUrl = `${apiBaseUrl}/form/meetingslist?meetingDate=${date}`;
         break;
      // ... (other cases remain the same) ...
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
      case 'updates/scratchings':
        apiUrl = `${apiBaseUrl}/Updates/Scratchings?apiKey=${apiKey}`; // Keep key here for this one based on example
        // Re-add date parameter if needed, check Punting Form docs for exact param name
        // apiUrl += `&meetingDate=${date}`;
        break;
      case 'ratings/meetingratings':
        if (!meetingId) return Response.json({ error: 'Meeting ID (meetingId) is required for Ratings/MeetingRatings endpoint' }, { status: 400 });
        apiUrl = `${apiBaseUrl}/Ratings/MeetingRatings?meetingId=${meetingId}`;
        break;
      case 'races':
         console.warn(`[${requestTimestamp}] '/api/punting-form?endpoint=races' called. Mapping to 'form/comment'.`);
         apiUrl = `${apiBaseUrl}/form/comment?startDate=${date}`;
         break;
      default:
        console.error(`[${requestTimestamp}] Invalid endpoint requested: ${endpointParam}`);
        return Response.json({ error: `Invalid or unsupported endpoint '${endpointParam}'.` }, { status: 400 });
    }

    // Append apiKey to query string as well
    apiUrl += `&apiKey=${apiKey}`;

    console.log(`[${requestTimestamp}] Fetching from Punting Form API URL: ${apiUrl}`);

    // Make the request to the API
    const response = await fetch(apiUrl, { method: 'GET', headers, signal: AbortSignal.timeout(15000) });
    const responseStatus = response.status;
    const responseStatusText = response.statusText;
    const responseContentType = response.headers.get('content-type');
    let responseBodyText = ''; // Variable to store raw response

    console.log(`[${requestTimestamp}] Punting Form API Response Status: ${responseStatus} ${responseStatusText}`);

    try {
        responseBodyText = await response.text(); // Read raw response first
    } catch (e) {
        responseBodyText = '(Could not read response body)';
        console.error(`[${requestTimestamp}] Error reading response body:`, e);
    }

    // Log raw response only for meetingslist for debugging, limit length
    if (endpointParam.toLowerCase() === 'form/meetingslist') {
        console.log(`[${requestTimestamp}] Raw response for meetingslist (truncated): ${responseBodyText.substring(0, 500)}`);
    }

    // Check if the response is successful
    if (!response.ok) {
      console.error(`[${requestTimestamp}] Punting Form API error response details:`, { status: responseStatus, statusText: responseStatusText, url: apiUrl, body: responseBodyText.substring(0, 500) });
      if (responseStatus === 401 || responseBodyText.includes('Authentication Failed')) {
         return Response.json({ error: 'Authentication Failed', message: 'Invalid Punting Form API key provided.', details: responseBodyText.substring(0, 200) }, { status: 401 });
      }
      return Response.json({ error: 'Punting Form API request failed', status: responseStatus, statusText: responseStatusText, details: responseBodyText.substring(0, 200) }, { status: responseStatus });
    }

    // Parse the response based on the content type (using the raw text we already read)
    let data;
    if (responseContentType && responseContentType.includes('application/json')) {
      try { data = JSON.parse(responseBodyText); } catch (e) { console.error(`[${requestTimestamp}] Failed to parse JSON response:`, e, responseBodyText.substring(0,500)); data = { parseError: e.message, raw: responseBodyText.substring(0,500) }; }
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
    return Response.json({ success: true, endpoint: endpointParam, data, timestamp: requestTimestamp }); // Use request timestamp

  } catch (error) {
    console.error(`[${requestTimestamp}] Punting Form Proxy API error:`, error);
     if (error.name === 'TimeoutError') {
       return Response.json({ error: 'Request Timeout', message: 'The request to the Punting Form API timed out after 15 seconds.' }, { status: 504 });
     }
    return Response.json({ error: 'Internal Server Error', message: error.message, details: 'An unexpected error occurred while processing your request in the proxy API.' }, { status: 500 });
  }
}