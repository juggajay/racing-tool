// API route for fetching race fields from Punting Form API
// This endpoint handles CSV responses and converts them to JSON

import { NextResponse } from 'next/server';
import { parseCSV } from '@/utils/csvParser';

// Format date as DD-Mon-YYYY (e.g., 01-Mar-2025)
function formatDate(date) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const day = String(date.getDate()).padStart(2, '0');
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters from query or use defaults
    const raceDate = searchParams.get('raceDate') || formatDate(new Date());
    const trackCode = searchParams.get('trackCode') || '';
    const raceNumber = searchParams.get('raceNumber') || '';
    
    // Use the provided API key
    const apiKey = '5b0df8bf-da9a-4d1e-995d-9b7a002aa836';
    
    // Build the API URL with the required query parameters
    let apiUrl = `https://api.puntingform.com.au/v2/form/fields?raceDate=${raceDate}&apiKey=${apiKey}`;
    
    // Add optional parameters if provided
    if (trackCode) {
      apiUrl += `&trackCode=${trackCode}`;
    }
    
    if (raceNumber) {
      apiUrl += `&raceNumber=${raceNumber}`;
    }
    
    console.log(`Fetching race fields from: ${apiUrl}`);
    
    // Make the request to the Punting Form API
    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'accept': 'text/csv'  // Request CSV format
      },
      signal: AbortSignal.timeout(15000),
      cache: 'no-store'
    });
    
    // Check if the response is successful
    if (!response.ok) {
      let errorText = '';
      try {
        errorText = await response.text();
      } catch (e) {
        errorText = 'Could not extract error details';
      }
      
      console.error('API error response:', {
        status: response.status,
        statusText: response.statusText,
        url: apiUrl,
        errorText
      });
      
      return NextResponse.json(
        { 
          error: 'Failed to fetch race fields',
          status: response.status,
          statusText: response.statusText,
          details: errorText
        },
        { status: response.status }
      );
    }
    
    // Get the CSV text from the response
    const csvText = await response.text();
    
    // Parse the CSV into a structured format
    const parsedData = parseCSV(csvText);
    
    // Process the data to group by race
    const raceFields = {};
    
    parsedData.data.forEach(entry => {
      const raceKey = `${entry.TrackCode || 'Unknown'}_R${entry.RaceNumber || '0'}`;
      
      if (!raceFields[raceKey]) {
        raceFields[raceKey] = {
          trackCode: entry.TrackCode,
          trackName: entry.TrackName,
          raceNumber: entry.RaceNumber,
          raceTime: entry.RaceTime,
          raceDistance: entry.RaceDistance,
          raceType: entry.RaceType,
          horses: []
        };
      }
      
      raceFields[raceKey].horses.push({
        number: entry.Number,
        name: entry.HorseName,
        barrier: entry.Barrier,
        weight: entry.Weight,
        jockey: entry.Jockey,
        trainer: entry.Trainer,
        lastFive: entry.LastFive,
        odds: entry.Odds
      });
    });
    
    // Return the structured data
    return NextResponse.json({
      success: true,
      raceDate,
      trackCode: trackCode || 'All tracks',
      raceNumber: raceNumber || 'All races',
      races: Object.values(raceFields),
      rawData: parsedData.data,
      headers: parsedData.headers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching race fields:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to fetch race fields',
        message: error.message,
        details: 'An unexpected error occurred while fetching race fields'
      },
      { status: 500 }
    );
  }
}