// Debug endpoint to see what data is being received
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
        const debugData = {
            method: req.method,
            headers: req.headers,
            body: req.body,
            bodyType: typeof req.body,
            bodyKeys: req.body ? Object.keys(req.body) : [],
            query: req.query,
            url: req.url,
            timestamp: new Date().toISOString()
        };
        
        console.log('Debug endpoint received:', debugData);
        
        return res.status(200).json({
            success: true,
            message: 'Debug data received',
            data: debugData
        });
        
    } catch (error) {
        console.error('Debug endpoint error:', error);
        return res.status(500).json({
            error: 'Debug endpoint failed',
            message: error.message
        });
    }
}
