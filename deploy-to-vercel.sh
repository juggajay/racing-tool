#!/bin/bash
# Bash script to deploy to Vercel

echo -e "\033[0;32mStarting deployment to Vercel...\033[0m"
echo ""

# Check if npm is installed
if command -v npm &> /dev/null; then
    npm_version=$(npm --version)
    echo -e "\033[0;32mnpm version $npm_version is installed.\033[0m"
else
    echo -e "\033[0;31mnpm is not installed or not in PATH. Please install Node.js from https://nodejs.org/\033[0m"
    echo "Press any key to exit..."
    read -n 1
    exit 1
fi

# Check if Vercel CLI is installed
if command -v vercel &> /dev/null; then
    vercel_version=$(vercel --version)
    echo -e "\033[0;32mVercel CLI version $vercel_version is installed.\033[0m"
else
    echo -e "\033[0;33mVercel CLI is not installed. Installing now...\033[0m"
    npm install -g vercel
    if [ $? -ne 0 ]; then
        echo -e "\033[0;31mFailed to install Vercel CLI. Please install it manually with 'npm install -g vercel'\033[0m"
        echo "Press any key to exit..."
        read -n 1
        exit 1
    fi
    echo -e "\033[0;32mVercel CLI installed successfully.\033[0m"
fi

echo ""
echo -e "\033[0;32mDeploying to Vercel...\033[0m"
echo ""

# Deploy to Vercel
vercel --prod

if [ $? -ne 0 ]; then
    echo -e "\033[0;31mDeployment failed. Please check the error messages above.\033[0m"
else
    echo ""
    echo -e "\033[0;32mDeployment completed successfully!\033[0m"
    echo ""
    echo -e "\033[0;36mYour project should be available at: https://horses-rose.vercel.app\033[0m"
    echo ""
    echo -e "\033[0;36mYou can also manage your project at: https://vercel.com/dashboard\033[0m"
fi

echo ""
echo "Press any key to exit..."
read -n 1