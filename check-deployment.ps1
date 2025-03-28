# PowerShell script to check Vercel deployment status

Write-Host "Checking Vercel deployment status..." -ForegroundColor Cyan
Write-Host ""

# Function to check if a URL is accessible
function Test-Url {
    param (
        [string]$Url,
        [string]$Description
    )
    
    Write-Host "Checking $Description..." -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -ErrorAction Stop
        
        if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 300) {
            Write-Host "✅ $Description is accessible (Status: $($response.StatusCode))" -ForegroundColor Green
            return $true
        } else {
            Write-Host "❌ $Description returned status code $($response.StatusCode)" -ForegroundColor Red
            return $false
        }
    } catch {
        Write-Host "❌ Error accessing $Description: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
}

# URLs to check
$urls = @(
    @{ Url = "https://horses-rose.vercel.app"; Description = "Main site" },
    @{ Url = "https://horses-rose.vercel.app/backtest"; Description = "Backtest page" },
    @{ Url = "https://horses-rose.vercel.app/api/backtest/progress"; Description = "Progress API endpoint" }
)

$allSuccessful = $true

# Check each URL
foreach ($urlInfo in $urls) {
    $success = Test-Url -Url $urlInfo.Url -Description $urlInfo.Description
    if (-not $success) {
        $allSuccessful = $false
    }
    Write-Host ""
}

# Print summary
Write-Host "Deployment Status Summary:" -ForegroundColor Cyan
if ($allSuccessful) {
    Write-Host "✅ All checks passed! The deployment appears to be successful." -ForegroundColor Green
} else {
    Write-Host "❌ Some checks failed. The deployment may have issues." -ForegroundColor Red
    Write-Host ""
    Write-Host "Possible solutions:" -ForegroundColor Yellow
    Write-Host "1. Check the Vercel dashboard for error logs: https://vercel.com/juggajays-projects/horses/deployments"
    Write-Host "2. Make sure all required files are committed and pushed to GitHub"
    Write-Host "3. Try a manual deployment from the Vercel dashboard"
}

Write-Host ""
Write-Host "For more information, visit: https://vercel.com/juggajays-projects/horses/deployments" -ForegroundColor Cyan

# Pause to keep the window open
Write-Host ""
Write-Host "Press any key to exit..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")