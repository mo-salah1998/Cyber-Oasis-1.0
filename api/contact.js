// Serverless function for handling contact form submissions
// This can be deployed to Vercel, Netlify, or any serverless platform

import { saveContact, initializeSheet } from './googleSheets.js';

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
        const { name, email, message } = req.body;
        
        // Validate required fields
        if (!name || !email || !message) {
            return res.status(400).json({ 
                error: 'All fields are required' 
            });
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ 
                error: 'Invalid email format' 
            });
        }
        
        // Prepare contact data
        const contactData = {
            name,
            email,
            message,
            submittedAt: new Date().toISOString(),
            source: 'Cyber Oasis 1.0 Website',
            event: 'Cyber Oasis 1.0: Hack the Dunes'
        };
        
        // Save to Google Sheets
        try {
            await saveContact(contactData);
            console.log('Contact message saved to Google Sheets:', contactData);
        } catch (error) {
            console.error('Failed to save contact to Google Sheets:', error);
            // Continue with response even if Google Sheets fails
        }
        
        // Send notifications
        await sendContactNotification(contactData);
        await sendAutoReply(contactData);
        
        // Return success response
        return res.status(200).json({
            success: true,
            message: 'Message sent successfully! We will get back to you soon.',
            contactId: generateContactId(),
            data: {
                name,
                email,
                submittedAt: contactData.submittedAt
            }
        });
        
    } catch (error) {
        console.error('Contact form error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to send message. Please try again later.'
        });
    }
}

// Generate a unique contact ID
function generateContactId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `CONTACT-${timestamp}-${random}`.toUpperCase();
}

// Send contact notification to organizers
async function sendContactNotification(data) {
    const organizerEmail = {
        to: 'contact@cyberoasis.tn', // Replace with actual email
        subject: `New Contact Message - ${data.name}`,
        template: 'contact-notification',
        data: {
            name: data.name,
            email: data.email,
            message: data.message,
            submittedAt: data.submittedAt,
            contactId: generateContactId()
        }
    };
    
    console.log('Contact notification prepared:', organizerEmail);
    
    // In a real implementation, you would send this email here
    // await emailService.send(organizerEmail);
}

// Send auto-reply to sender
async function sendAutoReply(data) {
    const autoReplyEmail = {
        to: data.email,
        subject: 'Thank you for contacting Cyber Oasis 1.0',
        template: 'contact-auto-reply',
        data: {
            name: data.name,
            event: 'Cyber Oasis 1.0: Hack the Dunes',
            eventDate: 'October 24-26, 2025',
            contactId: generateContactId()
        }
    };
    
    console.log('Auto-reply prepared:', autoReplyEmail);
    
    // In a real implementation, you would send this email here
    // await emailService.send(autoReplyEmail);
}

// Alternative implementation for different platforms
export const config = {
    api: {
        bodyParser: {
            sizeLimit: '1mb',
        },
    },
}
