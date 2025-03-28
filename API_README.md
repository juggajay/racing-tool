# Racing Tool API Documentation

This document provides information about the APIs available in the Racing Tool application.

## Unified Racing API

The Unified Racing API combines data from multiple sources to provide a comprehensive racing data endpoint. It integrates race fields, odds, weather, and comments data into a single API.

### Base URL

```
/api/unified-racing
```

### GET Endpoint

The GET endpoint allows you to retrieve racing data based on various parameters.

#### Parameters

- `action` (optional): The type of data to retrieve. Default is 'races'.
  - Available values: 'races', 'race', 'horse', 'results'
- `date` (optional): The date for which to retrieve data in ISO format (YYYY-MM-DD). Default is today.
- `trackCode` (optional): The code of a specific track (e.g., 'FLE' for Flemington).
- `raceId` (required for 'race' action): The ID of a specific race.
- `horseId` (required for 'horse' action): The ID of a specific horse.
- `includeOdds` (optional): Whether to include odds data. Default is true.
- `includeWeather` (optional): Whether to include weather data. Default is true.
- `includeComments` (optional): Whether to include comments data. Default is true.

#### Examples

1. Get all races for today:
```
GET /api/unified-racing
```

2. Get all races for a specific date:
```
GET /api/unified-racing?date=2025-03-28
```

3. Get races for a specific track:
```
GET /api/unified-racing?trackCode=FLE
```

4. Get a specific race with all related data:
```
GET /api/unified-racing?action=race&raceId=12345
```

5. Get details for a specific horse:
```
GET /api/unified-racing?action=horse&horseId=6789
```

6. Get race results:
```
GET /api/unified-racing?action=results&date=2025-03-28
```

7. Get races without additional data:
```
GET /api/unified-racing?includeOdds=false&includeWeather=false&includeComments=false
```

## Punting Form API

The Punting Form API provides access to horse racing data from the Punting Form service. It supports various endpoints for retrieving different types of racing data.

### Base URL

```
/api/punting-form
```

### GET Endpoint

#### Parameters

- `endpoint` (required): The Punting Form API endpoint to use.
  - Available values: 'form/comment', 'race', 'horse', 'form/fields', 'form/results'
- `date` (optional): The date for which to retrieve data (DD-Mon-YYYY format, e.g., 28-Mar-2025). Default is today.
- `raceId` (required for 'race' endpoint): The ID of a specific race.
- `horseId` (required for 'horse' endpoint): The ID of a specific horse.
- `trackCode` (optional for 'form/fields' and 'form/results' endpoints): The code of a specific track.
- `raceNumber` (optional for 'form/fields' endpoint): The number of a specific race.
- `endDate` (optional for 'form/results' endpoint): The end date for which to retrieve data.

#### Examples

1. Get comments for today:
```
GET /api/punting-form?endpoint=form/comment
```

2. Get a specific race:
```
GET /api/punting-form?endpoint=race&raceId=12345
```

3. Get details for a specific horse:
```
GET /api/punting-form?endpoint=horse&horseId=6789
```

4. Get race fields for a specific date:
```
GET /api/punting-form?endpoint=form/fields&date=28-Mar-2025
```

5. Get race results for a specific date range:
```
GET /api/punting-form?endpoint=form/results&date=28-Mar-2025&endDate=29-Mar-2025
```

## Racing Data API

The Racing Data API provides access to horse racing data using static mock data. It offers both GET and POST endpoints for retrieving different types of racing data.

### Base URL

```
/api/racing-data
```

### GET Endpoint

The GET endpoint allows you to retrieve racing data based on various parameters.

#### Parameters

- `endpoint` (optional): The endpoint to use. Default is 'races'.
  - Available values: 'races', 'horses'
- `date` (optional): The date for which to retrieve data in ISO format (YYYY-MM-DD). Default is today.
- `track` (optional): The name of a specific track.
- `race_number` (optional): The number of a specific race.
- `horse_id` (optional): The ID of a specific horse.

#### Examples

1. Get all races:
```
GET /api/racing-data
```

2. Get races for a specific track:
```
GET /api/racing-data?track=Flemington
```

