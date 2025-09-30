// Admin endpoint to view form submissions
// This should be protected with authentication in production

import { getAllRegistrations, getAllContacts } from './googleSheets.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    // Basic authentication (replace with proper auth in production)
    const authHeader = req.headers.authorization;
    const expectedAuth = `Bearer ${process.env.ADMIN_TOKEN || 'cyber-oasis-2025'}`;
    
    if (authHeader !== expectedAuth) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    
    try {
        const [registrations, contacts] = await Promise.all([
            getAllRegistrations(),
            getAllContacts()
        ]);
        
        // Process registration data
        const processedRegistrations = registrations.slice(1).map((row, index) => {
            const headers = registrations[0];
            const registration = {};
            headers.forEach((header, i) => {
                registration[header] = row[i] || '';
            });
            return registration;
        });
        
        // Process contact data
        const processedContacts = contacts.slice(1).map((row, index) => {
            const headers = contacts[0];
            const contact = {};
            headers.forEach((header, i) => {
                contact[header] = row[i] || '';
            });
            return contact;
        });
        
        return res.status(200).json({
            success: true,
            data: {
                registrations: {
                    count: processedRegistrations.length,
                    submissions: processedRegistrations
                },
                contacts: {
                    count: processedContacts.length,
                    submissions: processedContacts
                },
                summary: {
                    totalRegistrations: processedRegistrations.length,
                    totalContacts: processedContacts.length,
                    lastUpdated: new Date().toISOString()
                }
            }
        });
        
    } catch (error) {
        console.error('Admin API error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to fetch submissions'
        });
    }
}
