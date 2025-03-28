import { useState, useEffect } from 'react';

// Reusable hook for fetching data from the Punting Form proxy API
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

      let apiKey = null;
      let storageError = null;
      try {
        // Ensure localStorage is available (client-side only)
        if (typeof window !== 'undefined') {
          apiKey = localStorage.getItem('puntingFormApiKey');
          // --- DEBUGGING: Log the retrieved key ---
          console.log(`[usePuntingFormApi] Retrieved API Key from localStorage: ${apiKey ? '***' + apiKey.slice(-4) : 'null'}`);
          // --- END DEBUGGING ---
        } else {
           storageError = "localStorage not available (not client-side?).";
           console.warn(storageError);
        }
      } catch (e) {
        storageError = `Error accessing localStorage: ${e.message}`;
        console.error(storageError, e);
        setError(new Error("Could not access API key storage."));
        setIsLoading(false);
        return;
      }

      if (!apiKey) {
        const errMsg = storageError || "Punting Form API key not found in local storage. Please save it on the Settings page.";
        setError(new Error(errMsg));
        setIsLoading(false);
        return;
      }

      // Construct query string
      const queryParams = new URLSearchParams({
        endpoint: endpoint,
        api_key: apiKey,
        ...params // Spread additional parameters
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
              errorDetails = errorData.message || errorData.error || JSON.stringify(errorData);
            } else {
              errorDetails = await response.text();
            }
            console.error(`[usePuntingFormApi] Non-OK response (${response.status}):`, errorDetails); // Log error details
          } catch (e) {
            errorDetails = "(Could not read error response body)";
            console.error(`[usePuntingFormApi] Error reading non-OK response body (${response.status}):`, e);
          }
          errorMessage += ` - ${errorDetails.substring(0, 150)}`; // Limit length
          throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log(`[usePuntingFormApi] Response for ${endpoint}:`, result); // Log successful response

        if (result.success) {
          setData(result.data); // Store the actual data part of the response
        } else {
          // Handle errors reported within a successful (2xx) response
          const errMsg = result.error || result.message || 'API returned an unspecified error.';
          console.error(`[usePuntingFormApi] API returned success=false for ${endpoint}:`, errMsg, result);
          throw new Error(errMsg);
        }

      } catch (err) {
        console.error(`[usePuntingFormApi] Error fetching from ${endpoint}:`, err);
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

    // No cleanup needed for fetch, but good practice for potential future effects
    // return () => { /* cleanup */ };

  }, [endpoint, JSON.stringify(params), skip]); // Re-run if endpoint, params, or skip change

  return { data, isLoading, error };
}