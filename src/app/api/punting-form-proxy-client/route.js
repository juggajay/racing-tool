// Client-side proxy for Punting Form API
// This uses the rewrite configuration in next.config.js

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get the endpoint and API key from query parameters
    const endpoint = searchParams.get('endpoint') || 'comment';
    const apiKey = searchParams.get('apiKey') || '5b0df8bf-da9a-4d1e-995d-9b7a002aa836';
    
    // Build the proxy URL using the rewrite configuration
    let proxyUrl = `/api/punting-form-proxy/${endpoint}`;
    
    // Add additional parameters if needed
    if (endpoint === 'race' && searchParams.get('raceId')) {
      proxyUrl += `?raceid=${searchParams.get('raceId')}`;
    } else if (endpoint === 'horse' && searchParams.get('horseId')) {
      proxyUrl += `?horseid=${searchParams.get('horseId')}`;
    }
    
    console.log(`Proxying request to: ${proxyUrl}`);
    
    // Make the request to the API with proper headers
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'X-API-KEY': apiKey
      }
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
        url: proxyUrl,
        errorText
      });
      
      return Response.json(
        { 
          error: 'API request failed',
          status: response.status,
          statusText: response.statusText,
          details: errorText
        },
        { status: response.status }
      );
    }
    
    // Get the response data
    const data = await response.json();
    
    // Return the response
    return Response.json({
      success: true,
      endpoint,
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