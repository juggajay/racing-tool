import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { meetingId: string } }
) {
  const meetingId = params.meetingId;

  // Check if API key is available
  const apiKey = process.env.PUNTING_FORM_API_KEY;
  if (!apiKey) {
    return new Response(
      `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Meeting Details - API Key Required</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
          }
          h1 {
            color: #2c3e50;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          .error {
            background-color: #f8d7da;
            color: #721c24;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          code {
            background-color: #f8f9fa;
            padding: 2px 4px;
            border-radius: 3px;
          }
          .steps {
            background-color: #f8f9fa;
            padding: 15px;
            border-radius: 5px;
            margin-bottom: 20px;
          }
          .steps ol {
            margin-top: 10px;
            padding-left: 20px;
          }
          .back-link {
            display: inline-block;
            margin-top: 20px;
            background-color: #007bff;
            color: white;
            padding: 8px 16px;
            text-decoration: none;
            border-radius: 5px;
          }
          .back-link:hover {
            background-color: #0056b3;
          }
        </style>
      </head>
      <body>
        <h1>Meeting Details - API Key Required</h1>
        <div class="error">
          The Punting Form API key needs to be configured in the server environment variables.
        </div>
        <div class="steps">
          <p>To set up the API key:</p>
          <ol>
            <li>Create a file named <code>.env.local</code> in the project root</li>
            <li>Add your Punting Form API key: <code>PUNTING_FORM_API_KEY=your_api_key_here</code></li>
            <li>Restart the development server</li>
          </ol>
        </div>
        <a href="/live-racing" class="back-link">Back to Live Racing</a>
      </body>
      </html>
      `,
      {
        status: 500,
        headers: {
          'Content-Type': 'text/html',
        },
      }
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

  // Format the meeting date
  const meetingDate = new Date(sampleData.meeting.meetingDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  // Generate HTML for races
  const racesHtml = sampleData.meeting.races.map(race => `
    <div class="race-card">
      <h3>Race ${race.raceNumber}</h3>
      <p>${race.raceName}</p>
      <p class="race-details">Distance: ${race.distance}m | Runners: ${race.numberOfRunners}</p>
    </div>
  `).join('');

  // Return HTML response
  return new Response(
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Meeting Details - ${sampleData.meeting.name}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
          background-color: #f5f5f5;
        }
        h1, h2, h3 {
          color: #2c3e50;
        }
        h1 {
          border-bottom: 1px solid #eee;
          padding-bottom: 10px;
        }
        .meeting-id {
          color: #6c757d;
          font-size: 0.9rem;
        }
        .section {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          padding: 20px;
          margin-bottom: 20px;
        }
        .info-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-bottom: 20px;
        }
        .info-card {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
        }
        .info-card h3 {
          margin-top: 0;
          border-bottom: 1px solid #dee2e6;
          padding-bottom: 8px;
        }
        .races-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 20px;
        }
        .race-card {
          background-color: #f8f9fa;
          padding: 15px;
          border-radius: 5px;
          border: 1px solid #dee2e6;
          transition: border-color 0.2s;
        }
        .race-card:hover {
          border-color: #007bff;
        }
        .race-card h3 {
          margin-top: 0;
          color: #007bff;
        }
        .race-details {
          color: #6c757d;
          font-size: 0.9rem;
        }
        .back-link {
          display: inline-block;
          margin-top: 20px;
          background-color: #007bff;
          color: white;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 5px;
        }
        .back-link:hover {
          background-color: #0056b3;
        }
        .text-center {
          text-align: center;
        }
      </style>
    </head>
    <body>
      <h1>Meeting Details</h1>
      <p class="meeting-id">Meeting ID: ${meetingId}</p>
      
      <div class="section">
        <h2 class="text-center">${sampleData.meeting.name}</h2>
        
        <div class="info-grid">
          <div class="info-card">
            <h3>Location</h3>
            <p>${sampleData.meeting.track.name} - ${sampleData.meeting.track.location}, ${sampleData.meeting.track.state}</p>
          </div>
          
          <div class="info-card">
            <h3>Details</h3>
            <p>Date: ${meetingDate}<br>Races: ${sampleData.meeting.races.length}</p>
          </div>
        </div>
        
        <div class="text-center">
          <a href="/live-racing" class="back-link">Back to Live Racing</a>
        </div>
      </div>

      <div class="section">
        <h2 class="text-center">Races</h2>
        
        <div class="races-grid">
          ${racesHtml}
        </div>
      </div>
    </body>
    </html>
    `,
    {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    }
  );
}