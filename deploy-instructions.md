# Deployment Instructions & Configuration

## IMPORTANT: API Key Configuration (New)

The Punting Form API key is no longer managed through the application's Settings page. It **must** be configured as an **Environment Variable** in your Vercel project settings for the application to fetch live data.

**How to Set Environment Variable in Vercel:**

1.  Go to your Vercel Project Dashboard: [https://vercel.com/juggajays-projects/horses](https://vercel.com/juggajays-projects/horses) (Replace 'horses' if your project name is different).
2.  Click on the "Settings" tab.
3.  In the left sidebar, click on "Environment Variables".
4.  Add a new variable:
    *   **Name:** `PUNTING_FORM_API_KEY`
    *   **Value:** Paste your actual Punting Form API key here.
    *   **Environment(s):** Select "Production", "Preview", and "Development".
5.  Click "Save".

Vercel will trigger a new deployment automatically after you save the environment variable. Wait for this deployment to complete before testing live data features.

---

## Deployment Options

If automatic deployments from GitHub pushes aren't working or you need to redeploy manually:

### Option 1: Manual Redeploy from Vercel Dashboard

1.  Go to the Deployments tab: [https://vercel.com/juggajays-projects/horses/deployments](https://vercel.com/juggajays-projects/horses/deployments)
2.  Find the latest successful commit you want to deploy.
3.  Click the three dots (`...`) on the right side of that deployment row.
4.  Select "Redeploy" from the menu.
5.  Confirm the redeployment.

### Option 2: Use Vercel CLI

If you have Node.js and npm installed:

```bash
# Install Vercel CLI (if not already installed)
npm install -g vercel

# Login to Vercel (if not already logged in)
vercel login

# Link project (if not already linked, run in project directory)
# vercel link

# Deploy to Production
vercel --prod
```

---

## Local Testing

### Option 1: Test Progress Bar UI (No API)

1.  Open `test-progress-bar.html` or `backtest-demo.html` in your browser.
2.  Click the simulation button to see the UI elements.

### Option 2: Run Full Application Locally

1.  **Set Environment Variable:** You need to make the API key available locally. Create a file named `.env.local` in the project root directory (this file is ignored by Git). Add the following line to it, replacing `YOUR_KEY_HERE` with your actual key:
    ```
    PUNTING_FORM_API_KEY=YOUR_KEY_HERE
    ```
2.  **Install Dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
4.  **Access:** Open http://localhost:3000 in your browser. Live data features should now work locally using the key from `.env.local`.

---

## Recent Changes Summary (For Context)

*   Moved API key management from browser storage to server-side Environment Variables (`PUNTING_FORM_API_KEY`).
*   Removed API key input from the Settings page UI.
*   Updated the backend proxy (`/api/punting-form`) to read the key from `process.env.PUNTING_FORM_API_KEY`.
*   Created a dedicated "Live Racing" page (`/live-racing`) with a date picker.
*   Moved the "Manual Backtesting" functionality into the Settings page (`/settings`).
*   Removed "Backtest" and "API Test" links from navigation.
*   Added more logging to API routes for debugging.
*   Fixed deployment issues related to progress bar implementation (switched from SSE to polling).
*   Cleaned up `.gitignore` and removed large temporary files from Git history.