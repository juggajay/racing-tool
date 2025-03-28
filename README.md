# Horse Racing Website

A Next.js website for horse racing enthusiasts with prediction tools and comprehensive APIs.

## Features

- Race data visualization and analysis
- Predictive modeling for race outcomes
- Odds comparison and betting strategy analysis
- Weather and track condition integration
- Backtesting of prediction models
- Comprehensive API for racing data
- CSV data import and analysis

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
## API Documentation

The Racing Tool provides several APIs for accessing horse racing data:

- **Unified Racing API**: Combines data from multiple sources into a single endpoint
- **Punting Form API**: Direct access to the Punting Form service
- **Racing Data API**: Access to static mock racing data
- **Odds API**: Betting odds data
- **Weather API**: Weather and track condition data
- **CSV Data API**: Upload, view, and query CSV racing data
- **Weather API**: Weather and track condition data

For detailed API documentation, see the [API README](API_README.md) or visit the `/api-docs.html` page in your browser.

## API Test Pages

The following HTML pages are available for testing the APIs:

- `/api-test.html` - Test the Punting Form API
- `/api-direct-test.html` - Test direct API calls to the Punting Form API
- `/racing-test.html` - Test the Racing Data API
- `/unified-api-test.html` - Test the Unified Racing API
- `/csv-data-test.html` - Test the CSV Data API
- `/api-docs.html` - View the complete API documentation

## Deploying to Vercel

The easiest way to deploy this Next.js app is to use the [Vercel Platform](https://vercel.com/new).

1. Push this repository to GitHub.
2. Import the repository in Vercel.
3. Vercel will automatically detect that you're using Next.js and will set up the correct build settings.
4. Your app will be deployed!

If automatic deployments are not triggering, you can manually deploy from the Vercel dashboard:
1. Go to your project in the Vercel dashboard.
2. Click on the "Deployments" tab.
3. Click the "Deploy" button and select "Deploy" from the dropdown.

Current deployment: [https://racing-tool.vercel.app](https://racing-tool.vercel.app)

## Troubleshooting Vercel Deployment

If you encounter issues with Vercel deployment:

1. Make sure you're using a supported version of Next.js (this project uses Next.js 14.1.0).
2. Check that your package.json has the correct dependencies and scripts.
3. Ensure your next.config.js is properly configured.
4. If you're using TypeScript, make sure your tsconfig.json is correctly set up.
5. Check the Vercel deployment logs for specific error messages.