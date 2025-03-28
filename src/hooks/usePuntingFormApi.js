import { useState, useEffect } from 'react';

// Reusable hook for fetching data from the Punting Form proxy API
// Assumes API key is handled server-side via environment variables
export function usePuntingFormApi(endpoint, params = {}, skip = false) {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      setData(null); // Reset data on new fetch

      // --- Removed API Key retrieval from localStorage ---
      // The proxy API now uses the server-side environment variable.

      // Construct query string (excluding api_key)
      const queryParams = new URLSearchParams({
        endpoint: endpoint,
        // api_key: apiKey, // Removed
        ...params // Spread additional parameters like 'date' or 'meetingId'
      });

      const apiUrl = `/api/punting-form?${queryParams.toString()}`;
      console.log(`[usePuntingFormApi] Fetching: ${apiUrl}`); // Log the URL being fetched

      try {
        const response = await fetch(apiUrl);

        if (!response.ok) {
          let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
          let errorDetails = '';
          try {
            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
              const errorData = await response.json();
              // Use error/message field from response if available
              errorDetails = errorData.message || errorData.error || JSON.stringify(errorData);
            } else {
              errorDetails = await response.text();
            }
            console.error(`[usePuntingFormApi] Non-OK response (${response.status}):`, errorDetails); // Log error details
          } catch (e) {
            errorDetails = "(Could not read error response body)";
            console.error(`[usePuntingFormApi] Error reading non-OK response body (${response.status}):`, e);
          }
          // Include details in error message if concise
          errorMessage += ` - ${errorDetails.substring(0, 150)}`;
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log(`[usePuntingFormApi] Response for ${endpoint}:`, result); // Log successful response

        if (result.success) {
          setData(result.data); // Store the actual data part of the response
        } else {
          // Handle errors reported within a successful (2xx) response from the proxy
          const errMsg = result.error || result.message || 'Proxy API returned success=false.';
          console.error(`[usePuntingFormApi] Proxy API returned success=false for ${endpoint}:`, errMsg, result);
          throw new Error(errMsg);
        }

      } catch (err) {
        console.error(`[usePuntingFormApi] Fetch error for ${endpoint}:`, err);
        setError(err instanceof Error ? err : new Error('An unknown error occurred during API fetch.'));
      } finally {
        setIsLoading(false);
      }
    };

    // Only fetch if skip is false
    if (!skip) {
      fetchData();
    } else {
      // If skipping, ensure loading is false and data/error are null
      setIsLoading(false);
      setData(null);
      setError(null);
    }

  }, [endpoint, JSON.stringify(params), skip]); // Re-run if endpoint, params, or skip change

  return { data, isLoading, error };
}