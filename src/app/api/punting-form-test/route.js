// Test endpoint for Punting Form API
// This file helps diagnose issues with the Punting Form API

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get API key from query parameters
    const apiKey = searchParams.get('api_key') || '5b0df8bf-da9a-4d1e-995d-9b7a002aa836';
    
    // Try different API base URLs
    const apiUrls = [
      'https://api.puntingform.com.au/v1/races',
      'https://api.puntingform.com.au/races',
      'https://www.puntingform.com.au/api/v1/races',
      'https://www.puntingform.com.au/api/races',
      'http://old.puntingform.com.au/api/formdataservice/ExportMeetings',
      'http://old.puntingform.com.au/api/scratchingsservice/GetAllScratchings',
      'http://old.puntingform.com.au/api/ratingsservice/GetRatings'
    ];
    
    // Try different authentication methods
    const authMethods = [
      // Method 1: API key as query parameter
      {
        name: 'API key as query parameter',
        url: (baseUrl) => `${baseUrl}?key=${apiKey}`,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      },
      // Method 2: Bearer token
      {
        name: 'Bearer token',
        url: (baseUrl) => baseUrl,
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      },
      // Method 3: API key in header
      {
        name: 'API key in header',
        url: (baseUrl) => baseUrl,
        headers: {
          'X-API-Key': apiKey,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      },
      // Method 4: Basic auth
      {
        name: 'Basic auth',
        url: (baseUrl) => baseUrl,
        headers: {
          'Authorization': `Basic ${Buffer.from(`${apiKey}:`).toString('base64')}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      }
    ];
    
    // Results array to store all test results
    const results = [];
    
    // Test each combination of URL and auth method
    for (const baseUrl of apiUrls) {
      for (const authMethod of authMethods) {
        const url = authMethod.url(baseUrl);
        
        try {
          console.log(`Testing ${authMethod.name} with URL: ${url}`);
          
          const response = await fetch(url, {
            headers: authMethod.headers,
            // Add a timeout to prevent hanging
            signal: AbortSignal.timeout(5000)
          });
          
          let responseData;
          let responseText;
          
          try {
            responseData = await response.json();
          } catch (e) {
            try {
              responseText = await response.text();
            } catch (e2) {
              responseText = 'Could not extract response text';
            }
          }
          
          results.push({
            url: baseUrl,
            authMethod: authMethod.name,
            status: response.status,
            statusText: response.statusText,
            headers: Object.fromEntries(response.headers.entries()),
            data: responseData || responseText,
            success: response.ok
          });
        } catch (error) {
          results.push({
            url: baseUrl,
            authMethod: authMethod.name,
            error: error.message
          });
        }
      }
    }
    
    // Find any successful results
    const successfulResults = results.filter(r => r.success);
    
    return Response.json({
      apiKey: apiKey.substring(0, 4) + '...' + apiKey.substring(apiKey.length - 4), // Mask the API key for security
      results,
      successfulResults,
      recommendedConfig: successfulResults.length > 0 ? successfulResults[0] : null
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return Response.json(
      { 
        error: 'Error in test endpoint', 
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}