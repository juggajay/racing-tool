// Test Page Component
// This is a simple page component to test if page routes are working in the deployment

export default function TestPage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Test Page</h1>
      <p className="mb-4">This is a simple page component to test if page routes are working in the deployment.</p>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Page Route Test</h2>
        <p>If you can see this page, page routes are working correctly!</p>
        <p className="mt-2">
          <strong>Deployment URL:</strong> horses-rose.vercel.app
        </p>
        <p className="mt-2">
          <strong>Page Route:</strong> /test-page
        </p>
      </div>
      
      <div className="bg-gray-100 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-2">Deployment Information</h2>
        <p><strong>Build Time:</strong> {new Date().toISOString()}</p>
      </div>
      
      <div className="bg-gray-100 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-2">API Route Tests</h2>
        <p>To test API routes, visit:</p>
        <ul className="list-disc pl-5 mt-2">
          <li className="mb-2">
            <a
              href="/api/test-deployment"
              className="text-blue-500 hover:text-blue-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              /api/test-deployment
            </a>
            <span className="ml-2 text-gray-600">(Complex test with headers and request info)</span>
          </li>
          <li>
            <a
              href="/api/simple-test"
              className="text-blue-500 hover:text-blue-700 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              /api/simple-test
            </a>
            <span className="ml-2 text-gray-600">(Minimal API with no dependencies)</span>
          </li>
        </ul>
      </div>
    </div>
  );
}