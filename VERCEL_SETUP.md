# Vercel Deployment Setup Guide

## Environment Variables Configuration

To make the registration form work on the deployed version, you need to configure the following environment variables in your Vercel dashboard:

### 1. Access Vercel Dashboard
1. Go to [vercel.com](https://vercel.com)
2. Navigate to your project: `cyber-oasis-website`
3. Go to **Settings** → **Environment Variables**

### 2. Add Required Environment Variables

Add the following environment variables:

#### Google Sheets Configuration
```
GOOGLE_SHEET_ID=your_spreadsheet_id_here
GOOGLE_PROJECT_ID=your_project_id_from_json
GOOGLE_PRIVATE_KEY_ID=your_private_key_id_from_json
GOOGLE_PRIVATE_KEY="your_private_key_from_json"
GOOGLE_CLIENT_EMAIL=your_client_email_from_json
GOOGLE_CLIENT_ID=your_client_id_from_json
```

#### Admin Configuration
```
ADMIN_TOKEN=cyber-oasis-2025
```

### 3. How to Get Google Sheets Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google Sheets API
4. Create a Service Account:
   - Go to **IAM & Admin** → **Service Accounts**
   - Click **Create Service Account**
   - Fill in the details and create
5. Generate a JSON key:
   - Click on the created service account
   - Go to **Keys** tab
   - Click **Add Key** → **Create new key** → **JSON**
   - Download the JSON file
6. Extract values from the JSON file:
   - `project_id` → `GOOGLE_PROJECT_ID`
   - `private_key_id` → `GOOGLE_PRIVATE_KEY_ID`
   - `private_key` → `GOOGLE_PRIVATE_KEY`
   - `client_email` → `GOOGLE_CLIENT_EMAIL`
   - `client_id` → `GOOGLE_CLIENT_ID`
7. Create a Google Spreadsheet and copy the ID from the URL
8. Share the spreadsheet with the service account email (from `client_email`)

### 4. Deploy After Configuration

After adding all environment variables:
1. Go to **Deployments** tab
2. Click **Redeploy** on the latest deployment
3. Or push a new commit to trigger automatic deployment

### 5. Test the Setup

1. Visit your deployed site: `https://cyber-oasis-website.vercel.app`
2. Try to submit the registration form
3. Check the browser console for any error messages
4. Test the API endpoint: `https://cyber-oasis-website.vercel.app/api/test`

### 6. Troubleshooting

If the form still doesn't work:

1. **Check Environment Variables**: Use the test endpoint to verify all variables are set
2. **Check Google Sheets Permissions**: Ensure the service account has edit access
3. **Check Browser Console**: Look for JavaScript errors
4. **Check Vercel Logs**: Go to **Functions** tab to see server logs

### 7. Alternative: Form Without Google Sheets

If you don't want to use Google Sheets, the form will still work but won't save data to a spreadsheet. The API will return success but skip the database save step.

## Quick Test Commands

Test the API endpoint:
```bash
curl -X POST https://cyber-oasis-website.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{"teamName":"Test","university":"Test","leaderName":"Test","memberName":"Test","faculty":"Test","studyLevel":"Test","fieldStudy":"Test","leaderEmail":"test@example.com","leaderPhone":"1234567890","cyberKnowledge":"Beginner","hackathonExperience":"no"}'
```

Test the debug endpoint:
```bash
curl https://cyber-oasis-website.vercel.app/api/test
```
