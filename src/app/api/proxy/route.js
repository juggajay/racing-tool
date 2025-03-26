// Proxy API for Punting Form
// This forwards requests from the client to the Punting Form API

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get the endpoint and API key from query parameters
    const endpoint = searchParams.get('endpoint') || 'comment';
    const apiKey = searchParams.get('apiKey') || '5b0df8bf-da9a-4d1e-995d-9b7a002aa836';
    
    // Build the API URL
    const apiUrl = `https://api.puntingform.com.au/v2/${endpoint}`;
    
    console.log(`Proxying request to: ${apiUrl}`);
    
    // Make the request to the API with proper headers
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': apiKey
      }
    });
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    return Response.json({
      success: response.ok,
      status: response.status,
      data,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Proxy API error:', error);
    
    return Response.json(
      {
        error: 'Proxy API error',
        message: error.message,
        details: 'An error occurred while proxying the request'
      },
      { status: 500 }
    );
  }
}