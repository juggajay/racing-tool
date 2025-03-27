// Punting Form API Integration with Correct Endpoint Format
// Based on feedback from the API team

import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get required parameters from query
    const apiKey = searchParams.get('apiKey');
    const startDate = searchParams.get('startDate');
    
    // Validate required parameters
    if (!apiKey) {
      return NextResponse.json(
        {
          error: 'API key is required',
          message: 'Please provide an API key'
        },
        { status: 400 }
      );
    }
    
    if (!startDate) {
      return NextResponse.json(
        {
          error: 'Start date is required',
          message: 'Please provide a start date in DD-MMM-YYYY format (e.g., 01-Mar-2025)'
        },
        { status: 400 }
      );
    }
    
    // Build the API URL with the correct endpoint and parameters
    const apiUrl = `https://api.puntingform.com.au/v2/form/comment?startDate=${startDate}&apiKey=${apiKey}`;
    
    console.log(`Fetching from Punting Form API: ${apiUrl}`);
    
    // Make the request to the API
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
          error: 'API request failed',
          status: response.status,
          statusText: response.statusText,
          details: errorText
        },
        { status: response.status }
      );
    }
    
    // Parse the response
    const data = await response.json();
    
    // Return the data
    return NextResponse.json({
      success: true,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Punting Form API error:', error);
    
    return NextResponse.json(
      {
        error: 'Internal server error',
        message: error.message,
        details: 'An unexpected error occurred while processing your request'
      },
      { status: 500 }
    );
  }
}