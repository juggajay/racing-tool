// Mock data for demonstration purposes
// In a real application, you would fetch this data from an external betting API
const oddsData = {
  races: {
    "1": { // Melbourne Cup
      win: {
        "101": { horse: 'Northern Star', odds: 6.5, fluctuation: -0.5 },
        "102": { horse: 'Swift Thunder', odds: 8.0, fluctuation: +0.5 },
        "103": { horse: 'Midnight Runner', odds: 10.0, fluctuation: -1.0 },
        "104": { horse: 'Golden Horizon', odds: 12.0, fluctuation: 0 },
        "105": { horse: 'Silver Streak', odds: 15.0, fluctuation: +2.0 },
      },
      place: {
        "101": { horse: 'Northern Star', odds: 2.2, fluctuation: -0.1 },
        "102": { horse: 'Swift Thunder', odds: 2.5, fluctuation: +0.2 },
        "103": { horse: 'Midnight Runner', odds: 3.0, fluctuation: -0.3 },
        "104": { horse: 'Golden Horizon', odds: 3.5, fluctuation: 0 },
        "105": { horse: 'Silver Streak', odds: 4.0, fluctuation: +0.5 },
      },
      exacta: [
        { combination: [101, 102], odds: 45.0 },
        { combination: [101, 103], odds: 55.0 },
        { combination: [101, 104], odds: 65.0 },
        { combination: [101, 105], odds: 75.0 },
        { combination: [102, 101], odds: 50.0 },
        { combination: [102, 103], odds: 60.0 },
        { combination: [102, 104], odds: 70.0 },
        { combination: [102, 105], odds: 80.0 },
      ],
      trifecta: [
        { combination: [101, 102, 103], odds: 280.0 },
        { combination: [101, 102, 104], odds: 320.0 },
        { combination: [101, 103, 102], odds: 300.0 },
        { combination: [101, 103, 104], odds: 340.0 },
        { combination: [102, 101, 103], odds: 310.0 },
        { combination: [102, 101, 104], odds: 350.0 },
      ],
      market_percentage: 118.5,
      last_updated: '2025-03-25T08:45:00.000Z'
    },
    "2": { // Cox Plate
      win: {
        "201": { horse: 'Mountain King', odds: 4.5, fluctuation: -0.2 },
        "202": { horse: 'Ocean Breeze', odds: 5.0, fluctuation: 0 },
        "203": { horse: 'Desert Storm', odds: 7.0, fluctuation: +0.5 },
        "204": { horse: 'Valley Mist', odds: 9.0, fluctuation: -0.5 },
        "205": { horse: 'Thunder Cloud', odds: 11.0, fluctuation: +1.0 },
      },
      place: {
        "201": { horse: 'Mountain King', odds: 1.8, fluctuation: -0.1 },
        "202": { horse: 'Ocean Breeze', odds: 2.0, fluctuation: 0 },
        "203": { horse: 'Desert Storm', odds: 2.4, fluctuation: +0.2 },
        "204": { horse: 'Valley Mist', odds: 2.8, fluctuation: -0.2 },
        "205": { horse: 'Thunder Cloud', odds: 3.2, fluctuation: +0.3 },
      },
      exacta: [
        { combination: [201, 202], odds: 20.0 },
        { combination: [201, 203], odds: 28.0 },
        { combination: [201, 204], odds: 36.0 },
        { combination: [201, 205], odds: 44.0 },
        { combination: [202, 201], odds: 22.0 },
        { combination: [202, 203], odds: 30.0 },
        { combination: [202, 204], odds: 38.0 },
        { combination: [202, 205], odds: 46.0 },
      ],
      trifecta: [
        { combination: [201, 202, 203], odds: 120.0 },
        { combination: [201, 202, 204], odds: 150.0 },
        { combination: [201, 203, 202], odds: 130.0 },
        { combination: [201, 203, 204], odds: 160.0 },
        { combination: [202, 201, 203], odds: 125.0 },
        { combination: [202, 201, 204], odds: 155.0 },
      ],
      market_percentage: 116.8,
      last_updated: '2025-03-25T09:15:00.000Z'
    },
    "3": { // Caulfield Cup
      win: {
        "301": { horse: 'Royal Flush', odds: 7.0, fluctuation: +0.5 },
        "302": { horse: 'Lucky Charm', odds: 8.5, fluctuation: -0.5 },
        "303": { horse: 'Victory Lane', odds: 9.0, fluctuation: 0 },
        "304": { horse: 'Champion Spirit', odds: 10.0, fluctuation: -1.0 },
        "305": { horse: 'Winning Edge', odds: 12.0, fluctuation: +1.5 },
      },
      place: {
        "301": { horse: 'Royal Flush', odds: 2.4, fluctuation: +0.2 },
        "302": { horse: 'Lucky Charm', odds: 2.6, fluctuation: -0.1 },
        "303": { horse: 'Victory Lane', odds: 2.8, fluctuation: 0 },
        "304": { horse: 'Champion Spirit', odds: 3.0, fluctuation: -0.3 },
        "305": { horse: 'Winning Edge', odds: 3.4, fluctuation: +0.4 },
      },
      exacta: [
        { combination: [301, 302], odds: 50.0 },
        { combination: [301, 303], odds: 55.0 },
        { combination: [301, 304], odds: 60.0 },
        { combination: [301, 305], odds: 70.0 },
        { combination: [302, 301], odds: 52.0 },
        { combination: [302, 303], odds: 58.0 },
        { combination: [302, 304], odds: 63.0 },
        { combination: [302, 305], odds: 73.0 },
      ],
      trifecta: [
        { combination: [301, 302, 303], odds: 320.0 },
        { combination: [301, 302, 304], odds: 350.0 },
        { combination: [301, 303, 302], odds: 330.0 },
        { combination: [301, 303, 304], odds: 360.0 },
        { combination: [302, 301, 303], odds: 325.0 },
        { combination: [302, 301, 304], odds: 355.0 },
      ],
      market_percentage: 117.2,
      last_updated: '2025-03-25T08:30:00.000Z'
    }
  },
  
  // Betting trends and market movements
  trends: {
    "1": { // Melbourne Cup
      market_confidence: 'high',
      betting_volume: 'very high',
      significant_movements: [
        { horse_id: 101, horse: 'Northern Star', previous_odds: 7.0, current_odds: 6.5, time: '2025-03-25T07:30:00.000Z' },
        { horse_id: 103, horse: 'Midnight Runner', previous_odds: 11.0, current_odds: 10.0, time: '2025-03-25T08:15:00.000Z' },
        { horse_id: 105, horse: 'Silver Streak', previous_odds: 13.0, current_odds: 15.0, time: '2025-03-25T08:00:00.000Z' },
      ],
      money_distribution: {
        "101": 32, // percentage of money bet on this horse
        "102": 25,
        "103": 18,
        "104": 15,
        "105": 10
      }
    },
    "2": { // Cox Plate
      market_confidence: 'high',
      betting_volume: 'high',
      significant_movements: [
        { horse_id: 201, horse: 'Mountain King', previous_odds: 4.7, current_odds: 4.5, time: '2025-03-25T08:45:00.000Z' },
        { horse_id: 204, horse: 'Valley Mist', previous_odds: 8.5, current_odds: 9.0, time: '2025-03-25T09:00:00.000Z' },
      ],
      money_distribution: {
        "201": 38,
        "202": 30,
        "203": 15,
        "204": 10,
        "205": 7
      }
    },
    "3": { // Caulfield Cup
      market_confidence: 'medium',
      betting_volume: 'medium',
      significant_movements: [
        { horse_id: 301, horse: 'Royal Flush', previous_odds: 6.5, current_odds: 7.0, time: '2025-03-25T07:45:00.000Z' },
        { horse_id: 302, horse: 'Lucky Charm', previous_odds: 8.0, current_odds: 8.5, time: '2025-03-25T08:00:00.000Z' },
        { horse_id: 304, horse: 'Champion Spirit', previous_odds: 11.0, current_odds: 10.0, time: '2025-03-25T08:15:00.000Z' },
      ],
      money_distribution: {
        "301": 25,
        "302": 22,
        "303": 20,
        "304": 18,
        "305": 15
      }
    }
  }
};

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parse query parameters
    const raceId = searchParams.get('race_id');
    const horseId = searchParams.get('horse_id');
    const betType = searchParams.get('bet_type'); // 'win', 'place', 'exacta', 'trifecta'
    const includeTrends = searchParams.get('include_trends') === 'true';
    
    // Validate race_id if provided
    if (raceId && !oddsData.races[raceId]) {
      return Response.json(
        { error: 'Race not found' },
        { status: 404 }
      );
    }
    
    let response = {};
    
    // Return odds for all races or a specific race
    if (!raceId) {
      // Return all races
      response.odds = oddsData.races;
      
      if (includeTrends) {
        response.trends = oddsData.trends;
      }
    } else {
      // Return specific race
      const race = oddsData.races[raceId];
      
      if (betType) {
        // Return specific bet type
        if (!race[betType]) {
          return Response.json(
            { error: 'Bet type not found' },
            { status: 404 }
          );
        }
        
        if (horseId && (betType === 'win' || betType === 'place')) {
          // Return odds for specific horse
          if (!race[betType][horseId]) {
            return Response.json(
              { error: 'Horse not found' },
              { status: 404 }
            );
          }
          
          response.odds = race[betType][horseId];
        } else {
          // Return all odds for this bet type
          response.odds = race[betType];
        }
      } else {
        // Return all bet types for this race
        response.odds = race;
      }
      
      if (includeTrends) {
        response.trends = oddsData.trends[raceId];
      }
    }
    
    return Response.json({
      success: true,
      data: response,
      last_updated: new Date().toISOString()
    });
  } catch (error) {
    console.error('Odds API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { action, raceId, horseId, betType, amount } = body;
    
    if (!action || !raceId) {
      return Response.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if race exists
    if (!oddsData.races[raceId]) {
      return Response.json(
        { error: 'Race not found' },
        { status: 404 }
      );
    }
    
    // Handle different actions
    if (action === 'calculate_payout') {
      if (!horseId || !betType || !amount) {
        return Response.json(
          { error: 'Missing required fields for payout calculation' },
          { status: 400 }
        );
      }
      
      const race = oddsData.races[raceId];
      
      if (!race[betType]) {
        return Response.json(
          { error: 'Bet type not found' },
          { status: 404 }
        );
      }
      
      let odds;
      
      if (betType === 'win' || betType === 'place') {
        if (!race[betType][horseId]) {
          return Response.json(
            { error: 'Horse not found' },
            { status: 404 }
          );
        }
        
        odds = race[betType][horseId].odds;
      } else if (betType === 'exacta' || betType === 'trifecta') {
        // For exacta and trifecta, horseId should be a comma-separated list of horse IDs
        const horseIds = horseId.split(',').map(id => parseInt(id));
        
        // Find the combination
        const combination = race[betType].find(c => 
          c.combination.length === horseIds.length && 
          c.combination.every((id, index) => id === horseIds[index])
        );
        
        if (!combination) {
          return Response.json(
            { error: 'Combination not found' },
            { status: 404 }
          );
        }
        
        odds = combination.odds;
      } else {
        return Response.json(
          { error: 'Invalid bet type' },
          { status: 400 }
        );
      }
      
      // Calculate potential payout
      const betAmount = parseFloat(amount);
      const potentialPayout = betAmount * odds;
      
      return Response.json({
        success: true,
        data: {
          race_id: raceId,
          horse_id: horseId,
          bet_type: betType,
          amount: betAmount,
          odds: odds,
          potential_payout: potentialPayout.toFixed(2),
          potential_profit: (potentialPayout - betAmount).toFixed(2)
        }
      });
    }
    
    if (action === 'best_value_bets') {
      // Analyze odds to find value bets
      // This would be a more complex calculation in a real application
      
      const race = oddsData.races[raceId];
      const trends = oddsData.trends[raceId];
      
      // Simple algorithm to identify value bets based on money distribution vs odds
      const valueBets = [];
      
      for (const [horseId, data] of Object.entries(race.win)) {
        const moneyPercentage = trends.money_distribution[horseId];
        const impliedProbability = 1 / data.odds * 100;
        
        // If money percentage is higher than implied probability, it might be overbet
        // If money percentage is lower than implied probability, it might be value
        const value = impliedProbability - moneyPercentage;
        
        valueBets.push({
          horse_id: horseId,
          horse: data.horse,
          odds: data.odds,
          implied_probability: impliedProbability.toFixed(1) + '%',
          money_percentage: moneyPercentage + '%',
          value: value.toFixed(1) + '%',
          recommendation: value > 5 ? 'Strong Value' : value > 0 ? 'Value' : 'No Value'
        });
      }
      
      // Sort by value (highest first)
      valueBets.sort((a, b) => parseFloat(b.value) - parseFloat(a.value));
      
      return Response.json({
        success: true,
        data: {
          race_id: raceId,
          race_name: raceId === '1' ? 'Melbourne Cup' : raceId === '2' ? 'Cox Plate' : 'Caulfield Cup',
          market_confidence: trends.market_confidence,
          value_bets: valueBets,
          analysis: 'Based on current market trends and betting patterns, the highlighted horses may represent value in the market.'
        }
      });
    }
    
    return Response.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Odds API error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}