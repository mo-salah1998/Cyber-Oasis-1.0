// Environment variables check for debugging
export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    // Only allow GET requests
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }
    
    try {
        const envCheck = {
            // Google Sheets configuration
            googleSheetsConfigured: !!(process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_CLIENT_EMAIL),
            googleSheetId: process.env.GOOGLE_SHEET_ID ? 'Set' : 'Missing',
            googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL ? 'Set' : 'Missing',
            googleProjectId: process.env.GOOGLE_PROJECT_ID ? 'Set' : 'Missing',
            googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY ? 'Set' : 'Missing',
            
            // Admin configuration
            adminToken: process.env.ADMIN_TOKEN ? 'Set' : 'Missing',
            
            // Environment info
            nodeEnv: process.env.NODE_ENV || 'Not set',
            vercelEnv: process.env.VERCEL_ENV || 'Not set',
            vercelUrl: process.env.VERCEL_URL || 'Not set',
            
            // Timestamp
            timestamp: new Date().toISOString()
        };
        
        return res.status(200).json({
            success: true,
            message: 'Environment check completed',
            data: envCheck
        });
        
    } catch (error) {
        console.error('Environment check error:', error);
        return res.status(500).json({
            error: 'Internal server error',
            message: 'Failed to check environment variables'
        });
    }
}
