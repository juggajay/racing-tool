// API endpoint for handling backtest requests
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { updateProgress } from './progress/route';

// Helper function to generate random accuracy between min and max
function randomAccuracy(min, max) {
  return (Math.random() * (max - min) + min).toFixed(1);
}

// Helper function to generate random ROI between min and max
function randomROI(min, max) {
  return (Math.random() * (max - min) + min).toFixed(1);
}

// Helper function to format date as "Mar 28, 2025"
function formatDate(date) {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

// Helper function to save uploaded file to temp directory
async function saveFile(formData) {
  const file = formData.get('file');
  if (!file) {
    throw new Error('No file uploaded');
  }

  // Create a temporary directory to store the file
  const tempDir = path.join(os.tmpdir(), 'racing-tool-uploads');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }

  // Generate a unique filename
  const fileName = `${Date.now()}-${file.name}`;
  const filePath = path.join(tempDir, fileName);

  // Convert the file to a Buffer and save it
  const fileBuffer = Buffer.from(await file.arrayBuffer());
  fs.writeFileSync(filePath, fileBuffer);

  return {
    originalName: file.name,
    path: filePath,
    size: file.size,
    type: file.type
  };
}

// Helper function to process the uploaded file
async function processFile(filePath, model, timePeriods, bettingStrategy, sessionId) {
  // In a real implementation, this would parse the file and run the backtest
  // For now, we'll just return mock data based on the model
  console.log(`Processing file: ${filePath}`);
  console.log(`Model: ${model}, Time Periods: ${timePeriods}, Betting Strategy: ${bettingStrategy}`);

  // Update progress to 10% - Starting file processing
  updateProgress(10, "Reading file...", sessionId);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Update progress to 20% - File read complete
  updateProgress(20, "Parsing data...", sessionId);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Update progress to 30% - Data parsing complete
  updateProgress(30, "Preparing model...", sessionId);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Return mock results based on the model
  let top1Accuracy, top3Accuracy, top4Accuracy, roi;
  
  switch (model) {
    case 'ensemble':
      top1Accuracy = randomAccuracy(30, 35);
      top3Accuracy = randomAccuracy(55, 65);
      top4Accuracy = randomAccuracy(70, 80);
      roi = randomROI(7, 10);
      break;
    case 'random_forest':
      top1Accuracy = randomAccuracy(25, 30);
      top3Accuracy = randomAccuracy(50, 60);
      top4Accuracy = randomAccuracy(65, 75);
      roi = randomROI(4, 7);
      break;
    case 'gradient_boosting':
      top1Accuracy = randomAccuracy(28, 33);
      top3Accuracy = randomAccuracy(52, 62);
      top4Accuracy = randomAccuracy(68, 78);
      roi = randomROI(6, 9);
      break;
    default:
      top1Accuracy = randomAccuracy(25, 35);
      top3Accuracy = randomAccuracy(50, 65);
      top4Accuracy = randomAccuracy(65, 80);
      roi = randomROI(4, 10);
  }

  // Update progress to 50% - Model preparation complete
  updateProgress(50, "Running backtest...", sessionId);
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Generate mock results for each time period
  const periodResults = [];
  const today = new Date();
  
  for (let i = 0; i < timePeriods; i++) {
    // Update progress during period processing
    const progressIncrement = 30 / timePeriods; // 30% of progress for all periods
    updateProgress(50 + (i * progressIncrement), `Processing period ${i + 1} of ${timePeriods}...`, sessionId);
    await new Promise(resolve => setTimeout(resolve, 500));

    const periodDate = new Date(today);
    periodDate.setDate(periodDate.getDate() - i * 7); // Each period is a week apart
    
    periodResults.push({
      period: i + 1,
      date: formatDate(periodDate),
      top1Accuracy: (parseFloat(top1Accuracy) + (Math.random() * 4 - 2)).toFixed(1),
      top3Accuracy: (parseFloat(top3Accuracy) + (Math.random() * 4 - 2)).toFixed(1),
      top4Accuracy: (parseFloat(top4Accuracy) + (Math.random() * 4 - 2)).toFixed(1),
      roi: (parseFloat(roi) + (Math.random() * 2 - 1)).toFixed(1)
    });
  }
  
  // Update progress to 80% - Period processing complete
  updateProgress(80, "Generating race predictions...", sessionId);
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Generate mock race predictions
  const racePredictions = [];
  const raceNames = [
    'Flemington R1', 'Randwick R3', 'Caulfield R2', 'Moonee Valley R5',
    'Rosehill R4', 'Eagle Farm R2', 'Doomben R6', 'Morphettville R3'
  ];
  
  for (let i = 0; i < 8; i++) {
    const predicted = Math.floor(Math.random() * 12) + 1;
    const actual = Math.random() < 0.3 ? predicted : Math.floor(Math.random() * 12) + 1;
    
    racePredictions.push({
      race: raceNames[i],
      predictedWinner: `Horse ${predicted}`,
      predictedOdds: (Math.random() * 10 + 2).toFixed(1),
      actualWinner: `Horse ${actual}`,
      actualOdds: (Math.random() * 10 + 2).toFixed(1),
      correct: predicted === actual
    });
  }

  // Update progress to 95% - Race predictions complete
  updateProgress(95, "Finalizing results...", sessionId);
  await new Promise(resolve => setTimeout(resolve, 500));

  return {
    top1Accuracy,
    top3Accuracy,
    top4Accuracy,
    roi,
    periodResults,
    racePredictions
  };
}

