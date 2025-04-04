import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Get the endpoint and other parameters from the query string
  const searchParams = request.nextUrl.searchParams;
  const endpoint = searchParams.get('endpoint');
  
  // Remove endpoint from searchParams to create a new object for API params
  const apiParams = new URLSearchParams();
  searchParams.forEach((value, key) => {
    if (key !== 'endpoint') {
      apiParams.append(key, value);
    }
  });
  
  // Get API key from environment variables
  const apiKey = process.env.PUNTING_FORM_API_KEY;
  if (!apiKey) {
    console.error('Punting Form API key not configured');
    return NextResponse.json(
      {
        success: false,
        error: 'Invalid Punting Form API key provided (check environment variable PUNTING_FORM_API_KEY).'
      },
      { status: 401 }
    );
  }
  
  // Log request details
  console.log(`[${new Date().toISOString()}] Punting Form Proxy Request Received`);
  console.log(`[${new Date().toISOString()}] Processing endpoint: ${endpoint}, Date: ${searchParams.get('date')}`);
  
  // Handle specific endpoints
  if (endpoint === 'form/meetingslist') {
    const meetingDate = searchParams.get('date');
    console.log(`[${new Date().toISOString()}] Using provided date for meetingslist: ${meetingDate}`);
    
    // Construct the API URL
    const apiUrl = `https://api.puntingform.com.au/v2/${endpoint}?meetingDate=${meetingDate}&apiKey=${apiKey}`;
    
    try {
      console.log(`[${new Date().toISOString()}] Fetching from Punting Form API URL: ${apiUrl}`);
      const response = await fetch(apiUrl);
      
      // Log response status
      console.log(`[${new Date().toISOString()}] Punting Form API Response Status: ${response.status} ${response.statusText}`);
      
      // Get response body
      const responseText = await response.text();
      console.log(`[${new Date().toISOString()}] Raw response for meetingslist (truncated): ${responseText.substring(0, 500)}...`);
      
      // Get content type
      const contentType = response.headers.get('content-type');
      console.log(`[${new Date().toISOString()}] Response content type: ${contentType}`);
      
      // Parse JSON response
      const data = JSON.parse(responseText);
      
      // Log response structure for debugging
      console.log(`[${new Date().toISOString()}] Parsed meetingslist response structure:`, {
        status: data.status,
        statusCode: data.statusCode,
        hasError: !!data.error,
        errorMessage: data.error || 'None',
        hasPayload: !!data.payLoad,
        payloadType: typeof data.payLoad,
        isPayloadArray: Array.isArray(data.payLoad),
        payloadLength: Array.isArray(data.payLoad) ? data.payLoad.length : 0
      });
      
      // Check if response is successful
      if (response.ok) {
        return NextResponse.json({
          success: true,
          data: data
        });
      } else {
        // Log error details
        console.log(`[${new Date().toISOString()}] Punting Form API error response details:`, {
          status: response.status,
          statusText: response.statusText,
          url: apiUrl,
          body: responseText
        });
        
        return NextResponse.json(
          {
            success: false,
            error: data.error || `API request failed: ${response.status} ${response.statusText}`
          },
          { status: response.status }
        );
      }
    } catch (error) {
      console.error(`[${new Date().toISOString()}] Error fetching from Punting Form API:`, error);
      return NextResponse.json(
        {
          success: false,
          error: `Error fetching from Punting Form API: ${error.message}`
        },
        { status: 500 }
      );
    }
  } else {
    // Handle other endpoints or return error for unsupported endpoints
    return NextResponse.json(
      {
        success: false,
        error: `Unsupported endpoint: ${endpoint}`
      },
      { status: 400 }
    );
  }
}