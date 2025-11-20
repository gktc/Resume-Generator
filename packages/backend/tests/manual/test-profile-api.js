/**
 * Test script for Profile API endpoint
 *
 * Prerequisites:
 * 1. Backend server must be running (npm run dev)
 * 2. User must be authenticated (get token from LOGIN_CREDENTIALS.md)
 *
 * Usage: node test-profile-api.js
 */

const axios = require('axios');

// Get token from LOGIN_CREDENTIALS.md or use a test token
const token = 'YOUR_TOKEN_HERE';
const API_BASE_URL = 'http://localhost:3000/api';

/**
 * Test the GET /api/profile endpoint
 * Displays the response structure and profile data
 */
async function testProfileAPI() {
  try {
    console.log('🧪 Testing GET /api/profile...\n');

    const response = await axios.get(`${API_BASE_URL}/profile`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('=== Response Structure ===');
    console.log('Success:', response.data.success);
    console.log('Data keys:', Object.keys(response.data.data));

    if (response.data.data.profile) {
      const profile = response.data.data.profile;

      console.log('\n=== Profile Structure ===');
      console.log('Profile keys:', Object.keys(profile));
      console.log('Work Experiences:', profile.workExperiences?.length || 0);
      console.log('Education:', profile.educations?.length || 0);
      console.log('Skills:', profile.skills?.length || 0);
      console.log('Projects:', profile.projects?.length || 0);
    }

    console.log('\n=== Full Response ===');
    console.log(JSON.stringify(response.data, null, 2));

    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('\n❌ Test failed:');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Error:', error.response.data);
    } else {
      console.error('Error:', error.message);
    }

    if (token === 'YOUR_TOKEN_HERE') {
      console.error('\n⚠️  Please update the token variable with a valid JWT token');
      console.error('   Get a token by logging in or check LOGIN_CREDENTIALS.md');
    }
  }
}

// Run the test
testProfileAPI();
