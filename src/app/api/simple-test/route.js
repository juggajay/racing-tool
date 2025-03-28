// Simple Test API
// This is a very simple API route with minimal dependencies

export function GET() {
  return Response.json({
    message: "Simple API route is working!",
    timestamp: new Date().toISOString()
  });
}