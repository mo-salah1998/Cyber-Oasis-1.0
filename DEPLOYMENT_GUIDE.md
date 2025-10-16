# Cyber Oasis Website - Deployment Guide

## Issue: Registration Form Not Working on Deployed Version

### Problem Description
The registration form works perfectly in local development but fails to submit on the deployed version at https://cyber-oasis-website.vercel.app/

### Root Cause Analysis
The issue is likely caused by missing environment variables for Google Sheets integration on Vercel.

### Solution Steps

#### 1. Configure Environment Variables on Vercel

You need to add the following environment variables to your Vercel project:

1. Go to your Vercel dashboard
2. Select your project: `cyber-oasis-website`
3. Go to Settings → Environment Variables
4. Add the following variables:

```
GOOGLE_SHEET_ID=your_spreadsheet_id_here
GOOGLE_PROJECT_ID=your_project_id_from_json
GOOGLE_PRIVATE_KEY_ID=your_private_key_id_from_json
GOOGLE_PRIVATE_KEY="your_private_key_from_json"
GOOGLE_CLIENT_EMAIL=your_client_email_from_json
GOOGLE_CLIENT_ID=your_client_id_from_json
ADMIN_TOKEN=cyber-oasis-2025
```

#### 2. Test the Fix

After adding the environment variables:

1. **Test Environment Variables**: Visit `https://cyber-oasis-website.vercel.app/api/env-check` to verify all environment variables are properly set.

2. **Test Registration Form**: Use the test page at `https://cyber-oasis-website.vercel.app/test-registration.html` to test the registration form submission.

3. **Test Main Form**: Try submitting the registration form on the main website.

#### 3. Debugging Tools

I've created several debugging tools to help identify the issue:

- **Environment Check API**: `/api/env-check` - Shows which environment variables are configured
- **Test Registration Page**: `/test-registration.html` - Isolated test page for the registration form
- **Enhanced Error Handling**: Better error messages in the frontend JavaScript

#### 4. Google Sheets Setup

If you haven't set up Google Sheets yet:

1. Create a new Google Spreadsheet
2. Create a Google Cloud Project
3. Enable the Google Sheets API
4. Create a Service Account
5. Download the JSON credentials
6. Share the spreadsheet with the service account email
7. Extract the required values from the JSON file

### Files Modified

1. **`api/register.js`**: Added environment variable checks and better error handling
2. **`script.js`**: Enhanced error handling and user feedback
3. **`test-registration.html`**: New test page for debugging
4. **`api/env-check.js`**: New API endpoint to check environment variables
5. **`vercel.json`**: Added the new environment check endpoint

### Testing Commands

```bash
# Test the API endpoint directly
curl -X POST https://cyber-oasis-website.vercel.app/api/register \
  -H "Content-Type: application/json" \
  -d '{"teamName":"Test Team","university":"university-gabes","leaderName":"Test Leader","memberName":"Test Member","faculty":"Computer Science","studyLevel":"bachelor","fieldStudy":"Cybersecurity","leaderEmail":"test@example.com","leaderPhone":"+21612345678","cyberKnowledge":"beginner","hackathonExperience":"no"}'

# Check environment variables
curl https://cyber-oasis-website.vercel.app/api/env-check
```

### Expected Behavior After Fix

1. The registration form should submit successfully
2. Users should see a success notification
3. The form should reset after successful submission
4. Registration data should be saved to Google Sheets (if configured)
5. A confirmation email should be sent (if email service is configured)

### Fallback Behavior

If Google Sheets is not configured, the registration will still work but won't save to the database. The user will still see a success message, and the registration ID will be generated.

### Next Steps

1. Add the environment variables to Vercel
2. Test the registration form
3. If issues persist, check the browser console for error messages
4. Use the test page to isolate any remaining issues

### Support

If you continue to experience issues after following these steps, please check:
- Browser console for JavaScript errors
- Network tab for failed requests
- Vercel function logs for server-side errors
