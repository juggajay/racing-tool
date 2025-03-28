# Correct URL for Vercel Deployment

I've identified the issue with accessing your Vercel deployment. The correct URL for your deployment is:

```
https://horses-rose.vercel.app
```

NOT:

```
https://horses-4tqzpm7bf-juggajays-projects.vercel.app
```

## Why This Happens

In Vercel, there are two types of URLs for deployments:

1. **Production Domain**: This is your main domain (horses-rose.vercel.app) that always points to your latest production deployment.

2. **Deployment URL**: Each deployment gets a unique URL (like horses-4tqzpm7bf-juggajays-projects.vercel.app) that points to that specific deployment.

The "DEPLOYMENT_NOT_FOUND" error occurs when trying to access a deployment URL that no longer exists or has been replaced by a newer deployment.

## How to Fix Your Scripts

You should update all your scripts and documentation to use the production domain (horses-rose.vercel.app) instead of the deployment-specific URL. This ensures that your links always point to the latest version of your site.

Files to update:
- deploy-to-vercel.js
- deploy-to-vercel.sh
- deploy-to-vercel.bat
- README.md
- vercel-troubleshooting.md
- connect-to-vercel.js

## Testing the API

I've tested the API and found that:

1. The website is accessible at https://horses-rose.vercel.app
2. The API Test page is accessible at https://horses-rose.vercel.app/api-test
3. Direct API calls to external APIs (like Punting Form) are blocked by CORS, which is expected
4. Server API calls through your Next.js API routes should work correctly

## Next Steps

1. Update all your scripts and documentation to use the correct URL
2. Test your API endpoints using the correct URL
3. If you're still having issues with specific API endpoints, check the server-side implementation

Remember to always use the production domain (horses-rose.vercel.app) in your documentation and client applications, not the deployment-specific URLs.