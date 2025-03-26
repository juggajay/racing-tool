import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the settings file
const settingsFilePath = path.join(process.cwd(), 'data', 'settings', 'punting-form-api.json');

// Ensure the directory exists
const ensureDirectoryExists = (filePath) => {
  const dirname = path.dirname(filePath);
  if (fs.existsSync(dirname)) {
    return true;
  }
  fs.mkdirSync(dirname, { recursive: true });
};

// Default settings
const defaultSettings = {
  apiKey: '',
  endpoint: 'https://www.puntingform.com.au/api',
  isValid: false,
  lastValidated: null
};

// GET handler to retrieve settings
export async function GET() {
  try {
    // Check if the settings file exists
    if (!fs.existsSync(settingsFilePath)) {
      // Return default settings if file doesn't exist
      return NextResponse.json(defaultSettings);
    }

    // Read the settings file
    const settingsData = fs.readFileSync(settingsFilePath, 'utf8');
    const settings = JSON.parse(settingsData);

    return NextResponse.json(settings);
  } catch (error) {
    console.error('Error reading Punting Form API settings:', error);
    return NextResponse.json(
      { error: 'Failed to read Punting Form API settings' },
      { status: 500 }
    );
  }
}

// POST handler to save settings
export async function POST(request) {
  try {
    const settings = await request.json();

    // Validate settings
    if (!settings || typeof settings !== 'object') {
      return NextResponse.json(
        { error: 'Invalid settings data' },
        { status: 400 }
      );
    }

    // Ensure the directory exists
    ensureDirectoryExists(settingsFilePath);

    // Validate the API key by making a test request
    let isValid = false;
    let validationError = null;

    try {
      // Try to validate the API key with a simple request
      const apiKey = settings.apiKey;
      const endpoint = settings.endpoint || 'https://www.puntingform.com.au/api';
      
      // Use the GetMeetingsByDate endpoint for validation
      const today = new Date().toISOString().split('T')[0];
      const testUrl = `${endpoint}/GetMeetingsByDate?date=${today}&ApiKey=${apiKey}`;
      
      const response = await fetch(testUrl, {
        method: 'GET',
        headers: {
          'Accept': '*/*',
          'User-Agent': 'Racing-Tool/1.0'
        },
        signal: AbortSignal.timeout(10000) // 10 seconds timeout
      });
      
      if (response.ok) {
        isValid = true;
      } else {
        validationError = `API returned status ${response.status}: ${response.statusText}`;
      }
    } catch (error) {
      validationError = `Validation error: ${error.message}`;
    }

    // Update settings with validation results
    const updatedSettings = {
      ...settings,
      isValid,
      lastValidated: new Date().toISOString(),
      validationError: isValid ? null : validationError
    };

    // Write the settings to the file
    fs.writeFileSync(settingsFilePath, JSON.stringify(updatedSettings, null, 2), 'utf8');

    return NextResponse.json({ 
      success: true, 
      message: isValid ? 'Punting Form API settings saved and validated successfully' : 'Settings saved but API validation failed',
      isValid,
      validationError
    });
  } catch (error) {
    console.error('Error saving Punting Form API settings:', error);
    return NextResponse.json(
      { error: 'Failed to save Punting Form API settings', details: error.message },
      { status: 500 }
    );
  }
}