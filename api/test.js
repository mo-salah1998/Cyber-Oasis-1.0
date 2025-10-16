// Test endpoint to debug deployment issues
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
        const testData = {
            timestamp: new Date().toISOString(),
            method: req.method,
            hasBody: !!req.body,
            bodyKeys: req.body ? Object.keys(req.body) : [],
            environment: {
                hasGoogleSheetId: !!process.env.GOOGLE_SHEET_ID,
                hasGoogleProjectId: !!process.env.GOOGLE_PROJECT_ID,
                hasGoogleClientEmail: !!process.env.GOOGLE_CLIENT_EMAIL,
                hasGooglePrivateKey: !!process.env.GOOGLE_PRIVATE_KEY,
                nodeEnv: process.env.NODE_ENV,
                vercelEnv: process.env.VERCEL_ENV
            },
            headers: {
                userAgent: req.headers['user-agent'],
                contentType: req.headers['content-type'],
                origin: req.headers['origin']
            }
        };
        
        return res.status(200).json({
            success: true,
            message: 'Test endpoint working',
            data: testData
        });
        
    } catch (error) {
        console.error('Test endpoint error:', error);
        return res.status(500).json({
            error: 'Test endpoint failed',
            message: error.message
        });
    }
}
