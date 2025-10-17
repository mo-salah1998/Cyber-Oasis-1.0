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
        
        // Combine country code and phone number
        const countryCode = formData['country-code'] || formData.countryCode || '';
        const phoneNumber = formData['leader-phone'] || formData.leaderPhone || '';
        const fullPhoneNumber = countryCode && phoneNumber ? `${countryCode}${phoneNumber}` : phoneNumber;
        
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
            leaderPhone: fullPhoneNumber,
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
                    // Return HTML error page for form submissions
                    const errorHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#ea580c">
    <title>Registration Error - Cyber Oasis 1.0</title>
    <link rel="icon" type="image/png" href="/m (2).png">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="/main.css" rel="stylesheet">
    <style>
        .error-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
            padding: 2rem;
        }
        
        .error-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .error-icon {
            font-size: 4rem;
            color: #ef4444;
            margin-bottom: 1.5rem;
        }
        
        .error-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #fbbf24;
            margin-bottom: 1rem;
            text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
        }
        
        .error-message {
            font-size: 1.2rem;
            color: #e2e8f0;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .btn-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
        }
        
        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #ea580c, #f59e0b);
            color: white;
            border: none;
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, #dc2626, #ea580c);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(234, 88, 12, 0.3);
        }
        
        .btn-secondary {
            background: transparent;
            color: #fbbf24;
            border: 2px solid #fbbf24;
        }
        
        .btn-secondary:hover {
            background: #fbbf24;
            color: #0f172a;
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .error-container {
                padding: 1rem;
            }
            
            .error-card {
                padding: 2rem;
            }
            
            .error-title {
                font-size: 2rem;
            }
            
            .btn-group {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                width: 100%;
                max-width: 300px;
            }
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-card">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            
            <h1 class="error-title">Registration Error</h1>
            
            <p class="error-message">
                Please fill in the <strong>${field}</strong> field and try again.<br>
                All fields marked with * are required.
            </p>
            
            <div class="btn-group">
                <a href="/" class="btn btn-primary">
                    <i class="fas fa-arrow-left"></i>
                    Back to Registration
                </a>
                <a href="/#contact" class="btn btn-secondary">
                    <i class="fas fa-envelope"></i>
                    Contact Support
                </a>
            </div>
        </div>
    </div>
</body>
</html>`;
                    
                    return res.status(400).setHeader('Content-Type', 'text/html').send(errorHtml);
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
            if (isFormSubmission) {
                return res.status(400).setHeader('Content-Type', 'text/html').send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Error - Cyber Oasis 1.0</title>
    <link rel="icon" type="image/png" href="/m (2).png">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { font-family: Arial, sans-serif; background: #0f172a; color: white; margin: 0; padding: 2rem; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .error-card { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 10px; text-align: center; max-width: 500px; border: 1px solid #ef4444; }
        .error-icon { font-size: 3rem; color: #ef4444; margin-bottom: 1rem; }
        .error-title { font-size: 1.5rem; margin-bottom: 1rem; color: #fbbf24; }
        .error-message { margin-bottom: 2rem; }
        .btn { padding: 10px 20px; background: #ea580c; color: white; text-decoration: none; border-radius: 5px; display: inline-block; }
    </style>
</head>
<body>
    <div class="error-card">
        <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
        <h1 class="error-title">Registration Error</h1>
        <p class="error-message">Please enter a valid email address and try again.</p>
        <a href="/" class="btn">Back to Registration</a>
    </div>
</body>
</html>`);
            } else {
                return res.status(400).json({ error: 'Invalid email format' });
            }
        }
        
        // Phone validation
        const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(fullPhoneNumber)) {
            if (isFormSubmission) {
                return res.status(400).setHeader('Content-Type', 'text/html').send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Registration Error - Cyber Oasis 1.0</title>
    <link rel="icon" type="image/png" href="/m (2).png">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <style>
        body { font-family: Arial, sans-serif; background: #0f172a; color: white; margin: 0; padding: 2rem; display: flex; align-items: center; justify-content: center; min-height: 100vh; }
        .error-card { background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 10px; text-align: center; max-width: 500px; border: 1px solid #ef4444; }
        .error-icon { font-size: 3rem; color: #ef4444; margin-bottom: 1rem; }
        .error-title { font-size: 1.5rem; margin-bottom: 1rem; color: #fbbf24; }
        .error-message { margin-bottom: 2rem; }
        .btn { padding: 10px 20px; background: #ea580c; color: white; text-decoration: none; border-radius: 5px; display: inline-block; }
    </style>
</head>
<body>
    <div class="error-card">
        <div class="error-icon"><i class="fas fa-exclamation-triangle"></i></div>
        <h1 class="error-title">Registration Error</h1>
        <p class="error-message">Please enter a valid phone number and try again.</p>
        <a href="/" class="btn">Back to Registration</a>
    </div>
</body>
</html>`);
            } else {
                return res.status(400).json({ error: 'Invalid phone number format' });
            }
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
            // Return HTML success page for form submissions
            const successHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#ea580c">
    <title>Registration Successful - Cyber Oasis 1.0</title>
    <link rel="icon" type="image/png" href="/m (2).png">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="/main.css" rel="stylesheet">
    <style>
        .success-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
            padding: 2rem;
        }
        
        .success-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(34, 197, 94, 0.3);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .success-icon {
            font-size: 4rem;
            color: #10b981;
            margin-bottom: 1.5rem;
            animation: bounce 2s infinite;
        }
        
        @keyframes bounce {
            0%, 20%, 50%, 80%, 100% {
                transform: translateY(0);
            }
            40% {
                transform: translateY(-10px);
            }
            60% {
                transform: translateY(-5px);
            }
        }
        
        .success-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #fbbf24;
            margin-bottom: 1rem;
            text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
        }
        
        .success-message {
            font-size: 1.2rem;
            color: #e2e8f0;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .success-details {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 1.5rem;
            margin: 2rem 0;
            border-left: 4px solid #ea580c;
        }
        
        .success-details h3 {
            color: #fbbf24;
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        
        .success-details p {
            color: #cbd5e1;
            margin: 0.5rem 0;
        }
        
        .btn-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
        }
        
        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #ea580c, #f59e0b);
            color: white;
            border: none;
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, #dc2626, #ea580c);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(234, 88, 12, 0.3);
        }
        
        .btn-secondary {
            background: transparent;
            color: #fbbf24;
            border: 2px solid #fbbf24;
        }
        
        .btn-secondary:hover {
            background: #fbbf24;
            color: #0f172a;
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .success-container {
                padding: 1rem;
            }
            
            .success-card {
                padding: 2rem;
            }
            
            .success-title {
                font-size: 2rem;
            }
            
            .btn-group {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                width: 100%;
                max-width: 300px;
            }
        }
    </style>
</head>
<body>
    <div class="success-container">
        <div class="success-card">
            <div class="success-icon">
                <i class="fas fa-check-circle"></i>
            </div>
            
            <h1 class="success-title">Registration Successful!</h1>
            
            <p class="success-message">
                Thank you for registering for Cyber Oasis 1.0: Hack the Dunes!<br>
                We have received your registration and will contact you soon with further details.
            </p>
            
            <div class="success-details">
                <h3><i class="fas fa-info-circle"></i> What's Next?</h3>
                <p><i class="fas fa-envelope"></i> You will receive a confirmation email shortly</p>
                <p><i class="fas fa-calendar"></i> Event details will be sent closer to the date</p>
                <p><i class="fas fa-users"></i> Join our community for updates and networking</p>
            </div>
            
            <div class="btn-group">
                <a href="/" class="btn btn-primary">
                    <i class="fas fa-home"></i>
                    Back to Home
                </a>
                <a href="/#about" class="btn btn-secondary">
                    <i class="fas fa-info"></i>
                    Learn More
                </a>
            </div>
        </div>
    </div>
    
    <script>
        // Auto-redirect after 10 seconds
        setTimeout(() => {
            window.location.href = '/';
        }, 10000);
        
        // Show countdown
        let countdown = 10;
        const countdownElement = document.createElement('p');
        countdownElement.style.color = '#94a3b8';
        countdownElement.style.marginTop = '1rem';
        countdownElement.innerHTML = \`Redirecting to home page in <span id="countdown">\${countdown}</span> seconds...\`;
        document.querySelector('.success-card').appendChild(countdownElement);
        
        const countdownInterval = setInterval(() => {
            countdown--;
            document.getElementById('countdown').textContent = countdown;
            if (countdown <= 0) {
                clearInterval(countdownInterval);
            }
        }, 1000);
    </script>
</body>
</html>`;
            
            return res.status(200).setHeader('Content-Type', 'text/html').send(successHtml);
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
        
        // Check if this is a form submission (HTML response) or API call (JSON response)
        const isFormSubmission = req.headers['content-type']?.includes('application/x-www-form-urlencoded') || 
                                req.headers['content-type']?.includes('multipart/form-data');
        
        if (isFormSubmission) {
            // Return HTML error page for form submissions
            const errorHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="theme-color" content="#ea580c">
    <title>Registration Error - Cyber Oasis 1.0</title>
    <link rel="icon" type="image/png" href="/m (2).png">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&display=swap" rel="stylesheet">
    <link href="/main.css" rel="stylesheet">
    <style>
        .error-container {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
            padding: 2rem;
        }
        
        .error-card {
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(10px);
            border: 1px solid rgba(239, 68, 68, 0.3);
            border-radius: 20px;
            padding: 3rem;
            text-align: center;
            max-width: 600px;
            width: 100%;
            box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
        }
        
        .error-icon {
            font-size: 4rem;
            color: #ef4444;
            margin-bottom: 1.5rem;
        }
        
        .error-title {
            font-size: 2.5rem;
            font-weight: 700;
            color: #fbbf24;
            margin-bottom: 1rem;
            text-shadow: 0 0 20px rgba(251, 191, 36, 0.5);
        }
        
        .error-message {
            font-size: 1.2rem;
            color: #e2e8f0;
            margin-bottom: 2rem;
            line-height: 1.6;
        }
        
        .error-details {
            background: rgba(0, 0, 0, 0.3);
            border-radius: 10px;
            padding: 1.5rem;
            margin: 2rem 0;
            border-left: 4px solid #ea580c;
        }
        
        .error-details h3 {
            color: #fbbf24;
            margin-bottom: 1rem;
            font-size: 1.3rem;
        }
        
        .error-details p {
            color: #cbd5e1;
            margin: 0.5rem 0;
        }
        
        .btn-group {
            display: flex;
            gap: 1rem;
            justify-content: center;
            flex-wrap: wrap;
            margin-top: 2rem;
        }
        
        .btn {
            padding: 12px 24px;
            border-radius: 8px;
            font-weight: 600;
            text-decoration: none;
            transition: all 0.3s ease;
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
        }
        
        .btn-primary {
            background: linear-gradient(135deg, #ea580c, #f59e0b);
            color: white;
            border: none;
        }
        
        .btn-primary:hover {
            background: linear-gradient(135deg, #dc2626, #ea580c);
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(234, 88, 12, 0.3);
        }
        
        .btn-secondary {
            background: transparent;
            color: #fbbf24;
            border: 2px solid #fbbf24;
        }
        
        .btn-secondary:hover {
            background: #fbbf24;
            color: #0f172a;
            transform: translateY(-2px);
        }
        
        @media (max-width: 768px) {
            .error-container {
                padding: 1rem;
            }
            
            .error-card {
                padding: 2rem;
            }
            
            .error-title {
                font-size: 2rem;
            }
            
            .btn-group {
                flex-direction: column;
                align-items: center;
            }
            
            .btn {
                width: 100%;
                max-width: 300px;
            }
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-card">
            <div class="error-icon">
                <i class="fas fa-exclamation-triangle"></i>
            </div>
            
            <h1 class="error-title">Registration Error</h1>
            
            <p class="error-message">
                We're experiencing technical difficulties. Please try again later or contact us directly.
            </p>
            
            <div class="error-details">
                <h3><i class="fas fa-info-circle"></i> What to do next?</h3>
                <p><i class="fas fa-redo"></i> Try submitting the form again</p>
                <p><i class="fas fa-envelope"></i> Contact us directly if the problem persists</p>
                <p><i class="fas fa-clock"></i> We'll be back online shortly</p>
            </div>
            
            <div class="btn-group">
                <a href="/" class="btn btn-primary">
                    <i class="fas fa-arrow-left"></i>
                    Back to Registration
                </a>
                <a href="/#contact" class="btn btn-secondary">
                    <i class="fas fa-envelope"></i>
                    Contact Support
                </a>
            </div>
        </div>
    </div>
</body>
</html>`;
            
            return res.status(500).setHeader('Content-Type', 'text/html').send(errorHtml);
        } else {
            // Return JSON error for API calls
            return res.status(500).json({
                error: 'Internal server error',
                message: 'Failed to process registration. Please try again later.'
            });
        }
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
