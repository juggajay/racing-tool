import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { meetingId: string } }
) {
  const meetingId = params.meetingId;

  // Check if API key is available
  const apiKey = process.env.PUNTING_FORM_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error: 'API key not configured',
        message: 'The Punting Form API key needs to be configured in the server environment variables (PUNTING_FORM_API_KEY).'
      },
      { status: 500 }
    );
  }

  try {
    // Fetch meeting details from Punting Form API
    const apiUrl = `https://api.puntingform.com.au/v2/form/meeting?meetingId=${meetingId}&apiKey=${apiKey}`;
    
    console.log(`Fetching meeting data for ID: ${meetingId}`);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`API request failed: ${response.status} ${response.statusText}`);
      
      // If API request fails, return sample data as fallback
      const sampleData = {
        meeting: {
          meetingId: meetingId,
          name: "Sample Race Meeting",
          track: {
            name: "Sample Track",
            location: "Sample City",
            state: "Sample State"
          },
          meetingDate: "2025-04-04T00:00:00",
          races: [
            {
              raceId: 12345,
              raceNumber: 1,
              raceName: "Sample Race 1",
              distance: 1200,
              numberOfRunners: 10
            },
            {
              raceId: 12346,
              raceNumber: 2,
              raceName: "Sample Race 2",
              distance: 1400,
              numberOfRunners: 8
            }
          ]
        }
      };
      
      return NextResponse.json(sampleData);
    }
    
    const data = await response.json();
    console.log('API response received:', JSON.stringify(data, null, 2));
    
    // Log the structure of the data
    console.log('API response structure:', {
      hasData: !!data,
      dataType: typeof data,
      dataKeys: Object.keys(data),
      hasTrack: !!data.track,
      trackType: data.track ? typeof data.track : 'undefined',
      trackKeys: data.track ? Object.keys(data.track) : [],
      hasMeetingDate: !!data.meetingDate,
      meetingDateType: data.meetingDate ? typeof data.meetingDate : 'undefined',
      hasRaces: !!data.races,
      racesType: data.races ? typeof data.races : 'undefined',
      racesLength: data.races && Array.isArray(data.races) ? data.races.length : 0
    });
    
    // Process the API response to match the expected format
    // This will depend on the actual structure of the Punting Form API response
    // You may need to adjust this based on the actual API response
    
    // Wrap the API response in a meeting property to match the expected format
    return NextResponse.json({
      meeting: data
    });
  } catch (error) {
    console.error('Error fetching meeting data:', error);
    
    // Return sample data as fallback in case of error
    const sampleData = {
      meeting: {
        meetingId: meetingId,
        name: "Sample Race Meeting (Error Fallback)",
        track: {
          name: "Sample Track",
          location: "Sample City",
          state: "Sample State"
        },
        meetingDate: "2025-04-04T00:00:00",
        races: [
          {
            raceId: 12345,
            raceNumber: 1,
            raceName: "Sample Race 1",
            distance: 1200,
            numberOfRunners: 10
          },
          {
            raceId: 12346,
            raceNumber: 2,
            raceName: "Sample Race 2",
            distance: 1400,
            numberOfRunners: 8
          }
        ]
      }
    };
    
    return NextResponse.json(sampleData);
  }
}