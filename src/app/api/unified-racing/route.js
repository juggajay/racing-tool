// Unified Racing API
// This API combines data from multiple sources to provide a comprehensive racing data endpoint

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

// Format date as YYYY-MM-DD (e.g., 2025-03-01)
function formatISODate(date) {
  return date.toISOString().split('T')[0];
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters from query
    const action = searchParams.get('action') || 'races';
    const date = searchParams.get('date') || formatISODate(new Date());
    const trackCode = searchParams.get('trackCode');
    const raceId = searchParams.get('raceId');
    const horseId = searchParams.get('horseId');
    const includeOdds = searchParams.get('includeOdds') !== 'false'; // Default to true
    const includeWeather = searchParams.get('includeWeather') !== 'false'; // Default to true
    const includeComments = searchParams.get('includeComments') !== 'false'; // Default to true
    
    // Convert ISO date to Punting Form date format
    const puntingFormDate = formatDate(new Date(date));
    
    // Initialize response object
    const responseData = {
      success: true,
      date,
      action,
      timestamp: new Date().toISOString(),
      data: {}
    };
    
    // Handle different actions
    switch (action) {
      case 'races': {
        // Fetch race fields from Punting Form API
        const fieldsUrl = `/api/punting-form?endpoint=form/fields&date=${puntingFormDate}${trackCode ? `&trackCode=${trackCode}` : ''}`;
        const fieldsResponse = await fetch(new URL(fieldsUrl, request.url).toString());
        
        if (!fieldsResponse.ok) {
          throw new Error(`Failed to fetch race fields: ${fieldsResponse.status} ${fieldsResponse.statusText}`);
        }
        
        const fieldsData = await fieldsResponse.json();
        
        // Parse CSV data
        if (typeof fieldsData.data === 'string') {
          const parsedFields = parseCSV(fieldsData.data);
          
          // Process the data to group by race
          const races = {};
          
          parsedFields.data.forEach(entry => {
            const raceKey = `${entry.TrackCode || 'Unknown'}_R${entry.RaceNumber || '0'}`;
            
            if (!races[raceKey]) {
              races[raceKey] = {
                id: raceKey,
                trackCode: entry.TrackCode,
                trackName: entry.TrackName,
                raceNumber: entry.RaceNumber,
                raceTime: entry.RaceTime,
                raceDistance: entry.RaceDistance,
                raceType: entry.RaceType,
                horses: []
              };
            }
            
            races[raceKey].horses.push({
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
          
          responseData.data.races = Object.values(races);
        } else {
          responseData.data.races = [];
          responseData.error = 'Failed to parse race fields data';
        }
        
        // Fetch odds data if requested
        if (includeOdds) {
          try {
            const oddsResponse = await fetch(`/api/odds?date=${date}`, { cache: 'no-store' });
            if (oddsResponse.ok) {
              const oddsData = await oddsResponse.json();
              responseData.data.odds = oddsData.data;
            }
          } catch (error) {
            console.error('Error fetching odds data:', error);
          }
        }
        
        // Fetch weather data if requested
        if (includeWeather && responseData.data.races && responseData.data.races.length > 0) {
          try {
            // Get unique track names
            const trackNames = [...new Set(responseData.data.races.map(race => race.trackName))];
            
            // Fetch weather data for each track
            const weatherData = {};
            
            for (const trackName of trackNames) {
              const weatherResponse = await fetch(`/api/weather?location=${encodeURIComponent(trackName + ' Racecourse')}&date=${date}`, { cache: 'no-store' });
              if (weatherResponse.ok) {
                const trackWeather = await weatherResponse.json();
                weatherData[trackName] = trackWeather.data;
              }
            }
            
            responseData.data.weather = weatherData;
          } catch (error) {
            console.error('Error fetching weather data:', error);
          }
        }
        
        // Fetch comments if requested
        if (includeComments) {
          try {
            const commentsResponse = await fetch(`/api/punting-form?endpoint=form/comment&date=${puntingFormDate}`, { cache: 'no-store' });
            if (commentsResponse.ok) {
              const commentsData = await commentsResponse.json();
              responseData.data.comments = commentsData.data;
            }
          } catch (error) {
            console.error('Error fetching comments data:', error);
          }
        }
        
        break;
      }
      
      case 'race': {
        if (!raceId) {
          return NextResponse.json(
            { error: 'Race ID is required for race action' },
            { status: 400 }
          );
        }
        
        // Fetch race data from Punting Form API
        const raceResponse = await fetch(`/api/punting-form?endpoint=race&raceId=${raceId}`, { cache: 'no-store' });
        
        if (!raceResponse.ok) {
          throw new Error(`Failed to fetch race data: ${raceResponse.status} ${raceResponse.statusText}`);
        }
        
        const raceData = await raceResponse.json();
        responseData.data.race = raceData.data;
        
        // Fetch odds data if requested
        if (includeOdds) {
          try {
            const oddsResponse = await fetch(`/api/odds?race_id=${raceId}`, { cache: 'no-store' });
            if (oddsResponse.ok) {
              const oddsData = await oddsResponse.json();
              responseData.data.odds = oddsData.data;
            }
          } catch (error) {
            console.error('Error fetching odds data:', error);
          }
        }
        
        // Fetch weather data if requested
        if (includeWeather && responseData.data.race && responseData.data.race.trackName) {
          try {
            const weatherResponse = await fetch(`/api/weather?location=${encodeURIComponent(responseData.data.race.trackName + ' Racecourse')}&date=${date}`, { cache: 'no-store' });
            if (weatherResponse.ok) {
              const weatherData = await weatherResponse.json();
              responseData.data.weather = weatherData.data;
            }
          } catch (error) {
            console.error('Error fetching weather data:', error);
          }
        }
        
        break;
      }
      
      case 'horse': {
        if (!horseId) {
          return NextResponse.json(
            { error: 'Horse ID is required for horse action' },
            { status: 400 }
          );
        }
        
        // Fetch horse data from Punting Form API
        const horseResponse = await fetch(`/api/punting-form?endpoint=horse&horseId=${horseId}`, { cache: 'no-store' });
        
        if (!horseResponse.ok) {
          throw new Error(`Failed to fetch horse data: ${horseResponse.status} ${horseResponse.statusText}`);
        }
        
        const horseData = await horseResponse.json();
        responseData.data.horse = horseData.data;
        
        break;
      }
      
      case 'results': {
        // Fetch race results from Punting Form API
        const resultsUrl = `/api/punting-form?endpoint=form/results&date=${puntingFormDate}${trackCode ? `&trackCode=${trackCode}` : ''}`;
        const resultsResponse = await fetch(new URL(resultsUrl, request.url).toString());
        
        if (!resultsResponse.ok) {
          throw new Error(`Failed to fetch race results: ${resultsResponse.status} ${resultsResponse.statusText}`);
        }
        
        const resultsData = await resultsResponse.json();
        
        // Parse CSV data
        if (typeof resultsData.data === 'string') {
          const parsedResults = parseCSV(resultsData.data);
          responseData.data.results = parsedResults.data;
        } else {
          responseData.data.results = [];
          responseData.error = 'Failed to parse race results data';
        }
        
        break;
      }
      
      default:
        return NextResponse.json(
          { error: 'Invalid action. Supported actions are: races, race, horse, results' },
          { status: 400 }
        );
    }
    
    return NextResponse.json(responseData);
  } catch (error) {
    console.error('Unified Racing API error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to process request',
        message: error.message,
        details: 'An unexpected error occurred while processing your request'
      },
      { status: 500 }
    );
  }
}