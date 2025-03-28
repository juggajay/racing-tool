// API endpoint for handling backtest requests
import { NextResponse } from 'next/server';

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

export async function POST(request) {
  try {
    // Parse the request body
    const data = await request.json();
    
    // Log the received data for debugging
    console.log('Received backtest request:', data);
    
    // Extract parameters from the request
    const model = data.model || 'ensemble';
    const timePeriods = data.timePeriods || 5;
    const bettingStrategy = data.bettingStrategy || 'value';
    
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
    
    // Generate mock results for each time period
    const periodResults = [];
    const today = new Date();
    
    for (let i = 0; i < timePeriods; i++) {
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
    
    // Return the mock results
    return NextResponse.json(response);
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