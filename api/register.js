// Serverless function for handling registration form submissions
// This can be deployed to Vercel, Netlify, or any serverless platform

import { saveRegistration, initializeSheet } from './googleSheets.js';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow POST requests
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const {
            teamName,
            university,
            leaderName,
            memberName,
            faculty,
            studyLevel,
            fieldStudy,
            leaderEmail,
            leaderPhone,
            cyberKnowledge,
            hackathonExperience,
            hackathonSpecify
        } = req.body;
        
        // Validate required fields
        const requiredFields = [
            'teamName', 'university', 'leaderName', 'memberName',
            'faculty', 'studyLevel', 'fieldStudy', 'leaderEmail',
            'leaderPhone', 'cyberKnowledge', 'hackathonExperience'
        ];
        
        for (const field of requiredFields) {
            if (!req.body[field]) {
                return res.status(400).json({ 
                    error: `Missing required field: ${field}` 
                });
            }
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(leaderEmail)) {
            return res.status(400).json({ 
                error: 'Invalid email format' 
            });
        }
        
        // Phone validation
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(leaderPhone)) {
            return res.status(400).json({ 
                error: 'Invalid phone number format' 
            });
        }
        
        // Prepare registration data
        const registrationData = {
            teamName,
            university,
            leaderName,
            memberName,
            faculty,
            studyLevel,
            fieldStudy,
            leaderEmail,
            leaderPhone,
            cyberKnowledge,
            hackathonExperience,
            hackathonSpecify: hackathonExperience === 'yes' ? hackathonSpecify : null,
            submittedAt: new Date().toISOString(),
            event: 'Cyber Oasis 1.0: Hack the Dunes',
            eventDate: 'October 24-26, 2025'
        };
        
        // Save to Google Sheets
        try {
            await saveRegistration(registrationData);
            console.log('Registration saved to Google Sheets:', registrationData);
        } catch (error) {
            console.error('Failed to save registration to Google Sheets:', error);
            // Continue with response even if Google Sheets fails
        }
        
        // Send email notification
        await sendRegistrationNotification(registrationData);
        
        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Registration submitted successfully!',
            registrationId: generateRegistrationId(),
            data: {
                teamName,
                leaderEmail,
                submittedAt: registrationData.submittedAt
            }
        });
        
    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to process registration. Please try again later.'
        });
    }
}

// Generate a unique registration ID
function generateRegistrationId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `CO-${timestamp}-${random}`.toUpperCase();
}

// Send registration notification (placeholder)
async function sendRegistrationNotification(data) {
    // This is where you would integrate with your email service
    // Examples: SendGrid, Mailgun, AWS SES, etc.
    
    const emailData = {
        to: data.leaderEmail,
        subject: 'Cyber Oasis 1.0 - Registration Confirmation',
        template: 'registration-confirmation',
        data: {
            teamName: data.teamName,
            leaderName: data.leaderName,
            eventDate: data.eventDate,
            registrationId: generateRegistrationId()
        }
    };
    
    // Also notify organizers
    const organizerEmail = {
        to: 'organizers@cyberoasis.tn', // Replace with actual email
        subject: 'New Registration - Cyber Oasis 1.0',
        template: 'new-registration',
        data: data
    };
    
    console.log('Email notifications prepared:', { emailData, organizerEmail });
    
    // In a real implementation, you would send these emails here
    // await emailService.send(emailData);
    // await emailService.send(organizerEmail);
}

// Alternative implementation for different platforms
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}
