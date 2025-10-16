// Server-side form handler that processes both form submissions and API calls
import { saveRegistration } from './googleSheets.js';

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    try {
        let formData = {};
        
        // Handle different content types
        if (req.headers['content-type']?.includes('application/json')) {
            // JSON API call
            formData = req.body;
        } else if (req.headers['content-type']?.includes('application/x-www-form-urlencoded')) {
            // Form submission
            formData = parseFormData(req.body);
        } else {
            // Try to parse as JSON first, then form data
            try {
                formData = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
            } catch {
                formData = parseFormData(req.body);
            }
        }
        
        console.log('Received form data:', formData);
        
        // Map form field names to API field names
        const apiFormData = {
            teamName: formData['team-name'] || formData.teamName || '',
            university: formData.university || '',
            leaderName: formData['leader-name'] || formData.leaderName || '',
            memberName: formData['member-name'] || formData.memberName || '',
            faculty: formData.faculty || '',
            studyLevel: formData['study-level'] || formData.studyLevel || '',
            fieldStudy: formData['field-study'] || formData.fieldStudy || '',
            leaderEmail: formData['leader-email'] || formData.leaderEmail || '',
            leaderPhone: formData['leader-phone'] || formData.leaderPhone || '',
            cyberKnowledge: formData['cyber-knowledge'] || formData.cyberKnowledge || '',
            hackathonExperience: formData['hackathon-experience'] || formData.hackathonExperience || '',
            hackathonSpecify: formData['hackathon-specify'] || formData.hackathonSpecify || ''
        };
        
        console.log('Mapped API form data:', apiFormData);
        
        // Validate required fields
        const requiredFields = [
            'teamName', 'university', 'leaderName', 'memberName',
            'faculty', 'studyLevel', 'fieldStudy', 'leaderEmail',
            'leaderPhone', 'cyberKnowledge', 'hackathonExperience'
        ];
        
        for (const field of requiredFields) {
            if (!apiFormData[field] || apiFormData[field].trim() === '') {
                console.error(`Missing required field: ${field}`);
                
                // Check if this is a form submission (redirect) or API call (JSON response)
                const isFormSubmission = req.headers['content-type']?.includes('application/x-www-form-urlencoded') || 
                                        req.headers['content-type']?.includes('multipart/form-data');
                
                if (isFormSubmission) {
                    // Redirect back to form with error message
                    return res.redirect(302, `/?error=missing_${field}`);
                } else {
                    // Return JSON error for API calls
                    return res.status(400).json({ 
                        error: `Missing required field: ${field}`,
                        receivedData: formData,
                        mappedData: apiFormData
                    });
                }
            }
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(apiFormData.leaderEmail)) {
            return res.status(400).json({ 
                error: 'Invalid email format' 
            });
        }
        
        // Phone validation
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(apiFormData.leaderPhone)) {
            return res.status(400).json({ 
                error: 'Invalid phone number format' 
            });
        }
        
        // Generate registration ID
        const registrationId = generateRegistrationId();
        
        // Prepare registration data
        const registrationData = {
            registrationId,
            teamName: apiFormData.teamName,
            university: apiFormData.university,
            leaderName: apiFormData.leaderName,
            memberName: apiFormData.memberName,
            faculty: apiFormData.faculty,
            studyLevel: apiFormData.studyLevel,
            fieldStudy: apiFormData.fieldStudy,
            leaderEmail: apiFormData.leaderEmail,
            leaderPhone: apiFormData.leaderPhone,
            cyberKnowledge: apiFormData.cyberKnowledge,
            hackathonExperience: apiFormData.hackathonExperience,
            hackathonSpecify: apiFormData.hackathonExperience === 'yes' ? apiFormData.hackathonSpecify : null,
            submittedAt: new Date().toISOString(),
            event: 'Cyber Oasis 1.0: Hack the Dunes',
            eventDate: 'October 24-26, 2025'
        };
        
        // Save to Google Sheets
        let sheetsResult = null;
        try {
            if (!process.env.GOOGLE_SHEET_ID) {
                console.warn('Google Sheets not configured - skipping database save');
            } else {
                sheetsResult = await saveRegistration(registrationData);
                console.log('Registration saved to Google Sheets:', registrationData);
            }
        } catch (error) {
            console.error('Failed to save registration to Google Sheets:', error);
        }
        
        // Check if this is a form submission (redirect) or API call (JSON response)
        const isFormSubmission = req.headers['content-type']?.includes('application/x-www-form-urlencoded') || 
                                req.headers['content-type']?.includes('multipart/form-data');
        
        if (isFormSubmission) {
            // Redirect to success page for form submissions
            return res.redirect(302, '/success.html');
        } else {
            // Return JSON response for API calls
            return res.status(200).json({
                success: true,
                message: 'Registration submitted successfully!',
                registrationId: registrationId,
                data: {
                    teamName: apiFormData.teamName,
                    leaderEmail: apiFormData.leaderEmail,
                    submittedAt: registrationData.submittedAt
                }
            });
        }
        
    } catch (error) {
        console.error('Form handler error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to process registration. Please try again later.'
        });
    }
}

// Helper function to parse form data
function parseFormData(body) {
    const formData = {};
    if (typeof body === 'string') {
        const params = new URLSearchParams(body);
        for (const [key, value] of params) {
            formData[key] = value;
        }
    } else if (typeof body === 'object' && body !== null) {
        Object.assign(formData, body);
    }
    return formData;
}

// Generate a unique registration ID
function generateRegistrationId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substr(2, 5);
    return `CO-${timestamp}-${random}`.toUpperCase();
}
