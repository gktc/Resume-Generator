/**
 * Test script for Job Description Analysis endpoints
 * 
 * This script tests the job analysis functionality including:
 * - Analyzing job descriptions
 * - Getting job descriptions with match results
 * - Listing job descriptions
 * - Deleting job descriptions
 * 
 * Prerequisites:
 * - Backend server must be running (npm run dev)
 * - User must be registered and logged in
 * - User must have profile data (experience, education, skills)
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test credentials (use existing user or create new one)
const TEST_USER = {
  email: 'test@example.com',
  password: 'Test123!@#',
};

let authToken = '';
let jobId = '';

/**
 * Helper function to make authenticated requests
 */
async function apiRequest(method, endpoint, data = null) {
  try {
    const config = {
      method,
      url: `${API_BASE_URL}${endpoint}`,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`❌ Error: ${error.response.data.error?.message || error.message}`);
      throw error;
    }
    throw error;
  }
}

/**
 * Test 1: Login
 */
async function testLogin() {
  console.log('\n📝 Test 1: Login');
  try {
    const response = await apiRequest('POST', '/auth/login', TEST_USER);
    authToken = response.data.accessToken;
    console.log('✅ Login successful');
    console.log(`   Token: ${authToken.substring(0, 20)}...`);
    return true;
  } catch (error) {
    console.log('❌ Login failed - User may not exist');
    return false;
  }
}

/**
 * Test 2: Analyze Job Description
 */
async function testAnalyzeJob() {
  console.log('\n📝 Test 2: Analyze Job Description');
  
  const jobData = {
    company: 'Tech Corp',
    position: 'Senior Full Stack Developer',
    jobDescription: `
We are looking for a Senior Full Stack Developer to join our team.

Requirements:
- 5+ years of experience in web development
- Strong proficiency in JavaScript, TypeScript, React, and Node.js
- Experience with PostgreSQL and MongoDB
- Knowledge of Docker and Kubernetes
- Bachelor's degree in Computer Science or related field
- Experience with AWS cloud services

Preferred:
- Experience with microservices architecture
- Knowledge of GraphQL
- Familiarity with CI/CD pipelines

Responsibilities:
- Design and develop scalable web applications
- Collaborate with cross-functional teams
- Mentor junior developers
- Participate in code reviews
    `.trim(),
  };

  try {
    const response = await apiRequest('POST', '/jobs/analyze', jobData);
    jobId = response.data.jobId;
    
    console.log('✅ Job analysis successful');
    console.log(`   Job ID: ${jobId}`);
    console.log(`   Skills found: ${response.data.analysis.skills.join(', ')}`);
    console.log(`   Experience level: ${response.data.analysis.experienceLevel}`);
    console.log(`   Requirements: ${response.data.analysis.requirements.length} items`);
    console.log(`   Keywords: ${response.data.analysis.keywords.slice(0, 5).join(', ')}...`);
    return true;
  } catch (error) {
    console.log('❌ Job analysis failed');
    return false;
  }
}

/**
 * Test 3: Get Job Description with Match Results
 */
async function testGetJobWithMatch() {
  console.log('\n📝 Test 3: Get Job Description with Match Results');
  
  if (!jobId) {
    console.log('⚠️  Skipping - No job ID available');
    return false;
  }

  try {
    const response = await apiRequest('GET', `/jobs/${jobId}`);
    
    console.log('✅ Job retrieval successful');
    console.log(`   Company: ${response.data.job.company}`);
    console.log(`   Position: ${response.data.job.position}`);
    console.log('\n   Match Results:');
    console.log(`   - Overall Score: ${response.data.matchResult.overallScore}%`);
    console.log(`   - Skill Match: ${response.data.matchResult.skillMatch.percentage}%`);
    console.log(`   - Matching Skills: ${response.data.matchResult.skillMatch.matchingSkills.join(', ') || 'None'}`);
    console.log(`   - Missing Skills: ${response.data.matchResult.skillMatch.missingSkills.slice(0, 3).join(', ') || 'None'}`);
    console.log(`   - Experience Relevance: ${response.data.matchResult.experienceRelevance.score}%`);
    console.log(`   - Education Match: ${response.data.matchResult.educationMatch.score}%`);
    
    if (response.data.matchResult.recommendations.length > 0) {
      console.log('\n   Recommendations:');
      response.data.matchResult.recommendations.forEach((rec, i) => {
        console.log(`   ${i + 1}. ${rec}`);
      });
    }
    
    return true;
  } catch (error) {
    console.log('❌ Job retrieval failed');
    return false;
  }
}

