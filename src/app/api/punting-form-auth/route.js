// Punting Form API Integration with Different Authentication Methods
// This tries multiple ways of passing the API key to find the correct method

import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters from query
    const apiKey = searchParams.get('apiKey') || '5b0df8bf-da9a-4d1e-995d-9b7a002aa836';
    const authMethod = searchParams.get('authMethod') || 'query';
    
    // Format today's date as DD-MMM-YYYY
    const today = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const day = String(today.getDate()).padStart(2, '0');
    const month = months[today.getMonth()];
    const year = today.getFullYear();
    const formattedDate = `${day}-${month}-${year}`;
    
    // Build the API URL based on the authentication method
    let apiUrl = '';
    let headers = {
      'accept': 'application/json'
    };
    
    switch (authMethod) {
      case 'query':
        // Method 1: API key in query string
        apiUrl = `https://api.puntingform.com.au/v2/form/comment?startDate=${formattedDate}&apiKey=${apiKey}`;
        break;
        
      case 'header':
        // Method 2: API key in X-API-KEY header
        apiUrl = `https://api.puntingform.com.au/v2/form/comment?startDate=${formattedDate}`;
        headers['X-API-KEY'] = apiKey;
        break;
        
      case 'auth-header':
        // Method 3: API key in Authorization header
        apiUrl = `https://api.puntingform.com.au/v2/form/comment?startDate=${formattedDate}`;
        headers['Authorization'] = `Bearer ${apiKey}`;
        break;
        
      case 'api-key-header':
        // Method 4: API key in api-key header
        apiUrl = `https://api.puntingform.com.au/v2/form/comment?startDate=${formattedDate}`;
        headers['api-key'] = apiKey;
        break;
        
      default:
        return NextResponse.json(
          { error: 'Invalid authentication method' },
          { status: 400 }
        );
    }
    
    console.log(`Trying authentication method: ${authMethod}`);
    console.log(`API URL: ${apiUrl}`);
    console.log(`Headers: ${JSON.stringify(headers)}`);
    
    // Make the request to the API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers,
      // Add a timeout to prevent hanging
      signal: AbortSignal.timeout(15000), // 15 seconds timeout
      // Ensure we're not using cached responses
      cache: 'no-store'
    });
    
    // Get the response status and text
    const status = response.status;
    const statusText = response.statusText;
    
    // Try to parse the response as JSON
    let data;
    let responseText;
    
    try {
      // Try to get the response as text first
      responseText = await response.text();
      
      // Then try to parse it as JSON if possible
      try {
        data = JSON.parse(responseText);
      } catch (e) {
        // If it's not valid JSON, just use the text
        data = { text: responseText };
      }
    } catch (e) {
      data = { error: 'Could not read response' };
    }
    
    // Return the result
    return NextResponse.json({
      success: response.ok,
      authMethod,
      status,
      statusText,
      data,
      headers: Object.fromEntries(response.headers.entries()),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('API error:', error);
    
    return NextResponse.json(
      {
        error: 'API request failed',
        message: error.message,
        details: 'An error occurred while making the API request'
      },
      { status: 500 }
    );
  }
}