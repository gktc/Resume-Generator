/**
 * Test script for Interview Preparation Module
 * 
 * This script tests the interview preparation endpoints
 */

const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000/api';

// Test credentials (you'll need to use actual credentials from your database)
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'Test123!@#';

let authToken = '';
let testResumeId = '';

async function login() {
  console.log('\n📝 Logging in...');
  try {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email: TEST_EMAIL,
      password: TEST_PASSWORD,
    });

    if (response.data.success) {
      authToken = response.data.data.accessToken;
      console.log('✅ Login successful');
      return true;
    }
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data || error.message);
    return false;
  }
}

async function getResumes() {
  console.log('\n📋 Fetching resumes...');
  try {
    const response = await axios.get(`${API_BASE_URL}/resume`, {
      headers: {
        Authorization: `Bearer ${authToken}`,
      },
    });

    if (response.data.success && response.data.data.resumes.length > 0) {
      testResumeId = response.data.data.resumes[0].id;
      console.log(`✅ Found resume: ${testResumeId}`);
      return true;
    } else {
      console.log('⚠️  No resumes found. Please generate a resume first.');
      return false;
    }
  } catch (error) {
    console.error('❌ Failed to fetch resumes:', error.response?.data || error.message);
    return false;
  }
}

async function testGetInterviewQuestions() {
  console.log('\n🎯 Testing GET /api/interview/questions/:resumeId');
  try {
    const response = await axios.get(
      `${API_BASE_URL}/interview/questions/${testResumeId}`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.data.success) {
      console.log('✅ Interview questions generated successfully');
      console.log(`   Total questions: ${response.data.data.total}`);
      console.log(`   Technical: ${response.data.data.questions.technical.length}`);
      console.log(`   Behavioral: ${response.data.data.questions.behavioral.length}`);
      console.log(`   Experience: ${response.data.data.questions.experience.length}`);
      console.log(`   Role-specific: ${response.data.data.questions.roleSpecific.length}`);
      
      // Display a sample question
      if (response.data.data.questions.technical.length > 0) {
        const sampleQuestion = response.data.data.questions.technical[0];
        console.log('\n📌 Sample Technical Question:');
        console.log(`   Q: ${sampleQuestion.question}`);
        console.log(`   Difficulty: ${sampleQuestion.difficulty}`);
        console.log(`   Related Content: ${sampleQuestion.relatedContent.substring(0, 100)}...`);
        if (sampleQuestion.answerFramework) {
          console.log(`   Answer Framework: ${sampleQuestion.answerFramework.substring(0, 100)}...`);
        }
        if (sampleQuestion.talkingPoints.length > 0) {
          console.log(`   Talking Points: ${sampleQuestion.talkingPoints.length} points`);
        }
      }
      
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to get interview questions:', error.response?.data || error.message);
    return false;
  }
}

async function testFilterByCategory() {
  console.log('\n🔍 Testing filter by category (behavioral)');
  try {
    const response = await axios.get(
      `${API_BASE_URL}/interview/questions/${testResumeId}?category=behavioral`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.data.success) {
      console.log('✅ Filtered questions successfully');
      console.log(`   Behavioral questions: ${response.data.data.questions.behavioral.length}`);
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to filter questions:', error.response?.data || error.message);
    return false;
  }
}

async function testFilterByDifficulty() {
  console.log('\n🔍 Testing filter by difficulty (medium)');
  try {
    const response = await axios.get(
      `${API_BASE_URL}/interview/questions/${testResumeId}?difficulty=medium`,
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );

    if (response.data.success) {
      console.log('✅ Filtered questions by difficulty successfully');
      const totalQuestions = 
        response.data.data.questions.technical.length +
        response.data.data.questions.behavioral.length +
        response.data.data.questions.experience.length +
        response.data.data.questions.roleSpecific.length;
      console.log(`   Medium difficulty questions: ${totalQuestions}`);
      return true;
    }
  } catch (error) {
    console.error('❌ Failed to filter by difficulty:', error.response?.data || error.message);
    return false;
  }
}

async function runTests() {
  console.log('🚀 Starting Interview Preparation Module Tests\n');
  console.log('=' .repeat(60));

  // Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('\n❌ Tests aborted: Login failed');
    return;
  }

  // Get resumes
  const resumesSuccess = await getResumes();
  if (!resumesSuccess) {
    console.log('\n❌ Tests aborted: No resumes available');
    return;
  }

  // Run tests
  await testGetInterviewQuestions();
  await testFilterByCategory();
  await testFilterByDifficulty();

  console.log('\n' + '='.repeat(60));
  console.log('✅ All tests completed!\n');
}

// Run the tests
runTests().catch(error => {
  console.error('\n💥 Test suite failed:', error);
  process.exit(1);
});
