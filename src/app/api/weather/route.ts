// Define types to avoid TypeScript errors
type NextRequest = {
  url: string;
  json: () => Promise<any>;
};

type NextResponseType = {
  json: (data: any, options?: { status?: number }) => NextResponseType;
};

// Mock NextResponse.json function
const NextResponse = {
  json: (data: any, options?: { status?: number }): any => {
    return { data, options };
  }
};

// Mock data for demonstration purposes
// In a real application, you would fetch this data from an external weather API
const trackConditions: Record<string, any> = {
  'Flemington Racecourse': {
    current: {
      condition: 'Good',
      description: 'Firm track with good grass coverage',
      penetrometer: 4.5,
      last_updated: '2025-03-25T08:30:00.000Z'
    },
    forecast: [
      {
        date: '2025-03-26',
        condition: 'Good',
        description: 'Firm track with good grass coverage',
        penetrometer: 4.6,
        confidence: 'high'
      },
      {
        date: '2025-03-27',
        condition: 'Good to Soft',
        description: 'Slightly softer conditions due to overnight rain',
        penetrometer: 5.2,
        confidence: 'medium'
      },
      {
        date: '2025-03-28',
        condition: 'Soft',
        description: 'Softer conditions with some moisture in the track',
        penetrometer: 6.1,
        confidence: 'medium'
      }
    ]
  },
  'Moonee Valley Racecourse': {
    current: {
      condition: 'Good to Soft',
      description: 'Slightly softer conditions with good grass coverage',
      penetrometer: 5.3,
      last_updated: '2025-03-25T09:15:00.000Z'
    },
    forecast: [
      {
        date: '2025-03-26',
        condition: 'Good to Soft',
        description: 'Slightly softer conditions with good grass coverage',
        penetrometer: 5.4,
        confidence: 'high'
      },
      {
        date: '2025-03-27',
        condition: 'Good',
        description: 'Improving conditions with drying track',
        penetrometer: 4.8,
        confidence: 'medium'
      },
      {
        date: '2025-03-28',
        condition: 'Good',
        description: 'Firm track with good grass coverage',
        penetrometer: 4.5,
        confidence: 'medium'
      }
    ]
  },
  'Caulfield Racecourse': {
    current: {
      condition: 'Good',
      description: 'Firm track with excellent grass coverage',
      penetrometer: 4.2,
      last_updated: '2025-03-25T08:45:00.000Z'
    },
    forecast: [
      {
        date: '2025-03-26',
        condition: 'Good',
        description: 'Firm track with excellent grass coverage',
        penetrometer: 4.3,
        confidence: 'high'
      },
      {
        date: '2025-03-27',
        condition: 'Good',
        description: 'Firm track with excellent grass coverage',
        penetrometer: 4.4,
        confidence: 'high'
      },
      {
        date: '2025-03-28',
        condition: 'Good to Soft',
        description: 'Slightly softer conditions due to forecast rain',
        penetrometer: 5.0,
        confidence: 'low'
      }
    ]
  }
};

