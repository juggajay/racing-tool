/**
 * Utility functions for interacting with the Punting Form API
 */

// Default API key
const DEFAULT_API_KEY = '5b0df8bf-da9a-4d1e-995d-9b7a002aa836';

/**
 * Fetch data from the Punting Form API
 * @param {Object} options - Options for the API request
 * @param {string} options.endpoint - API endpoint (e.g., 'races', 'horses')
 * @param {Object} options.params - Query parameters
 * @param {string} options.apiKey - Punting Form API key (optional, will use default if not provided)
 * @returns {Promise<Object>} - API response data
 */
export async function fetchPuntingFormData({ endpoint = 'races', params = {}, apiKey = DEFAULT_API_KEY }) {

  // Build query parameters
  const queryParams = new URLSearchParams();
  
  // Add API key to query parameters
  queryParams.append('api_key', apiKey);
  
  // Add other parameters
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      queryParams.append(key, value);
    }
  });
  
  // Add endpoint to query parameters
  queryParams.append('endpoint', endpoint);
  
  try {
    // Make the request to our API proxy
    const response = await fetch(`/api/punting-form?${queryParams.toString()}`);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Punting Form data:', error);
    throw error;
  }
}

/**
 * Post data to the Punting Form API
 * @param {Object} options - Options for the API request
 * @param {string} options.endpoint - API endpoint (e.g., 'races', 'horses')
 * @param {string} options.action - API action (e.g., 'update', 'delete')
 * @param {Object} options.parameters - Request body parameters
 * @param {string} options.apiKey - Punting Form API key (optional, will use default if not provided)
 * @returns {Promise<Object>} - API response data
 */
export async function postPuntingFormData({ endpoint, action, parameters = {}, apiKey = DEFAULT_API_KEY }) {
  
  if (!endpoint) {
    throw new Error('Endpoint is required');
  }
  
  try {
    // Make the request to our API proxy
    const response = await fetch('/api/punting-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        api_key: apiKey,
        endpoint,
        action,
        parameters,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(`API error: ${errorData.error || response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting to Punting Form API:', error);
    throw error;
  }
}

/**
 * Get upcoming races
 * @param {Object} options - Options for the API request
 * @param {string} options.date - Race date (YYYY-MM-DD)
 * @param {string} options.track - Track name
 * @param {string} options.apiKey - Punting Form API key (optional, will use default if not provided)
 * @returns {Promise<Object>} - API response data
 */
export async function getUpcomingRaces({ date, track, apiKey = DEFAULT_API_KEY }) {
  return fetchPuntingFormData({
    endpoint: 'races',
    params: { date, track },
    apiKey,
  });
}

/**
 * Get race details
 * @param {Object} options - Options for the API request
 * @param {string} options.track - Track name
 * @param {string} options.raceNumber - Race number
 * @param {string} options.date - Race date (YYYY-MM-DD)
 * @param {string} options.apiKey - Punting Form API key (optional, will use default if not provided)
 * @returns {Promise<Object>} - API response data
 */
export async function getRaceDetails({ track, raceNumber, date, apiKey = DEFAULT_API_KEY }) {
  return fetchPuntingFormData({
    endpoint: 'races',
    params: { track, race_number: raceNumber, date },
    apiKey,
  });
}

/**
 * Get horse details
 * @param {Object} options - Options for the API request
 * @param {string} options.horseId - Horse ID
 * @param {string} options.apiKey - Punting Form API key (optional, will use default if not provided)
 * @returns {Promise<Object>} - API response data
 */
export async function getHorseDetails({ horseId, apiKey = DEFAULT_API_KEY }) {
  return fetchPuntingFormData({
    endpoint: 'horses',
    params: { horse_id: horseId },
    apiKey,
  });
}