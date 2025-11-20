/**
 * Test script for logout and /me endpoints
 * Run with: node test-auth-endpoints.js
 */

const API_URL = 'http://localhost:3000/api';

async function testAuthEndpoints() {
  console.log('🧪 Testing Auth Endpoints\n');

  try {
    // Step 1: Register a test user
    console.log('1️⃣ Registering test user...');
    const registerResponse = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: `test-${Date.now()}@example.com`,
        password: 'Test123!@#',
        firstName: 'Test',
        lastName: 'User',
      }),
    });

    const registerData = await registerResponse.json();
    if (!registerData.success) {
      console.error('❌ Registration failed:', registerData.error);
      return;
    }
    console.log('✅ Registration successful');
    console.log('   User ID:', registerData.data.user.id);

    const { accessToken, refreshToken } = registerData.data.tokens;

    // Step 2: Test GET /api/auth/me endpoint
    console.log('\n2️⃣ Testing GET /api/auth/me...');
    const meResponse = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const meData = await meResponse.json();
    if (!meData.success) {
      console.error('❌ /me endpoint failed:', meData.error);
      return;
    }
    console.log('✅ /me endpoint successful');
    console.log('   User:', meData.data.user.email);
    console.log('   Name:', `${meData.data.user.firstName} ${meData.data.user.lastName}`);

    // Step 3: Test GET /api/auth/me without token
    console.log('\n3️⃣ Testing GET /api/auth/me without token...');
    const meNoTokenResponse = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
    });

    const meNoTokenData = await meNoTokenResponse.json();
    if (meNoTokenResponse.status === 401 && !meNoTokenData.success) {
      console.log('✅ Correctly rejected unauthenticated request');
      console.log('   Error code:', meNoTokenData.error.code);
    } else {
      console.error('❌ Should have rejected unauthenticated request');
    }

    // Step 4: Test POST /api/auth/logout
    console.log('\n4️⃣ Testing POST /api/auth/logout...');
    const logoutResponse = await fetch(`${API_URL}/auth/logout`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const logoutData = await logoutResponse.json();
    if (!logoutData.success) {
      console.error('❌ Logout failed:', logoutData.error);
      return;
    }
    console.log('✅ Logout successful');
    console.log('   Message:', logoutData.data.message);

    // Step 5: Verify refresh token is invalidated
    console.log('\n5️⃣ Verifying refresh token is invalidated...');
    const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    const refreshData = await refreshResponse.json();
    if (refreshResponse.status === 401 && !refreshData.success) {
      console.log('✅ Refresh token correctly invalidated');
      console.log('   Error code:', refreshData.error.code);
    } else {
      console.error('❌ Refresh token should have been invalidated');
    }

    // Step 6: Verify access token still works (until it expires)
    console.log('\n6️⃣ Verifying access token still works...');
    const meAfterLogoutResponse = await fetch(`${API_URL}/auth/me`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const meAfterLogoutData = await meAfterLogoutResponse.json();
    if (meAfterLogoutData.success) {
      console.log('✅ Access token still valid (expected until expiration)');
      console.log('   Note: Access tokens remain valid until they expire');
    } else {
      console.log('ℹ️  Access token no longer valid');
    }

    console.log('\n✨ All tests completed successfully!\n');
  } catch (error) {
    console.error('\n❌ Test failed with error:', error.message);
  }
}

testAuthEndpoints();
