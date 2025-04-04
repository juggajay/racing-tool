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

  // Sample data for demonstration
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

  // In a real implementation, you would fetch data from the Punting Form API
  // using the meetingId parameter

  return NextResponse.json(sampleData);
}