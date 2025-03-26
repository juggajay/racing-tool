# Racing Tool API Documentation

This document provides information about the APIs available in the Racing Tool application.

## Racing Data API

The Racing Data API provides access to horse racing data from the Punting Form API. It offers both GET and POST endpoints for retrieving different types of racing data.

### Base URL

```
/api/racing-data
```

### GET Endpoint

The GET endpoint allows you to retrieve racing data based on various parameters.

#### Parameters

- `endpoint` (optional): The Punting Form API endpoint to use. Default is 'ExportMeetings'.
  - Available values: 'ExportMeetings', 'ExportRaces', 'ExportFields'
- `date` (optional): The date for which to retrieve data in ISO format (YYYY-MM-DD). Default is today.
- `includeBarrierTrials` (optional): Whether to include barrier trials. Default is false.
- `raceId` (optional): The ID of a specific race. Used for filtering fields.
- `meetingId` (optional): The ID of a specific meeting. Used for filtering races.
- `skipCache` (optional): Whether to bypass the cache and fetch fresh data. Default is false.

#### Examples

1. Get all meetings for today:
```
GET /api/racing-data
```

2. Get all meetings for a specific date:
```
GET /api/racing-data?date=2025-03-26
```

3. Get races for a specific meeting:
```
GET /api/racing-data?endpoint=ExportRaces&meetingId=176739
```

4. Get fields for a specific race:
```
GET /api/racing-data?endpoint=ExportFields&raceId=868438
```

### POST Endpoint

The POST endpoint provides more complex operations that may require multiple API calls or data processing.

#### Request Body

```json
{
  "action": "actionName",
  "date": "YYYY-MM-DD",
  "includeBarrierTrials": false,
  "raceId": "raceId",
  "meetingId": "meetingId"
}
```

#### Available Actions

1. `getMeetingsWithRaces`: Get all meetings with their races.
   - Required parameters: none
   - Optional parameters: `date`, `includeBarrierTrials`

2. `getRaceWithFields`: Get a specific race with its fields.
   - Required parameters: `raceId`
   - Optional parameters: `date`, `includeBarrierTrials`, `meetingId`

#### Examples

1. Get all meetings with their races:
```json
POST /api/racing-data
{
  "action": "getMeetingsWithRaces",
  "date": "2025-03-26"
}
```

2. Get a specific race with its fields:
```json
POST /api/racing-data
{
  "action": "getRaceWithFields",
  "raceId": "868438",
  "meetingId": "176739"
}
```

## Test API

The Test API provides a simple way to test the Racing Data API.

### Base URL

```
/api/test
```

### GET Endpoint

#### Parameters

- `type` (optional): The type of test to run. Default is 'meetings'.
  - Available values: 'meetings', 'races', 'fields', 'complex'
- `meetingId` (required for 'races' and 'complex' types): The ID of a specific meeting.
- `raceId` (required for 'fields' and optional for 'complex' types): The ID of a specific race.

#### Examples

1. Test getting all meetings:
```
GET /api/test
```

2. Test getting races for a specific meeting:
```
GET /api/test?type=races&meetingId=176739
```

3. Test getting fields for a specific race:
```
GET /api/test?type=fields&raceId=868438
```

4. Test complex operation (getRaceWithFields):
```
GET /api/test?type=complex&raceId=868438&meetingId=176739
```

## Punting Form API Integration

The Racing Data API integrates with the Punting Form API (https://www.puntingform.com.au/) using the FormDataService API. For more information about the Punting Form API, see the [API documentation](https://documenter.getpostman.com/view/10712595/TzJu8wZa).

### API Key

The API uses the following API key for authentication with the Punting Form API:
```
5b0df8bf-da9a-4d1e-995d-9b7a002aa836
```

In a production environment, this key should be stored securely in environment variables.

### Caching

The Racing Data API implements caching to improve performance and reduce the number of requests to the Punting Form API. The cache duration is set to 5 minutes by default.

To bypass the cache and fetch fresh data, use the `skipCache=true` parameter with the GET endpoint.