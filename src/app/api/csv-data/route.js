// CSV Data API
// This API handles CSV racing data and provides structured access to it

import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { parseCSV } from '@/utils/csvParser';

// Path to store uploaded CSV files
const dataDir = path.join(process.cwd(), 'data', 'csv');

// Ensure the data directory exists
const ensureDataDirExists = () => {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Get parameters from query
    const filename = searchParams.get('filename');
    const marketId = searchParams.get('marketId');
    const eventId = searchParams.get('eventId');
    const runnerId = searchParams.get('runnerId');
    
    // List available CSV files if no filename is provided
    if (!filename) {
      ensureDataDirExists();
      
      // Get list of CSV files in the data directory
      const files = fs.existsSync(dataDir) 
        ? fs.readdirSync(dataDir).filter(file => file.endsWith('.csv'))
        : [];
      
      return NextResponse.json({
        success: true,
        files,
        message: files.length > 0 
          ? 'Use the filename parameter to access a specific file' 
          : 'No CSV files found. Upload files using POST request.'
      });
    }
    
    // Check if the file exists
    const filePath = path.join(dataDir, filename);
    if (!fs.existsSync(filePath)) {
      return NextResponse.json(
        { error: `File not found: ${filename}` },
        { status: 404 }
      );
    }
    
    // Read and parse the CSV file
    const csvData = fs.readFileSync(filePath, 'utf8');
    const parsedData = parseCSV(csvData);
    
    // Filter data if parameters are provided
    let filteredData = parsedData.data;
    
    if (marketId) {
      filteredData = filteredData.filter(row => row.market_id === marketId);
    }
    
    if (eventId) {
      filteredData = filteredData.filter(row => row.event_id === eventId);
    }
    
    if (runnerId) {
      filteredData = filteredData.filter(row => row.runner_id === runnerId);
    }
    
    // Group data by market for easier consumption
    const groupedData = {};
    
    filteredData.forEach(row => {
      const marketKey = row.market_id;
      
      if (!groupedData[marketKey]) {
        groupedData[marketKey] = {
          market_id: row.market_id,
          market_name: row.market_name,
          event_name: row.event_name,
          event_id: row.event_id,
          market_time: row.market_time,
          status: row.status,
          runners: []
        };
      }
      
      groupedData[marketKey].runners.push({
        runner_id: row.runner_id,
        runner_name: row.runner_name,
        runner_status: row.runner_status,
        sort_priority: row.sort_priority
      });
    });
    
    return NextResponse.json({
      success: true,
      filename,
      headers: parsedData.headers,
      data: filteredData,
      markets: Object.values(groupedData),
      count: filteredData.length
    });
  } catch (error) {
    console.error('CSV Data API error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to process CSV data',
        message: error.message,
        details: 'An unexpected error occurred while processing the CSV data'
      },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    // Ensure the data directory exists
    ensureDataDirExists();
    
    // Check if the request is multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle file upload
      const formData = await request.formData();
      const file = formData.get('file');
      
      if (!file || !(file instanceof File)) {
        return NextResponse.json(
          { error: 'No file provided' },
          { status: 400 }
        );
      }
      
      // Check if the file is a CSV
      if (!file.name.endsWith('.csv')) {
        return NextResponse.json(
          { error: 'Only CSV files are supported' },
          { status: 400 }
        );
      }
      
      // Read the file content
      const fileContent = await file.text();
      
      // Validate CSV format
      try {
        parseCSV(fileContent);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid CSV format', details: error.message },
          { status: 400 }
        );
      }
      
      // Save the file
      const filename = file.name;
      const filePath = path.join(dataDir, filename);
      
      fs.writeFileSync(filePath, fileContent);
      
      return NextResponse.json({
        success: true,
        message: `File ${filename} uploaded successfully`,
        filename
      });
    } else if (contentType.includes('application/json')) {
      // Handle JSON data with CSV content
      const { csvData, filename } = await request.json();
      
      if (!csvData) {
        return NextResponse.json(
          { error: 'No CSV data provided' },
          { status: 400 }
        );
      }
      
      if (!filename || !filename.endsWith('.csv')) {
        return NextResponse.json(
          { error: 'Invalid filename. Must end with .csv' },
          { status: 400 }
        );
      }
      
      // Validate CSV format
      try {
        parseCSV(csvData);
      } catch (error) {
        return NextResponse.json(
          { error: 'Invalid CSV format', details: error.message },
          { status: 400 }
        );
      }
      
      // Save the data
      const filePath = path.join(dataDir, filename);
      fs.writeFileSync(filePath, csvData);
      
      return NextResponse.json({
        success: true,
        message: `File ${filename} saved successfully`,
        filename
      });
    } else {
      return NextResponse.json(
        { error: 'Unsupported content type' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('CSV Data API error:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to process CSV data',
        message: error.message,
        details: 'An unexpected error occurred while processing the CSV data'
      },
      { status: 500 }
    );
  }
}