3. Get a specific race:
```
GET /api/racing-data?track=Flemington&race_number=1
```

4. Get details for a specific horse:
```
GET /api/racing-data?endpoint=horses&horse_id=horse_1
```

### POST Endpoint

The POST endpoint provides more complex operations that may require multiple API calls or data processing.

#### Request Body

```json
{
  "action": "actionName",
  "date": "YYYY-MM-DD",
  "track": "trackName",
  "raceNumber": "raceNumber",
  "horseId": "horseId"
}
```

#### Available Actions

1. `getRaceWithEntries`: Get a specific race with its entries.
   - Required parameters: `track`, `raceNumber`
   - Optional parameters: `date`

2. `getHorseDetails`: Get details for a specific horse.
   - Required parameters: `horseId`

3. `getRacesByTrack`: Get races for a specific track.
   - Required parameters: `track`
   - Optional parameters: `date`

4. `getRacesByDate`: Get races for a specific date.
   - Required parameters: `date`

## Odds API

The Odds API provides betting odds data for horse races. It offers both GET and POST endpoints for retrieving and analyzing odds data.

### Base URL

```
/api/odds
```

### GET Endpoint

#### Parameters

- `race_id` (optional): The ID of a specific race.
- `horse_id` (optional): The ID of a specific horse.
- `bet_type` (optional): The type of bet: 'win', 'place', 'exacta', 'trifecta'.
- `include_trends` (optional): Whether to include betting trends data. Default is false.

#### Examples

1. Get odds for all races:
```
GET /api/odds
```

2. Get odds for a specific race:
```
GET /api/odds?race_id=1
```

3. Get win odds for a specific horse:
```
GET /api/odds?race_id=1&horse_id=101&bet_type=win
```

4. Get odds with betting trends:
```
GET /api/odds?race_id=1&include_trends=true
```

## Weather API

The Weather API provides weather and track condition data for racecourses. It offers both GET and POST endpoints for retrieving and analyzing weather data.

### Base URL

```
/api/weather
```

### GET Endpoint

#### Parameters

- `location` (required): The name of the racecourse.
- `type` (optional): The type of data to retrieve: 'track', 'weather', or 'all'. Default is 'all'.
- `date` (optional): The date for which to retrieve data in ISO format (YYYY-MM-DD). Default is today.

#### Examples

1. Get weather and track conditions for a specific location:
```
GET /api/weather?location=Flemington%20Racecourse
```

2. Get only track conditions:
```
GET /api/weather?location=Flemington%20Racecourse&type=track
```

3. Get weather and track conditions for a specific date:
```
GET /api/weather?location=Flemington%20Racecourse&date=2025-03-28
```

## Test API

The Test API provides a simple way to test the Racing Data API.

### Base URL

```
/api/test
```

### GET Endpoint

#### Parameters

- `type` (optional): The type of test to run. Default is 'races'.
  - Available values: 'races', 'race', 'complex'
- `track` (optional): The name of a specific track.
- `race_number` (optional): The number of a specific race.
- `date` (optional): The date for which to retrieve data in ISO format (YYYY-MM-DD). Default is today.

#### Examples

1. Test getting all races:
```
GET /api/test
```

2. Test getting races for a specific track:
```
GET /api/test?type=races&track=Flemington
```

3. Test getting a specific race:
```
GET /api/test?type=race&track=Flemington&race_number=1
```

## API Test Pages

The Racing Tool includes HTML test pages that allow you to test the APIs directly in your browser:

- `/api-test.html` - Test the Punting Form API
- `/api-direct-test.html` - Test direct API calls to the Punting Form API
- `/racing-test.html` - Test the Racing Data API
- `/unified-api-test.html` - Test the Unified Racing API
- `/api-docs.html` - View the complete API documentation

## API Key

The APIs use the following API key for authentication with the Punting Form API:
```
5b0df8bf-da9a-4d1e-995d-9b7a002aa836
```

In a production environment, this key should be stored securely in environment variables.

## Caching

The APIs implement caching to improve performance and reduce the number of requests to external services. The cache duration is set to 5 minutes by default.