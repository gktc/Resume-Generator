/**
 * Test script for Resume Generation API endpoints
 * 
 * Prerequisites:
 * 1. Server must be running (npm run dev)
 * 2. Database must be set up with migrations
 * 3. Redis must be running
 * 4. User must be registered and logged in
 * 5. User must have profile data
 * 6. User must have a job description analyzed
 * 7. Templates must be seeded
 * 
 * Usage: node test-resume-endpoints.js
 */

const API_URL = 'http://localhost:3000/api';

// You need to set these after running auth and job analysis tests
const AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE';
const JOB_DESCRIPTION_ID = 'YOUR_JOB_DESCRIPTION_ID_HERE';
const TEMPLATE_ID = 'YOUR_TEMPLATE_ID_HERE';

let resumeId = null;
let jobId = null;

/**
 * Helper function to make API requests
 */
async function apiRequest(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  if (AUTH_TOKEN && AUTH_TOKEN !== 'YOUR_AUTH_TOKEN_HERE') {
    headers['Authorization'] = `Bearer ${AUTH_TOKEN}`;
  }

  const config = {
    ...options,
    headers,
  };

  console.log(`\n📡 ${options.method || 'GET'} ${url}`);
  
  try {
    const response = await fetch(url, config);
    const data = await response.json();
    
    console.log(`📊 Status: ${response.status}`);
    console.log(`📦 Response:`, JSON.stringify(data, null, 2));
    
    return { response, data };
  } catch (error) {
    console.error(`❌ Error:`, error.message);
    throw error;
  }
}

/**
 * Test 1: Generate Resume
 */
async function testGenerateResume() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 1: Generate Resume');
  console.log('='.repeat(60));

  const { response, data } = await apiRequest('/resume/generate', {
    method: 'POST',
    body: JSON.stringify({
      jobDescriptionId: JOB_DESCRIPTION_ID,
      templateId: TEMPLATE_ID,
    }),
  });

  if (response.status === 202 && data.success) {
    console.log('✅ Resume generation queued successfully');
    resumeId = data.data.resumeId;
    jobId = data.data.jobId;
    console.log(`📝 Resume ID: ${resumeId}`);
    console.log(`🔧 Job ID: ${jobId}`);
  } else {
    console.log('❌ Failed to queue resume generation');
  }

  return data;
}

/**
 * Test 2: Check Job Status
 */
async function testCheckJobStatus() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 2: Check Job Status');
  console.log('='.repeat(60));

  if (!jobId) {
    console.log('⚠️ Skipping - no job ID available');
    return;
  }

  // Poll for status
  let attempts = 0;
  const maxAttempts = 30; // 30 seconds max

  while (attempts < maxAttempts) {
    const { response, data } = await apiRequest(`/resume/status/${jobId}`);

    if (response.status === 200 && data.success) {
      console.log(`📊 Status: ${data.data.status}`);
      console.log(`📈 Progress: ${data.data.progress}%`);

      if (data.data.status === 'completed') {
        console.log('✅ Resume generation completed');
        return data;
      } else if (data.data.status === 'failed') {
        console.log('❌ Resume generation failed');
        console.log(`Error: ${data.data.error}`);
        return data;
      }
    }

    // Wait 1 second before next poll
    await new Promise(resolve => setTimeout(resolve, 1000));
    attempts++;
  }

  console.log('⚠️ Timeout waiting for resume generation');
}

/**
 * Test 3: Get Resume Details
 */
async function testGetResume() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 3: Get Resume Details');
  console.log('='.repeat(60));

  if (!resumeId) {
    console.log('⚠️ Skipping - no resume ID available');
    return;
  }

  const { response, data } = await apiRequest(`/resume/${resumeId}`);

  if (response.status === 200 && data.success) {
    console.log('✅ Resume details retrieved');
    console.log(`📄 File: ${data.data.fileName}`);
    console.log(`📊 Status: ${data.data.status}`);
    console.log(`🎯 ATS Score: ${data.data.atsScore?.overall || 'N/A'}`);
  } else {
    console.log('❌ Failed to get resume details');
  }

  return data;
}

