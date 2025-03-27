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

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get startDate from query parameters or use today's date
    const startDate = searchParams.get('startDate') || formatDate(new Date());
    
    // Use the provided API key
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
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch comments',
          status: response.status,
          statusText: response.statusText,
          details: errorText
        },
        { status: response.status }
      );
    }
    
    // Parse the response
    const data = await response.json();
    
    // Return the comments data
    return NextResponse.json({
      success: true,
      startDate,
      comments: data,
      timestamp: new Date().toISOString()
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