export async function POST(request) {
  try {
    // Generate a unique session ID for this request
    const sessionId = Date.now().toString();
    
    // Initialize progress
    updateProgress(0, "Starting...", sessionId);
    
    // Check if the request is multipart/form-data
    const contentType = request.headers.get('content-type') || '';
    
    if (contentType.includes('multipart/form-data')) {
      // Handle form data with file upload
      const formData = await request.formData();
      
      // Extract parameters from the form data
      const model = formData.get('model') || 'ensemble';
      const timePeriods = parseInt(formData.get('timePeriods') || '5', 10);
      const bettingStrategy = formData.get('bettingStrategy') || 'value';
      
      // Log the received data for debugging
      console.log('Received backtest request with file upload:');
      console.log(`Model: ${model}, Time Periods: ${timePeriods}, Betting Strategy: ${bettingStrategy}`);
      
      // Update progress to 5% - Request received
      updateProgress(5, "Uploading file...", sessionId);
      
      // Save the uploaded file
      const fileInfo = await saveFile(formData);
      console.log('File saved:', fileInfo);
      
      // Process the file
      const results = await processFile(fileInfo.path, model, timePeriods, bettingStrategy, sessionId);
      
      // Create the response
      const response = {
        id: `BT${Date.now().toString().substring(6)}`,
        date: formatDate(new Date()),
        model,
        timePeriods,
        bettingStrategy,
        summary: {
          top1Accuracy: `${results.top1Accuracy}%`,
          top3Accuracy: `${results.top3Accuracy}%`,
          top4Accuracy: `${results.top4Accuracy}%`,
          roi: `${results.roi}%`,
          totalRaces: Math.floor(Math.random() * 100) + 100,
          correctPredictions: Math.floor(Math.random() * 40) + 20
        },
        periodResults: results.periodResults,
        racePredictions: results.racePredictions,
        computationTime: (Math.random() * 5 + 2).toFixed(1),
        fileInfo: {
          name: fileInfo.originalName,
          size: fileInfo.size
        }
      };
      
      // Update progress to 100% - Processing complete
      updateProgress(100, "Complete", sessionId);
      
      // Clean up the temporary file
      try {
        fs.unlinkSync(fileInfo.path);
      } catch (err) {
        console.error('Error deleting temporary file:', err);
      }
      
      // Return the results
      return NextResponse.json(response);
    } else {
      // Handle JSON request (backward compatibility)
      const data = await request.json();
      
      // Log the received data for debugging
      console.log('Received backtest request:', data);
      
      // Extract parameters from the request
      const model = data.model || 'ensemble';
      const timePeriods = data.timePeriods || 5;
      const bettingStrategy = data.bettingStrategy || 'value';
      
      // Update progress to 10% - Request received
      updateProgress(10, "Processing request...", sessionId);
      
      // Generate mock results based on the model
      let top1Accuracy, top3Accuracy, top4Accuracy, roi;
      
      switch (model) {
        case 'ensemble':
          top1Accuracy = randomAccuracy(30, 35);
          top3Accuracy = randomAccuracy(55, 65);
          top4Accuracy = randomAccuracy(70, 80);
          roi = randomROI(7, 10);
          break;
        case 'random_forest':
          top1Accuracy = randomAccuracy(25, 30);
          top3Accuracy = randomAccuracy(50, 60);
          top4Accuracy = randomAccuracy(65, 75);
          roi = randomROI(4, 7);
          break;
        case 'gradient_boosting':
          top1Accuracy = randomAccuracy(28, 33);
          top3Accuracy = randomAccuracy(52, 62);
          top4Accuracy = randomAccuracy(68, 78);
          roi = randomROI(6, 9);
          break;
        default:
          top1Accuracy = randomAccuracy(25, 35);
          top3Accuracy = randomAccuracy(50, 65);
          top4Accuracy = randomAccuracy(65, 80);
          roi = randomROI(4, 10);
      }
      
      // Update progress to 40% - Model preparation complete
      updateProgress(40, "Running backtest...", sessionId);
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate mock results for each time period
      const periodResults = [];
      const today = new Date();
      
      for (let i = 0; i < timePeriods; i++) {
        // Update progress during period processing
        const progressIncrement = 40 / timePeriods; // 40% of progress for all periods
        updateProgress(40 + (i * progressIncrement), `Processing period ${i + 1} of ${timePeriods}...`, sessionId);
        await new Promise(resolve => setTimeout(resolve, 300));

        const periodDate = new Date(today);
        periodDate.setDate(periodDate.getDate() - i * 7); // Each period is a week apart
        
        periodResults.push({
          period: i + 1,
          date: formatDate(periodDate),
          top1Accuracy: (parseFloat(top1Accuracy) + (Math.random() * 4 - 2)).toFixed(1),
          top3Accuracy: (parseFloat(top3Accuracy) + (Math.random() * 4 - 2)).toFixed(1),
          top4Accuracy: (parseFloat(top4Accuracy) + (Math.random() * 4 - 2)).toFixed(1),
          roi: (parseFloat(roi) + (Math.random() * 2 - 1)).toFixed(1)
        });
      }
      
      // Update progress to 80% - Period processing complete
      updateProgress(80, "Generating race predictions...", sessionId);
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Generate mock race predictions
      const racePredictions = [];
      const raceNames = [
        'Flemington R1', 'Randwick R3', 'Caulfield R2', 'Moonee Valley R5',
        'Rosehill R4', 'Eagle Farm R2', 'Doomben R6', 'Morphettville R3'
      ];
      
      for (let i = 0; i < 8; i++) {
        const predicted = Math.floor(Math.random() * 12) + 1;
        const actual = Math.random() < 0.3 ? predicted : Math.floor(Math.random() * 12) + 1;
        
        racePredictions.push({
          race: raceNames[i],
          predictedWinner: `Horse ${predicted}`,
          predictedOdds: (Math.random() * 10 + 2).toFixed(1),
          actualWinner: `Horse ${actual}`,
          actualOdds: (Math.random() * 10 + 2).toFixed(1),
          correct: predicted === actual
        });
      }
      
      // Update progress to 95% - Race predictions complete
      updateProgress(95, "Finalizing results...", sessionId);
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Create the response
      const response = {
        id: `BT${Date.now().toString().substring(6)}`,
        date: formatDate(today),
        model,
        timePeriods,
        bettingStrategy,
        summary: {
          top1Accuracy: `${top1Accuracy}%`,
          top3Accuracy: `${top3Accuracy}%`,
          top4Accuracy: `${top4Accuracy}%`,
          roi: `${roi}%`,
          totalRaces: Math.floor(Math.random() * 100) + 100,
          correctPredictions: Math.floor(Math.random() * 40) + 20
        },
        periodResults,
        racePredictions,
        computationTime: (Math.random() * 5 + 2).toFixed(1)
      };
      
      // Update progress to 100% - Processing complete
      updateProgress(100, "Complete", sessionId);
      
      // Return the mock results
      return NextResponse.json(response);
    }
  } catch (error) {
    console.error('Error processing backtest request:', error);
    
    return NextResponse.json(
      {
        error: 'Failed to process backtest request',
        message: error.message
      },
      { status: 500 }
    );
  }
}