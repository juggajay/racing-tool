// Test API Endpoint
// This is a simple API endpoint to test if the API is working correctly

export async function GET(request) {
  return Response.json({
    message: "API is working correctly!",
    timestamp: new Date().toISOString(),
    url: request.url,
    deployment: "horses-rose.vercel.app",
    test: true
  });
}