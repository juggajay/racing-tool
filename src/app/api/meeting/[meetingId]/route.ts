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
    // Fetch meetings list from Punting Form API
    // We'll get all meetings and then filter for the specific meeting ID
    const today = new Date();
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}-${['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][today.getMonth()]}-${today.getFullYear()}`;
    const apiUrl = `https://api.puntingform.com.au/v2/form/meetingslist?meetingDate=${formattedDate}&apiKey=${apiKey}`;
    
    console.log(`Fetching meetings list for date: ${formattedDate} to find meeting ID: ${meetingId}`);
    const response = await fetch(apiUrl);
    
    if (!response.ok) {
      console.error(`API request failed: ${response.status} ${response.statusText}`);
      console.error(`API request failed: ${response.status} ${response.statusText}`);
      
      // If API request fails, create a structured meeting object as fallback
      const apiErrorFallbackMeeting = {
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
      };
      
      console.log('Using sample fallback data:', apiErrorFallbackMeeting);
      
      return NextResponse.json({
        meeting: apiErrorFallbackMeeting
      });
    }
    
    const responseData = await response.json();
    console.log('API response received:', JSON.stringify(responseData, null, 2));
    
    // Extract meetings from the response
    let meetings = null;
    if (responseData.data && responseData.data.payLoad && Array.isArray(responseData.data.payLoad)) {
      meetings = responseData.data.payLoad;
    } else if (responseData.payLoad && Array.isArray(responseData.payLoad)) {
      meetings = responseData.payLoad;
    } else if (responseData.data && Array.isArray(responseData.data)) {
      meetings = responseData.data;
    } else if (Array.isArray(responseData)) {
      meetings = responseData;
    }
    
    console.log(`Found ${meetings ? meetings.length : 0} meetings in the response`);
    
    // Find the specific meeting by ID
    const meeting = meetings ? meetings.find(m => String(m.meetingId) === String(meetingId)) : null;
    
    if (!meeting) {
      console.log(`Meeting with ID ${meetingId} not found in the response`);
      // Fall back to sample data if meeting not found
      const fallbackMeeting = {
        meetingId: meetingId,
        name: "Sample Race Meeting (Not Found)",
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
      };
      
      console.log('Using fallback data for meeting not found:', fallbackMeeting);
      
      return NextResponse.json({
        meeting: fallbackMeeting
      });
    }
    
    console.log('Found meeting:', meeting);
    
    // Process the API response to match the expected format
    // This will depend on the actual structure of the Punting Form API response
    // You may need to adjust this based on the actual API response
    
    // Create a properly structured meeting object from the API response
    const structuredMeeting = {
      meetingId: meeting.meetingId || meetingId,
      name: meeting.track?.name || meeting.name || "Race Meeting",
      track: {
        name: meeting.track?.name || "Unknown Track",
        location: meeting.track?.location || "Unknown Location",
        state: meeting.track?.state || "Unknown State"
      },
      meetingDate: meeting.meetingDate || new Date().toISOString(),
      races: Array.isArray(meeting.races) ? meeting.races : []
    };
    
    console.log('Structured meeting data:', structuredMeeting);
    
    // Return the structured meeting data
    return NextResponse.json({
      meeting: structuredMeeting
    });
  } catch (error) {
    console.error('Error fetching meeting data:', error);
    
    // Create a structured meeting object as fallback in case of error
    const errorFallbackMeeting = {
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
    };
    
    console.log('Using error fallback data:', errorFallbackMeeting);
    
    return NextResponse.json({
      meeting: errorFallbackMeeting
    });
  }
}