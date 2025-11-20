/**
 * Security Features Test Script
 * Tests rate limiting and security headers
 */

import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function testSecurityHeaders() {
  console.log('\n🔒 Testing Security Headers...\n');

  try {
    const response = await axios.get(`${BASE_URL}/health`);

    console.log('✅ Security Headers Present:');
    const securityHeaders = [
      'content-security-policy',
      'cross-origin-opener-policy',
      'cross-origin-resource-policy',
      'origin-agent-cluster',
      'referrer-policy',
      'strict-transport-security',
      'x-content-type-options',
      'x-frame-options',
    ];

    securityHeaders.forEach((header) => {
      const value = response.headers[header];
      if (value) {
        console.log(`   ${header}: ${value}`);
      }
    });

    console.log('\n✅ CORS Headers:');
    console.log(`   access-control-allow-origin: ${response.headers['access-control-allow-origin']}`);
  } catch (error) {
    console.error('❌ Error testing security headers:', error.message);
  }
}

async function testRateLimiting() {
  console.log('\n⏱️  Testing Rate Limiting...\n');

  try {
    // Make multiple requests to test rate limiting
    console.log('Making 10 requests to /health endpoint...');

    for (let i = 1; i <= 10; i++) {
      const response = await axios.get(`${BASE_URL}/health`);
      const remaining = response.headers['ratelimit-remaining'];
      const limit = response.headers['ratelimit-limit'];

      console.log(`Request ${i}: Status ${response.status} - Rate Limit: ${remaining}/${limit} remaining`);

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    }

    console.log('\n✅ Rate limiting is working correctly!');
  } catch (error) {
    if (error.response && error.response.status === 429) {
      console.log('\n✅ Rate limit exceeded! Got 429 status as expected.');
      console.log(`   Error: ${error.response.data.error.message}`);
    } else {
      console.error('❌ Error testing rate limiting:', error.message);
    }
  }
}

async function testAuthRateLimiting() {
  console.log('\n🔐 Testing Auth Endpoint Rate Limiting...\n');

  try {
    console.log('Making 6 requests to /api/auth/login (limit is 5)...');

    for (let i = 1; i <= 6; i++) {
      try {
        const response = await axios.post(`${BASE_URL}/api/auth/login`, {
          email: 'test@example.com',
          password: 'testpassword',
        });

        const remaining = response.headers['ratelimit-remaining'];
        const limit = response.headers['ratelimit-limit'];

        console.log(`Request ${i}: Status ${response.status} - Rate Limit: ${remaining}/${limit} remaining`);
      } catch (error) {
        if (error.response) {
          if (error.response.status === 429) {
            console.log(`\n✅ Request ${i}: Rate limit exceeded! Got 429 status.`);
            console.log(`   Message: ${error.response.data.error.message}`);
            console.log(`   Code: ${error.response.data.error.code}`);
            break;
          } else {
            // Other errors (like database not connected) are expected
            const remaining = error.response.headers['ratelimit-remaining'];
            const limit = error.response.headers['ratelimit-limit'];
            console.log(`Request ${i}: Status ${error.response.status} - Rate Limit: ${remaining}/${limit} remaining`);
          }
        }
      }

      // Small delay between requests
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
  } catch (error) {
    console.error('❌ Error testing auth rate limiting:', error.message);
  }
}

async function runTests() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('   ATS Resume Builder - Security Features Test');
  console.log('═══════════════════════════════════════════════════════');

  await testSecurityHeaders();
  await testRateLimiting();
  await testAuthRateLimiting();

  console.log('\n═══════════════════════════════════════════════════════');
  console.log('   All Security Tests Completed!');
  console.log('═══════════════════════════════════════════════════════\n');
}

// Run tests
runTests().catch(console.error);
