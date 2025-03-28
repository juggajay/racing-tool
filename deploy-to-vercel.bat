@echo off
REM Deploy to Vercel Script
REM This script helps deploy the project to Vercel manually

echo Starting manual deployment to Vercel...
echo.
echo Checking if Vercel CLI is installed...

REM Check if Vercel CLI is installed
vercel --version >nul 2>&1
if %errorlevel% neq 0 (
    echo Vercel CLI not found. Installing...
    npm install -g vercel
) else (
    echo Vercel CLI is already installed.
)

echo.
echo Deploying to Vercel...
echo.

REM Deploy to Vercel
vercel --prod

echo.
echo Deployment process completed.
echo.
echo If the deployment was successful, your project should be available at:
echo https://horses.vercel.app
echo.
echo You can also manage your project at:
echo https://vercel.com/juggajays-projects/horses
echo.
echo If you encountered any issues, please check the Vercel dashboard for more information.
echo https://vercel.com/dashboard

pause