/**
 * Test 4: List Resumes
 */
async function testListResumes() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 4: List Resumes');
  console.log('='.repeat(60));

  const { response, data } = await apiRequest('/resume?page=1&limit=10');

  if (response.status === 200 && data.success) {
    console.log('✅ Resumes listed successfully');
    console.log(`📊 Total: ${data.data.pagination.total}`);
    console.log(`📄 Resumes: ${data.data.resumes.length}`);
  } else {
    console.log('❌ Failed to list resumes');
  }

  return data;
}

/**
 * Test 5: Download Resume (just check endpoint, don't actually download)
 */
async function testDownloadResume() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 5: Download Resume');
  console.log('='.repeat(60));

  if (!resumeId) {
    console.log('⚠️ Skipping - no resume ID available');
    return;
  }

  // Just check if the endpoint responds
  const url = `${API_URL}/resume/${resumeId}/download`;
  console.log(`\n📡 GET ${url}`);
  
  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': `Bearer ${AUTH_TOKEN}`,
      },
    });

    console.log(`📊 Status: ${response.status}`);
    console.log(`📦 Content-Type: ${response.headers.get('content-type')}`);

    if (response.status === 200) {
      console.log('✅ Resume download endpoint working');
    } else {
      const data = await response.json();
      console.log(`❌ Failed to download resume`);
      console.log(`📦 Response:`, JSON.stringify(data, null, 2));
    }
  } catch (error) {
    console.error(`❌ Error:`, error.message);
  }
}

/**
 * Test 6: Regenerate Resume
 */
async function testRegenerateResume() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 6: Regenerate Resume');
  console.log('='.repeat(60));

  if (!resumeId) {
    console.log('⚠️ Skipping - no resume ID available');
    return;
  }

  const { response, data } = await apiRequest(`/resume/${resumeId}/regenerate`, {
    method: 'POST',
  });

  if (response.status === 202 && data.success) {
    console.log('✅ Resume regeneration queued successfully');
    console.log(`📝 New Resume ID: ${data.data.resumeId}`);
    console.log(`🔧 New Job ID: ${data.data.jobId}`);
  } else {
    console.log('❌ Failed to queue resume regeneration');
  }

  return data;
}

/**
 * Test 7: Delete Resume
 */
async function testDeleteResume() {
  console.log('\n' + '='.repeat(60));
  console.log('TEST 7: Delete Resume');
  console.log('='.repeat(60));

  if (!resumeId) {
    console.log('⚠️ Skipping - no resume ID available');
    return;
  }

  // Ask for confirmation
  console.log('⚠️ This will delete the resume. Skipping for safety.');
  console.log('To test deletion, uncomment the code below.');
  
  /*
  const { response, data } = await apiRequest(`/resume/${resumeId}`, {
    method: 'DELETE',
  });

  if (response.status === 200 && data.success) {
    console.log('✅ Resume deleted successfully');
  } else {
    console.log('❌ Failed to delete resume');
  }

  return data;
  */
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('\n🚀 Starting Resume Generation API Tests\n');

  // Check prerequisites
  if (AUTH_TOKEN === 'YOUR_AUTH_TOKEN_HERE') {
    console.log('❌ Please set AUTH_TOKEN in the script');
    return;
  }

  if (JOB_DESCRIPTION_ID === 'YOUR_JOB_DESCRIPTION_ID_HERE') {
    console.log('❌ Please set JOB_DESCRIPTION_ID in the script');
    return;
  }

  if (TEMPLATE_ID === 'YOUR_TEMPLATE_ID_HERE') {
    console.log('❌ Please set TEMPLATE_ID in the script');
    return;
  }

  try {
    await testGenerateResume();
    await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
    
    await testCheckJobStatus();
    await testGetResume();
    await testListResumes();
    await testDownloadResume();
    await testRegenerateResume();
    await testDeleteResume();

    console.log('\n' + '='.repeat(60));
    console.log('✅ All tests completed!');
    console.log('='.repeat(60));
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
  }
}

// Run tests
runTests();
