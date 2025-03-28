// Script to check Vercel deployment status
// Run this with: node check-deployment.js

const https = require('https');

console.log('Checking Vercel deployment status...');
console.log('');

// Function to make an HTTP request
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          data
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

// Function to check if a URL is accessible
async function checkUrl(url, description) {
  try {
    console.log(`Checking ${description}...`);
    const response = await makeRequest(url);
    
    if (response.statusCode >= 200 && response.statusCode < 300) {
      console.log(`✅ ${description} is accessible (Status: ${response.statusCode})`);
      return true;
    } else {
      console.log(`❌ ${description} returned status code ${response.statusCode}`);
      return false;
    }
  } catch (error) {
    console.log(`❌ Error accessing ${description}: ${error.message}`);
    return false;
  }
}

// Main function to check deployment
async function checkDeployment() {
  // URLs to check
  const urls = [
    { url: 'https://horses-rose.vercel.app', description: 'Main site' },
    { url: 'https://horses-rose.vercel.app/backtest', description: 'Backtest page' },
    { url: 'https://horses-rose.vercel.app/api/backtest/progress', description: 'Progress API endpoint' }
  ];
  
  let allSuccessful = true;
  
  // Check each URL
  for (const { url, description } of urls) {
    const success = await checkUrl(url, description);
    if (!success) {
      allSuccessful = false;
    }
    console.log('');
  }
  
  // Print summary
  console.log('Deployment Status Summary:');
  if (allSuccessful) {
    console.log('✅ All checks passed! The deployment appears to be successful.');
  } else {
    console.log('❌ Some checks failed. The deployment may have issues.');
    console.log('');
    console.log('Possible solutions:');
    console.log('1. Check the Vercel dashboard for error logs: https://vercel.com/juggajays-projects/horses/deployments');
    console.log('2. Make sure all required files are committed and pushed to GitHub');
    console.log('3. Try a manual deployment from the Vercel dashboard');
  }
  
  console.log('');
  console.log('For more information, visit: https://vercel.com/juggajays-projects/horses/deployments');
}

// Run the check
checkDeployment().catch(error => {
  console.error('Error checking deployment:', error);
});