const weatherData: Record<string, any> = {
  'Flemington Racecourse': {
    current: {
      temperature: 22.5,
      condition: 'Sunny',
      wind_speed: 12,
      wind_direction: 'NW',
      humidity: 65,
      precipitation: 0,
      last_updated: '2025-03-25T08:30:00.000Z'
    },
    forecast: [
      {
        date: '2025-03-26',
        temperature_high: 24,
        temperature_low: 16,
        condition: 'Sunny',
        wind_speed: 10,
        wind_direction: 'N',
        humidity: 60,
        precipitation_chance: 5,
        precipitation_amount: 0
      },
      {
        date: '2025-03-27',
        temperature_high: 22,
        temperature_low: 15,
        condition: 'Partly Cloudy',
        wind_speed: 15,
        wind_direction: 'NE',
        humidity: 70,
        precipitation_chance: 30,
        precipitation_amount: 2
      },
      {
        date: '2025-03-28',
        temperature_high: 20,
        temperature_low: 14,
        condition: 'Showers',
        wind_speed: 20,
        wind_direction: 'E',
        humidity: 80,
        precipitation_chance: 70,
        precipitation_amount: 8
      }
    ]
  },
  'Moonee Valley Racecourse': {
    current: {
      temperature: 21.8,
      condition: 'Partly Cloudy',
      wind_speed: 14,
      wind_direction: 'N',
      humidity: 68,
      precipitation: 0,
      last_updated: '2025-03-25T09:15:00.000Z'
    },
    forecast: [
      {
        date: '2025-03-26',
        temperature_high: 23,
        temperature_low: 15,
        condition: 'Partly Cloudy',
        wind_speed: 12,
        wind_direction: 'NW',
        humidity: 65,
        precipitation_chance: 10,
        precipitation_amount: 0
      },
      {
        date: '2025-03-27',
        temperature_high: 25,
        temperature_low: 16,
        condition: 'Sunny',
        wind_speed: 8,
        wind_direction: 'W',
        humidity: 55,
        precipitation_chance: 5,
        precipitation_amount: 0
      },
      {
        date: '2025-03-28',
        temperature_high: 24,
        temperature_low: 17,
        condition: 'Sunny',
        wind_speed: 10,
        wind_direction: 'SW',
        humidity: 60,
        precipitation_chance: 10,
        precipitation_amount: 0
      }
    ]
  },
  'Caulfield Racecourse': {
    current: {
      temperature: 22.2,
      condition: 'Sunny',
      wind_speed: 10,
      wind_direction: 'W',
      humidity: 62,
      precipitation: 0,
      last_updated: '2025-03-25T08:45:00.000Z'
    },
    forecast: [
      {
        date: '2025-03-26',
        temperature_high: 24,
        temperature_low: 16,
        condition: 'Sunny',
        wind_speed: 8,
        wind_direction: 'SW',
        humidity: 60,
        precipitation_chance: 5,
        precipitation_amount: 0
      },
      {
        date: '2025-03-27',
        temperature_high: 25,
        temperature_low: 17,
        condition: 'Sunny',
        wind_speed: 12,
        wind_direction: 'S',
        humidity: 65,
        precipitation_chance: 10,
        precipitation_amount: 0
      },
      {
        date: '2025-03-28',
        temperature_high: 21,
        temperature_low: 15,
        condition: 'Showers',
        wind_speed: 18,
        wind_direction: 'SE',
        humidity: 75,
        precipitation_chance: 60,
        precipitation_amount: 5
      }
    ]
  }
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const location = searchParams.get('location');
    const type = searchParams.get('type') || 'all'; // 'track', 'weather', or 'all'
    const date = searchParams.get('date');
    
    if (!location) {
      return NextResponse.json(
        { error: 'Location parameter is required' },
        { status: 400 }
      );
    }
    
    // Check if location exists in our data
    if (!trackConditions[location] || !weatherData[location]) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }
    
    let response: any = {};
    
    // Return track conditions
    if (type === 'track' || type === 'all') {
      const trackData = trackConditions[location];
      
      if (date) {
        // Find forecast for specific date
        const forecastForDate = trackData.forecast.find((f: any) => f.date === date);
        
        if (forecastForDate) {
          response.track = forecastForDate;
        } else {
          response.track = trackData.current;
        }
      } else {
        // Return current conditions and forecast
        response.track = trackData;
      }
    }
    
    // Return weather data
    if (type === 'weather' || type === 'all') {
      const weather = weatherData[location];
      
      if (date) {
        // Find forecast for specific date
        const forecastForDate = weather.forecast.find((f: any) => f.date === date);
        
        if (forecastForDate) {
          response.weather = forecastForDate;
        } else {
          response.weather = weather.current;
        }
      } else {
        // Return current conditions and forecast
        response.weather = weather;
      }
    }
    
    return NextResponse.json({
      success: true,
      location: location,
      data: response
    });
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await (request as any).json();
    const { action, location, date } = body;
    
    if (!action || !location) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if location exists in our data
    if (!trackConditions[location] || !weatherData[location]) {
      return NextResponse.json(
        { error: 'Location not found' },
        { status: 404 }
      );
    }
    
    // Handle different actions
    if (action === 'track_impact_analysis') {
      // Analyze how weather conditions impact track performance
      // This would be a more complex calculation in a real application
      
      const trackData = trackConditions[location];
      const weather = weatherData[location];
      
      // Simple analysis based on current conditions
      const analysis = {
        overall_impact: 'moderate',
        speed_impact: -0.2, // seconds per furlong
        stamina_impact: 0.3, // relative factor
        factors: [
          {
            factor: 'Track Condition',
            value: trackData.current.condition,
            impact: trackData.current.condition === 'Good' ? 'neutral' : 'negative'
          },
          {
            factor: 'Temperature',
            value: `${weather.current.temperature}°C`,
            impact: weather.current.temperature > 25 ? 'negative' : 'neutral'
          },
          {
            factor: 'Wind',
            value: `${weather.current.wind_speed} km/h ${weather.current.wind_direction}`,
            impact: weather.current.wind_speed > 15 ? 'negative' : 'neutral'
          },
          {
            factor: 'Humidity',
            value: `${weather.current.humidity}%`,
            impact: weather.current.humidity > 70 ? 'negative' : 'neutral'
          }
        ],
        recommendations: [
          'Horses with good form on this track condition should be favored',
          'Consider horses with good stamina due to slightly challenging conditions',
          'Front-runners may be at a disadvantage with the current wind direction'
        ]
      };
      
      return NextResponse.json({
        success: true,
        location: location,
        data: analysis
      });
    }
    
    if (action === 'historical_comparison') {
      // Compare current conditions with historical data
      // This would use a database of historical conditions in a real application
      
      const historicalComparison = {
        similar_days: [
          {
            date: '2024-11-15',
            similarity: 92,
            conditions: {
              track: 'Good',
              weather: 'Sunny',
              temperature: 23.1,
              results: 'Favored front-runners and horses drawn wide'
            }
          },
          {
            date: '2024-09-28',
            similarity: 87,
            conditions: {
              track: 'Good',
              weather: 'Partly Cloudy',
              temperature: 21.8,
              results: 'No clear bias, fair racing conditions'
            }
          },
          {
            date: '2024-08-12',
            similarity: 85,
            conditions: {
              track: 'Good',
              weather: 'Sunny',
              temperature: 22.5,
              results: 'Slightly favored horses with early speed'
            }
          }
        ],
        analysis: 'Current conditions are most similar to racing on 2024-11-15, which favored front-runners and horses drawn wide.',
        confidence: 'high'
      };
      
      return NextResponse.json({
        success: true,
        location: location,
        data: historicalComparison
      });
    }
    
    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Weather API error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}