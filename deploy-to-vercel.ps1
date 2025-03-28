# PowerShell script to deploy to Vercel

Write-Host "Starting deployment to Vercel..." -ForegroundColor Green
Write-Host ""

# Check if npm is installed
try {
    $npmVersion = npm --version
    Write-Host "npm version $npmVersion is installed." -ForegroundColor Green
} catch {
    Write-Host "npm is not installed or not in PATH. Please install Node.js from https://nodejs.org/" -ForegroundColor Red
    Write-Host "Press any key to exit..."
    $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
    exit
}

# Check if Vercel CLI is installed
try {
    $vercelVersion = vercel --version
    Write-Host "Vercel CLI version $vercelVersion is installed." -ForegroundColor Green
} catch {
    Write-Host "Vercel CLI is not installed. Installing now..." -ForegroundColor Yellow
    npm install -g vercel
    if ($LASTEXITCODE -ne 0) {
        Write-Host "Failed to install Vercel CLI. Please install it manually with 'npm install -g vercel'" -ForegroundColor Red
        Write-Host "Press any key to exit..."
        $null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
        exit
    }
    Write-Host "Vercel CLI installed successfully." -ForegroundColor Green
}

Write-Host ""
Write-Host "Deploying to Vercel..." -ForegroundColor Green
Write-Host ""

# Deploy to Vercel
vercel --prod

if ($LASTEXITCODE -ne 0) {
    Write-Host "Deployment failed. Please check the error messages above." -ForegroundColor Red
} else {
    Write-Host ""
    Write-Host "Deployment completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Your project should be available at: https://horses-rose.vercel.app" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "You can also manage your project at: https://vercel.com/dashboard" -ForegroundColor Cyan
}

Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")