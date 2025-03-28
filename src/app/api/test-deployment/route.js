// Test Deployment API
// This is a simple API route to test if API routes are working in the deployment

export async function GET(request) {
  return Response.json({
    message: "API route is working!",
    timestamp: new Date().toISOString(),
    url: request.url,
    headers: Object.fromEntries(request.headers),
    deployment: "horses-4tqzpm7bf-juggajays-projects.vercel.app"
  });
}