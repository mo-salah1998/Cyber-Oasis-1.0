# Google Sheets API Setup Guide

This guide will help you set up Google Sheets API integration for your Cyber Oasis website form submissions.

## Step 1: Create a Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name your project (e.g., "Cyber Oasis Forms")

## Step 2: Enable Google Sheets API

1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google Sheets API"
3. Click on it and press "Enable"

## Step 3: Create Service Account

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service Account"
3. Fill in the details:
   - Name: `cyber-oasis-sheets`
   - Description: `Service account for Cyber Oasis form submissions`
4. Click "Create and Continue"
5. Skip the optional steps and click "Done"

## Step 4: Generate Service Account Key

1. In the Credentials page, find your service account
2. Click on the service account email
3. Go to the "Keys" tab
4. Click "Add Key" > "Create new key"
5. Choose "JSON" format
6. Download the JSON file (keep it secure!)

## Step 5: Create Google Spreadsheet

1. Go to [Google Sheets](https://sheets.google.com/)
2. Create a new spreadsheet
3. Name it "Cyber Oasis Form Submissions"
4. Copy the Spreadsheet ID from the URL:
   - URL format: `https://docs.google.com/spreadsheets/d/SPREADSHEET_ID/edit`
   - Copy the `SPREADSHEET_ID` part

## Step 6: Share Spreadsheet with Service Account

1. In your Google Spreadsheet, click "Share"
2. Add the service account email (from the JSON file: `client_email`)
3. Give it "Editor" permissions
4. Click "Send"

## Step 7: Set Environment Variables in Vercel

1. Go to your Vercel dashboard
2. Select your project
3. Go to "Settings" > "Environment Variables"
4. Add the following variables:

```
GOOGLE_SHEET_ID=your_spreadsheet_id_here
GOOGLE_PROJECT_ID=your_project_id_from_json
GOOGLE_PRIVATE_KEY_ID=your_private_key_id_from_json
GOOGLE_PRIVATE_KEY="your_private_key_from_json"
GOOGLE_CLIENT_EMAIL=your_client_email_from_json
GOOGLE_CLIENT_ID=your_client_id_from_json
```

**Important:** 
- Replace the values with actual values from your downloaded JSON file
- Keep the quotes around the private key value
- The private key should include `\n` characters for line breaks

## Step 8: Deploy to Vercel

1. Push your changes to GitHub
2. Vercel will automatically deploy
3. Test your forms to ensure data is being saved

## Testing

1. Fill out the registration form on your website
2. Check your Google Spreadsheet
3. You should see the data appear in the "Form Submissions" sheet

## Troubleshooting

### Common Issues:

1. **"The caller does not have permission"**
   - Make sure you shared the spreadsheet with the service account email
   - Check that the service account has "Editor" permissions

2. **"Invalid credentials"**
   - Verify all environment variables are set correctly
   - Check that the JSON key is properly formatted

3. **"Spreadsheet not found"**
   - Verify the GOOGLE_SHEET_ID is correct
   - Make sure the spreadsheet exists and is accessible

### Support

If you encounter issues, check the Vercel function logs in your dashboard for detailed error messages.

## Security Notes

- Never commit the JSON key file to your repository
- Use environment variables for all sensitive data
- Regularly rotate your service account keys
- Monitor API usage in Google Cloud Console
