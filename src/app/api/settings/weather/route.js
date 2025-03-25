import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Path to the settings file
const settingsFilePath = path.join(process.cwd(), 'data', 'settings', 'weather-api.json');

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
  provider: 'openweather',
  apiKey: '',
  endpoint: '',
  updateFrequency: '1hour',
  trackIntegration: 'automatic',
  locations: {
    flemington: true,
    moonee: true,
    caulfield: true,
    randwick: true,
    rosehill: true
  }
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
    console.error('Error reading weather API settings:', error);
    return NextResponse.json(
      { error: 'Failed to read weather API settings' },
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

    // Write the settings to the file
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: 'Weather API settings saved successfully' });
  } catch (error) {
    console.error('Error saving weather API settings:', error);
    return NextResponse.json(
      { error: 'Failed to save weather API settings' },
      { status: 500 }
    );
  }
}