/**
 * Test 4: List Job Descriptions
 */
async function testListJobs() {
  console.log('\n📝 Test 4: List Job Descriptions');
  
  try {
    const response = await apiRequest('GET', '/jobs?page=1&limit=10&sortBy=createdAt&sortOrder=desc');
    
    console.log('✅ Job list retrieval successful');
    console.log(`   Total jobs: ${response.data.pagination.total}`);
    console.log(`   Page: ${response.data.pagination.page} of ${response.data.pagination.totalPages}`);
    
    if (response.data.jobs.length > 0) {
      console.log('\n   Recent jobs:');
      response.data.jobs.slice(0, 3).forEach((job, i) => {
        console.log(`   ${i + 1}. ${job.position} at ${job.company}`);
      });
    }
    
    return true;
  } catch (error) {
    console.log('❌ Job list retrieval failed');
    return false;
  }
}

/**
 * Test 5: Delete Job Description
 */
async function testDeleteJob() {
  console.log('\n📝 Test 5: Delete Job Description');
  
  if (!jobId) {
    console.log('⚠️  Skipping - No job ID available');
    return false;
  }

  try {
    const response = await apiRequest('DELETE', `/jobs/${jobId}`);
    
    console.log('✅ Job deletion successful');
    console.log(`   Message: ${response.data.message}`);
    return true;
  } catch (error) {
    console.log('❌ Job deletion failed');
    return false;
  }
}

/**
 * Test 6: Verify Deletion
 */
async function testVerifyDeletion() {
  console.log('\n📝 Test 6: Verify Deletion');
  
  if (!jobId) {
    console.log('⚠️  Skipping - No job ID available');
    return false;
  }

  try {
    await apiRequest('GET', `/jobs/${jobId}`);
    console.log('❌ Job still exists after deletion');
    return false;
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('✅ Job successfully deleted (404 confirmed)');
      return true;
    }
    console.log('❌ Unexpected error during verification');
    return false;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting Job Description Analysis API Tests');
  console.log('='.repeat(50));

  const results = {
    passed: 0,
    failed: 0,
    skipped: 0,
  };

  // Test 1: Login
  const loginSuccess = await testLogin();
  if (!loginSuccess) {
    console.log('\n❌ Cannot proceed without authentication');
    console.log('\n💡 Tip: Make sure you have a user registered with these credentials:');
    console.log(`   Email: ${TEST_USER.email}`);
    console.log(`   Password: ${TEST_USER.password}`);
    console.log('\n   You can register using the auth endpoints or update TEST_USER in this script.');
    return;
  }
  results.passed++;

  // Test 2: Analyze Job
  if (await testAnalyzeJob()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 3: Get Job with Match
  if (await testGetJobWithMatch()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 4: List Jobs
  if (await testListJobs()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 5: Delete Job
  if (await testDeleteJob()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Test 6: Verify Deletion
  if (await testVerifyDeletion()) {
    results.passed++;
  } else {
    results.failed++;
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 Test Summary');
  console.log('='.repeat(50));
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`⚠️  Skipped: ${results.skipped}`);
  console.log(`📈 Success Rate: ${Math.round((results.passed / (results.passed + results.failed)) * 100)}%`);
}

// Run tests
runTests().catch(error => {
  console.error('\n💥 Unexpected error:', error.message);
  process.exit(1);
});
