// Punting Form API Integration - Comments API
// This API fetches comments data from the Punting Form API

import { NextResponse } from 'next/server';

// Format date as DD-Mon-YYYY (e.g., 01-Mar-2025)
function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

// Validate date format (DD-Mon-YYYY)
function isValidDateFormat(dateStr) {
  const regex = /^\d{2}-(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)-\d{4}$/;
  return regex.test(dateStr);
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get startDate from query parameters or use today's date
    let startDate = searchParams.get('startDate') || formatDate(new Date());
    
    // Validate date format
    if (!isValidDateFormat(startDate)) {
      console.error(`Invalid date format: ${startDate}`);
      return NextResponse.json(
        {
          error: 'Invalid date format',
          message: 'Date must be in DD-Mon-YYYY format (e.g., 01-Mar-2025)'
        },
        { status: 400 }
      );
    }
    
    // Use the provided API key (double-check for typos)
    const apiKey = '5b0df8bf-da9a-4d1e-995d-9b7a002aa836';
    
    // Build the API URL with the required query parameters
    const apiUrl = `https://api.puntingform.com.au/v2/form/comment?startDate=${startDate}&apiKey=${apiKey}`;
    
    console.log(`Fetching comments from: ${apiUrl}`);
    
    // Make the request to the Punting Form API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json'
      },
      // Add a timeout to prevent hanging
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
      // Ensure we're not using cached responses
      cache: 'no-store'
    });
    
    // Log response status for debugging
    console.log(`API response status: ${response.status} ${response.statusText}`);
    
    // Check if the response is successful
    if (!response.ok) {
      // Try to get error details from response
      let errorText = '';
      let errorData = null;
      
      try {
        const responseText = await response.text();
        errorText = responseText;
        
        // Try to parse as JSON if possible
        try {
          errorData = JSON.parse(responseText);
        } catch (parseError) {
          // Not JSON, keep as text
        }
      } catch (e) {
        errorText = 'Could not extract error details';
      }
      
      console.error('API error response:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        errorText,
        errorData
      });
      
      return NextResponse.json(
        {
          error: 'Failed to fetch comments',
          status: response.status,
          statusText: response.statusText,
          details: errorText,
          data: errorData,
          requestUrl: apiUrl
        },
        { status: response.status }
      );
    }
    
    // Try to parse the response
    let data;
    try {
      data = await response.json();
    } catch (error) {
      console.error('Error parsing JSON response:', error);
      
      // Try to get the raw text
      const responseText = await response.text();
      
      return NextResponse.json(
        {
          error: 'Failed to parse API response',
          message: error.message,
          responseText: responseText.substring(0, 1000) // Limit text length
        },
        { status: 500 }
      );
    }
    
    // Return the comments data
    return NextResponse.json({
      success: true,
      startDate,
      comments: data,
      timestamp: new Date().toISOString(),
      requestUrl: apiUrl // Include the request URL for debugging
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch comments',
        message: error.message,
        details: 'An unexpected error occurred while fetching comments'
      },
      { status: 500 }
    );
  }
}