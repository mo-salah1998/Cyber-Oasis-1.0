// Google Sheets API utility for Cyber Oasis form submissions
import { google } from 'googleapis';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Google Sheets configuration
const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const SHEET_NAME = 'Sheet1';

// Debug logging (remove in production)
console.log('Google Sheets Debug Info:');
console.log('SPREADSHEET_ID:', SPREADSHEET_ID);
console.log('SHEET_NAME:', SHEET_NAME);

// Initialize Google Sheets API
const auth = new google.auth.GoogleAuth({
  credentials: {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `https://www.googleapis.com/robot/v1/metadata/x509/${process.env.GOOGLE_CLIENT_EMAIL}`
  },
  scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

// Initialize spreadsheet with headers if it doesn't exist
export async function initializeSheet() {
  try {
    // Check if sheet exists
    const response = await sheets.spreadsheets.get({
      spreadsheetId: SPREADSHEET_ID
    });
    
    const sheetExists = response.data.sheets?.some(sheet => sheet.properties.title === SHEET_NAME);
    
    if (!sheetExists) {
      // Create the sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [{
            addSheet: {
              properties: {
                title: SHEET_NAME
              }
            }
          }]
        }
      });
    }
    
    // Add headers for registration form
    await addRegistrationHeaders();
    await addContactHeaders();
    
    console.log('Google Sheets initialized successfully');
  } catch (error) {
    console.error('Error initializing Google Sheets:', error);
    throw error;
  }
}

// Add headers for registration form
async function addRegistrationHeaders() {
  const registrationHeaders = [
    'Timestamp',
    'Registration ID',
    'Team Name',
    'University',
    'Leader Name',
    'Member Name',
    'Faculty',
    'Study Level',
    'Field of Study',
    'Leader Email',
    'Leader Phone',
    'Cyber Knowledge',
    'Hackathon Experience',
    'Hackathon Details',
    'Event',
    'Event Date'
  ];
  
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A1:P1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [registrationHeaders]
      }
    });
  } catch (error) {
    console.error('Error adding registration headers:', error);
  }
}

// Add headers for contact form
async function addContactHeaders() {
  const contactHeaders = [
    'Timestamp',
    'Contact ID',
    'Name',
    'Email',
    'Message',
    'Source',
    'Event'
  ];
  
  try {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!R1:X1`,
      valueInputOption: 'RAW',
      requestBody: {
        values: [contactHeaders]
      }
    });
  } catch (error) {
    console.error('Error adding contact headers:', error);
  }
}

// Save registration data to Google Sheets
export async function saveRegistration(data) {
  try {
    // Generate registration ID if not provided
    const registrationId = data.registrationId || generateRegistrationId();
    
    // First, ensure the sheet is initialized
    await initializeSheet();
    
    const values = [
      [
        data.submittedAt,
        registrationId,
        data.teamName,
        data.university,
        data.leaderName,
        data.memberName,
        data.faculty,
        data.studyLevel,
        data.fieldStudy,
        data.leaderEmail,
        data.leaderPhone,
        data.cyberKnowledge,
        data.hackathonExperience,
        data.hackathonSpecify || '',
        data.event,
        data.eventDate
      ]
    ];
    
    // Use append method with a proper range format
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:Z`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: values
      }
    });
    
    console.log('Registration data saved to Google Sheets');
    return { success: true, registrationId };
  } catch (error) {
    console.error('Error saving registration to Google Sheets:', error);
    throw error;
  }
}

// Generate a unique registration ID
function generateRegistrationId() {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `CO-${timestamp}-${random}`.toUpperCase();
}

// Save contact data to Google Sheets
export async function saveContact(data) {
  try {
    const values = [
      [
        data.submittedAt,
        data.contactId,
        data.name,
        data.email,
        data.message,
        data.source,
        data.event
      ]
    ];
    
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!R:X`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: values
      }
    });
    
    console.log('Contact data saved to Google Sheets');
    return { success: true };
  } catch (error) {
    console.error('Error saving contact to Google Sheets:', error);
    throw error;
  }
}

// Get all registrations (for admin purposes)
export async function getAllRegistrations() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:P`
    });
    
    return response.data.values || [];
  } catch (error) {
    console.error('Error fetching registrations:', error);
    throw error;
  }
}

// Get all contacts (for admin purposes)
export async function getAllContacts() {
  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!R:X`
    });
    
    return response.data.values || [];
  } catch (error) {
    console.error('Error fetching contacts:', error);
    throw error;
  }
}
