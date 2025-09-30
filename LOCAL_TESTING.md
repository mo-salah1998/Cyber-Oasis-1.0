# Local Testing Guide for Cyber Oasis

This guide will help you test the Google Sheets integration locally before deploying to Vercel.

## Prerequisites

1. **Node.js** installed (version 14 or higher)
2. **Google Cloud Project** set up (follow `GOOGLE_SHEETS_SETUP.md`)
3. **Google Spreadsheet** created and shared with service account

## Step 1: Install Dependencies

```bash
npm install
```

## Step 2: Set Up Environment Variables

1. Copy the example environment file:
```bash
cp env.example .env
```

2. Edit `.env` file with your actual Google Sheets credentials:
```bash
nano .env
```

Fill in the values from your Google Service Account JSON file:
```
GOOGLE_SHEET_ID=your_actual_spreadsheet_id
GOOGLE_PROJECT_ID=your_project_id
GOOGLE_PRIVATE_KEY_ID=your_private_key_id
GOOGLE_PRIVATE_KEY="your_private_key_with_quotes"
GOOGLE_CLIENT_EMAIL=your_service_account_email
GOOGLE_CLIENT_ID=your_client_id
ADMIN_TOKEN=cyber-oasis-2025
```

## Step 3: Start Local Development Server

```bash
npm run dev
```

This will start a local server at `http://localhost:3000`

## Step 4: Test the API Endpoints

### Option A: Automated Testing (Recommended)

Run the test script:
```bash
node test-api.js
```

This will:
- Test all API endpoints
- Send sample data to your Google Sheets
- Show you the results

### Option B: Manual Testing

#### Test Registration Form:
```bash
curl -X POST http://localhost:3000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "teamName": "Test Team",
    "university": "university-gabes",
    "leaderName": "Ahmed Ben Ali",
    "memberName": "Fatma Ben Salem",
    "faculty": "Faculty of Sciences",
    "studyLevel": "master",
    "fieldStudy": "Computer Science",
    "leaderEmail": "ahmed@example.com",
    "leaderPhone": "+21612345678",
    "cyberKnowledge": "intermediate",
    "hackathonExperience": "yes",
    "hackathonSpecify": "Participated in CTF"
  }'
```

#### Test Contact Form:
```bash
curl -X POST http://localhost:3000/api/contact \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "message": "This is a test message"
  }'
```

#### Test Admin API:
```bash
curl -X GET http://localhost:3000/api/admin \
  -H "Authorization: Bearer cyber-oasis-2025"
```

## Step 5: Test the Website

1. Open your browser and go to `http://localhost:3000`
2. Try filling out the registration form
3. Try filling out the contact form
4. Check your Google Spreadsheet for new data

## Step 6: Test Admin Dashboard

1. Go to `http://localhost:3000/admin.html`
2. You should see all submitted data
3. Test the refresh functionality

## Troubleshooting

### Common Issues:

#### 1. "Module not found" errors
```bash
npm install
```

#### 2. "Invalid credentials" error
- Check your `.env` file has correct values
- Verify the service account has access to the spreadsheet
- Make sure the private key includes `\n` for line breaks

#### 3. "Spreadsheet not found" error
- Verify the `GOOGLE_SHEET_ID` is correct
- Check that the spreadsheet exists and is shared with the service account

#### 4. CORS errors
- Make sure you're testing from `http://localhost:3000`
- Check that the server is running

#### 5. "Server not running" error
```bash
npm run dev
```

### Debug Mode

To see detailed logs, you can modify the API files to add more console.log statements:

```javascript
console.log('Environment variables:', {
  hasSheetId: !!process.env.GOOGLE_SHEET_ID,
  hasClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
  // Don't log sensitive data
});
```

### Check Google Sheets

1. Go to your Google Spreadsheet
2. Look for the "Form Submissions" sheet
3. Check if data is being added to columns A-P (registrations) and R-X (contacts)

## Expected Results

When everything works correctly, you should see:

1. ✅ API endpoints return success responses
2. ✅ Data appears in your Google Spreadsheet
3. ✅ Admin dashboard shows the data
4. ✅ Website forms work without errors

## Next Steps

Once local testing is successful:

1. Deploy to Vercel
2. Set the same environment variables in Vercel dashboard
3. Test the live website
4. Monitor the Google Spreadsheet for real submissions

## Support

If you encounter issues:

1. Check the console logs in your terminal
2. Verify all environment variables are set correctly
3. Test with the automated test script first
4. Check your Google Cloud project permissions

Happy testing! 🚀
