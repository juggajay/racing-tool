# Manual Vercel Deployment Guide

We've identified that your changes are not being automatically deployed to Vercel. This guide will help you manually deploy your changes to Vercel.

## Option 1: Deploy from the Vercel Dashboard

1. Go to the Vercel dashboard: https://vercel.com/juggajays-projects/horses
2. Click on the "Deployments" tab
3. Click on the "Deploy" button
4. Select "Deploy" from the dropdown menu

This will trigger a new deployment from your GitHub repository.

## Option 2: Use the Vercel CLI

If you have Node.js installed, you can use the Vercel CLI to deploy your changes:

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Login to Vercel:
   ```
   vercel login
   ```

3. Deploy your project:
   ```
   vercel --prod
   ```

## Option 3: Reconnect Your GitHub Repository

If the automatic deployments are not working, you may need to reconnect your GitHub repository to Vercel:

1. Go to the Vercel dashboard: https://vercel.com/juggajays-projects/horses
2. Click on the "Settings" tab
3. Under "Git", click on "Connected Git Repository"
4. Click on "Disconnect"
5. Confirm the disconnection
6. Click on "Connect Git Repository"
7. Select "GitHub" as the Git provider
8. Find and select your repository (juggajay/racing-tool)
9. Configure the build settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: next build
   - Output Directory: .next
10. Click "Deploy"

## Option 4: Create a New Vercel Project

If none of the above options work, you can create a new Vercel project:

1. Go to the Vercel dashboard: https://vercel.com/dashboard
2. Click on "Add New" > "Project"
3. Import your GitHub repository
4. Configure the build settings:
   - Framework Preset: Next.js
   - Root Directory: ./
   - Build Command: next build
   - Output Directory: .next
5. Click "Deploy"

## Verifying Your Deployment

After deploying, you can verify that your changes have been deployed by checking:

1. The test API endpoint: https://horses-rose.vercel.app/api/test-api
2. The test HTML page: https://horses-rose.vercel.app/test-api.html

If these URLs return 404 errors, your changes have not been deployed yet.

## Troubleshooting

If you're still having issues deploying your changes, check:

1. The build logs for any errors
2. The GitHub repository to make sure your changes have been pushed
3. The Vercel project settings to make sure the correct branch is being deployed

Remember that Vercel deployments can take a few minutes to complete, especially for larger projects.