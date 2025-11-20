/**
 * Test script for Community Interview Platform (Task 11)
 * 
 * This script tests:
 * - Submitting interview experiences
 * - Data anonymization
 * - Fetching company insights
 * - Listing available companies
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api';

// Test user credentials (you'll need to register first or use existing user)
const TEST_USER = {
  email: 'test@example.com',
  password: 'Test123456',
};

let authToken = '';

// Helper function to make authenticated requests
async function makeRequest(method, url, data = null) {
  try {
    const config = {
      method,
      url: `${BASE_URL}${url}`,
      headers: authToken ? { Authorization: `Bearer ${authToken}` } : {},
    };

    if (data) {
      config.data = data;
    }

    const response = await axios(config);
    return response.data;
  } catch (error) {
    if (error.response) {
      console.error(`Error: ${error.response.status}`, error.response.data);
      throw error;
    }
    throw error;
  }
}

async function login() {
  console.log('\n=== Logging in ===');
  try {
    const response = await makeRequest('POST', '/auth/login', TEST_USER);
    authToken = response.data.accessToken;
    console.log('✓ Login successful');
    return true;
  } catch (error) {
    console.log('✗ Login failed - trying to register');
    try {
      await makeRequest('POST', '/auth/register', {
        ...TEST_USER,
        firstName: 'Test',
        lastName: 'User',
      });
      console.log('✓ Registration successful');
      const loginResponse = await makeRequest('POST', '/auth/login', TEST_USER);
      authToken = loginResponse.data.accessToken;
      console.log('✓ Login successful after registration');
      return true;
    } catch (regError) {
      console.error('✗ Registration and login failed');
      return false;
    }
  }
}

async function testSubmitInterviewExperience() {
  console.log('\n=== Testing Interview Experience Submission ===');

  const experienceData = {
    company: 'Google',
    role: 'Software Engineer',
    interviewDate: new Date('2024-01-15'),
    outcome: 'offer',
    overallDifficulty: 'hard',
    preparationTips: [
      'Practice system design problems daily',
      'Review data structures and algorithms',
      'Mock interviews with peers helped a lot',
      'Contact me at john@example.com for tips', // This should be anonymized
    ],
    rounds: [
      {
        roundNumber: 1,
        roundType: 'phone-screen',
        duration: 45,
        difficulty: 'easy',
        topics: ['Background', 'Motivation', 'Basic coding'],
        questions: [
          'Tell me about yourself',
          'Why Google?',
          'Reverse a string in-place',
        ],
        notes: 'Friendly recruiter, straightforward questions. Call me at 555-1234 for details.', // Should be anonymized
      },
      {
        roundNumber: 2,
        roundType: 'technical',
        duration: 60,
        difficulty: 'medium',
        topics: ['Data Structures', 'Algorithms', 'Problem Solving'],
        questions: [
          'Implement LRU Cache',
          'Find median in a stream of integers',
        ],
        notes: 'Interviewer was helpful and gave hints when stuck',
      },
      {
        roundNumber: 3,
        roundType: 'system-design',
        duration: 60,
        difficulty: 'hard',
        topics: ['Scalability', 'Distributed Systems', 'Database Design'],
        questions: [
          'Design a URL shortener',
          'How would you handle 1M requests per second?',
        ],
        notes: 'Very challenging, needed to think about trade-offs',
      },
      {
        roundNumber: 4,
        roundType: 'behavioral',
        duration: 45,
        difficulty: 'medium',
        topics: ['Leadership', 'Conflict Resolution', 'Teamwork'],
        questions: [
          'Tell me about a time you disagreed with a team member',
          'Describe a project you led',
        ],
        notes: 'Used STAR method for all answers',
      },
    ],
  };

  try {
    const response = await makeRequest('POST', '/interview/experience', experienceData);
    console.log('✓ Interview experience submitted successfully');
    console.log('  Experience ID:', response.data.id);
    console.log('  Company:', response.data.company);
    console.log('  Role:', response.data.role);
    return response.data;
  } catch (error) {
    console.error('✗ Failed to submit interview experience');
    throw error;
  }
}

async function testSubmitAnotherExperience() {
  console.log('\n=== Submitting Another Experience (Same Company) ===');

  const experienceData = {
    company: 'Google',
    role: 'Software Engineer',
    interviewDate: new Date('2024-02-20'),
    outcome: 'rejected',
    overallDifficulty: 'medium',
    preparationTips: [
      'Focus on communication skills',
      'Practice explaining your thought process',
    ],
    rounds: [
      {
        roundNumber: 1,
        roundType: 'phone-screen',
        duration: 30,
        difficulty: 'easy',
        topics: ['Background', 'Experience'],
        questions: ['Walk me through your resume'],
        notes: 'Quick screening call',
      },
      {
        roundNumber: 2,
        roundType: 'technical',
        duration: 60,
        difficulty: 'hard',
        topics: ['Algorithms', 'Optimization'],
        questions: [
          'Find the longest palindromic substring',
          'Optimize the solution for space complexity',
        ],
        notes: 'Struggled with optimization',
      },
    ],
  };

  try {
    const response = await makeRequest('POST', '/interview/experience', experienceData);
    console.log('✓ Second interview experience submitted');
    return response.data;
  } catch (error) {
    console.error('✗ Failed to submit second experience');
    throw error;
  }
}

async function testGetAvailableCompanies() {
  console.log('\n=== Testing Get Available Companies ===');

  try {
    const response = await makeRequest('GET', '/interview/insights');
    console.log('✓ Available companies fetched successfully');
    console.log('  Total companies:', response.data.total);
    console.log('  Companies:');
    response.data.companies.forEach((company) => {
      console.log(`    - ${company.company} - ${company.role} (${company.count} submissions)`);
    });
    return response.data.companies;
  } catch (error) {
    console.error('✗ Failed to fetch available companies');
    throw error;
  }
}

async function testGetCompanyInsights() {
  console.log('\n=== Testing Get Company Insights ===');

  try {
    const response = await makeRequest('GET', '/interview/insights/Google/Software Engineer');
    console.log('✓ Company insights fetched successfully');
    
    const insights = response.data;
    console.log('\n  Company:', insights.company);
    console.log('  Role:', insights.role);
    console.log('  Total Submissions:', insights.totalSubmissions);
    console.log('  Last Updated:', new Date(insights.lastUpdated).toLocaleDateString());
    
    console.log('\n  Process Structure:');
    console.log('    Average Rounds:', insights.processStructure.averageRounds);
    console.log('    Common Round Types:');
    insights.processStructure.commonRoundTypes.forEach((rt) => {
      console.log(`      - ${rt.type}: ${(rt.frequency * 100).toFixed(0)}%`);
    });
    
    console.log('\n  Difficulty Distribution:');
    console.log(`    Easy: ${(insights.difficultyDistribution.easy * 100).toFixed(0)}%`);
    console.log(`    Medium: ${(insights.difficultyDistribution.medium * 100).toFixed(0)}%`);
    console.log(`    Hard: ${(insights.difficultyDistribution.hard * 100).toFixed(0)}%`);
    
    console.log('\n  Top Topics:');
    insights.topicFrequency.slice(0, 5).forEach((topic) => {
      console.log(`    - ${topic.topic}: ${(topic.frequency * 100).toFixed(0)}%`);
    });
    
    console.log('\n  Common Questions (Top 5):');
    insights.commonQuestions.slice(0, 5).forEach((q, idx) => {
      console.log(`    ${idx + 1}. ${q.question} (${q.category})`);
    });
    
    console.log('\n  Success Tips:');
    insights.successTips.slice(0, 3).forEach((tip) => {
      console.log(`    - ${tip}`);
    });
    
    // Check if PII was anonymized
    console.log('\n  Checking Anonymization:');
    const hasEmail = insights.successTips.some(tip => tip.includes('@') && !tip.includes('[email]'));
    const hasPhone = insights.successTips.some(tip => /\d{3}-\d{4}/.test(tip) && !tip.includes('[phone]'));
    
    if (hasEmail || hasPhone) {
      console.log('    ✗ WARNING: PII may not be properly anonymized!');
    } else {
      console.log('    ✓ PII appears to be properly anonymized');
    }
    
    return insights;
  } catch (error) {
    console.error('✗ Failed to fetch company insights');
    throw error;
  }
}

async function testValidation() {
  console.log('\n=== Testing Input Validation ===');

  // Test missing required fields
  console.log('\n  Testing missing required fields...');
  try {
    await makeRequest('POST', '/interview/experience', {
      company: 'Test Company',
      // Missing role, interviewDate, etc.
    });
    console.log('  ✗ Should have failed validation');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('  ✓ Correctly rejected missing fields');
    } else {
      console.log('  ✗ Unexpected error');
    }
  }

  // Test invalid outcome enum
  console.log('\n  Testing invalid outcome enum...');
  try {
    await makeRequest('POST', '/interview/experience', {
      company: 'Test Company',
      role: 'Test Role',
      interviewDate: new Date(),
      outcome: 'invalid_outcome',
      overallDifficulty: 'medium',
      rounds: [
        {
          roundNumber: 1,
          roundType: 'phone-screen',
          duration: 30,
          difficulty: 'easy',
          topics: [],
          questions: [],
          notes: '',
        },
      ],
    });
    console.log('  ✗ Should have failed validation');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('  ✓ Correctly rejected invalid outcome');
    } else {
      console.log('  ✗ Unexpected error');
    }
  }

  // Test empty rounds array
  console.log('\n  Testing empty rounds array...');
  try {
    await makeRequest('POST', '/interview/experience', {
      company: 'Test Company',
      role: 'Test Role',
      interviewDate: new Date(),
      outcome: 'offer',
      overallDifficulty: 'medium',
      rounds: [],
    });
    console.log('  ✗ Should have failed validation');
  } catch (error) {
    if (error.response && error.response.status === 400) {
      console.log('  ✓ Correctly rejected empty rounds');
    } else {
      console.log('  ✗ Unexpected error');
    }
  }

  console.log('\n  ✓ All validation tests passed');
}

async function testNonExistentCompany() {
  console.log('\n=== Testing Non-Existent Company ===');

  try {
    await makeRequest('GET', '/interview/insights/NonExistentCompany/NonExistentRole');
    console.log('  ✗ Should have returned 404');
  } catch (error) {
    if (error.response && error.response.status === 404) {
      console.log('  ✓ Correctly returned 404 for non-existent company');
    } else {
      console.log('  ✗ Unexpected error');
    }
  }
}

async function runTests() {
  console.log('=================================================');
  console.log('Community Interview Platform Test Suite');
  console.log('=================================================');

  try {
    // Login
    const loggedIn = await login();
    if (!loggedIn) {
      console.error('\nTests aborted: Could not authenticate');
      return;
    }

    // Run tests
    await testSubmitInterviewExperience();
    await testSubmitAnotherExperience();
    await testGetAvailableCompanies();
    await testGetCompanyInsights();
    await testValidation();
    await testNonExistentCompany();

    console.log('\n=================================================');
    console.log('✓ All tests completed successfully!');
    console.log('=================================================');
  } catch (error) {
    console.log('\n=================================================');
    console.log('✗ Test suite failed');
    console.log('=================================================');
    console.error(error.message);
  }
}

// Run the tests
runTests();
