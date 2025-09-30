// Test script for Cyber Oasis API endpoints
// Run with: node test-api.js

const BASE_URL = 'http://localhost:3000';

// Test data
const testRegistrationData = {
    teamName: 'Test Team Alpha',
    university: 'university-gabes',
    leaderName: 'Ahmed Ben Ali',
    memberName: 'Fatma Ben Salem',
    faculty: 'Faculty of Sciences',
    studyLevel: 'master',
    fieldStudy: 'Computer Science',
    leaderEmail: 'ahmed.test@example.com',
    leaderPhone: '+21612345678',
    cyberKnowledge: 'intermediate',
    hackathonExperience: 'yes',
    hackathonSpecify: 'Participated in 2 CTF competitions'
};

const testContactData = {
    name: 'Test User',
    email: 'test.contact@example.com',
    message: 'This is a test message from the local testing script.'
};

// Helper function to make API calls
async function makeRequest(endpoint, method = 'GET', data = null) {
    const url = `${BASE_URL}${endpoint}`;
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    if (data) {
        options.body = JSON.stringify(data);
    }
    
    try {
        const response = await fetch(url, options);
        const result = await response.json();
        
        console.log(`\n📡 ${method} ${endpoint}`);
        console.log(`Status: ${response.status}`);
        console.log('Response:', JSON.stringify(result, null, 2));
        
        return { success: response.ok, data: result, status: response.status };
    } catch (error) {
        console.error(`❌ Error calling ${endpoint}:`, error.message);
        return { success: false, error: error.message };
    }
}

// Test functions
async function testRegistration() {
    console.log('\n🧪 Testing Registration API...');
    return await makeRequest('/api/register', 'POST', testRegistrationData);
}

async function testContact() {
    console.log('\n🧪 Testing Contact API...');
    return await makeRequest('/api/contact', 'POST', testContactData);
}

async function testAdmin() {
    console.log('\n🧪 Testing Admin API...');
    return await makeRequest('/api/admin', 'GET');
}

async function testHealth() {
    console.log('\n🧪 Testing Health Check...');
    return await makeRequest('/api/health', 'GET');
}

// Main test function
async function runTests() {
    console.log('🚀 Starting Cyber Oasis API Tests');
    console.log('=====================================');
    
    // Check if server is running
    const healthCheck = await testHealth();
    if (!healthCheck.success) {
        console.log('\n❌ Server is not running!');
        console.log('Please start the server first with: npm run dev');
        return;
    }
    
    console.log('\n✅ Server is running!');
    
    // Run tests
    const results = {
        registration: await testRegistration(),
        contact: await testContact(),
        admin: await testAdmin()
    };
    
    // Summary
    console.log('\n📊 Test Results Summary');
    console.log('========================');
    console.log(`Registration API: ${results.registration.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Contact API: ${results.contact.success ? '✅ PASS' : '❌ FAIL'}`);
    console.log(`Admin API: ${results.admin.success ? '✅ PASS' : '❌ FAIL'}`);
    
    const allPassed = Object.values(results).every(result => result.success);
    console.log(`\nOverall: ${allPassed ? '🎉 ALL TESTS PASSED!' : '⚠️  SOME TESTS FAILED'}`);
    
    if (allPassed) {
        console.log('\n🎯 Next Steps:');
        console.log('1. Check your Google Spreadsheet for new data');
        console.log('2. Visit http://localhost:3000/admin.html to view the admin dashboard');
        console.log('3. Test the forms on your website at http://localhost:3000');
    }
}

// Run tests
runTests().catch(console.error);