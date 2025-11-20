/**
 * Test script for upload endpoints
 * 
 * This script tests the resume upload and parsing functionality
 * 
 * Prerequisites:
 * 1. Backend server must be running (npm run dev)
 * 2. User must be registered and logged in to get a token
 * 3. Ollama must be running with gemma2:2b model
 * 
 * Usage:
 * node test-upload-endpoints.js <access_token>
 */

import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const BASE_URL = 'http://localhost:3000/api';

// Get token from command line argument
const token = process.argv[2];

if (!token) {
  console.error('❌ Please provide an access token as argument');
  console.log('Usage: node test-upload-endpoints.js <access_token>');
  console.log('\nTo get a token, first register and login:');
  console.log('1. POST /api/auth/register');
  console.log('2. POST /api/auth/login');
  process.exit(1);
}

const headers = {
  Authorization: `Bearer ${token}`,
};

/**
 * Test 1: Upload a resume file
 */
async function testUploadResume() {
  console.log('\n📤 Test 1: Upload Resume');
  console.log('=' .repeat(50));

  try {
    // Create a sample resume file for testing
    const sampleResume = `
John Doe
Software Engineer
john.doe@email.com | (555) 123-4567 | linkedin.com/in/johndoe

WORK EXPERIENCE

Senior Software Engineer | Tech Corp | Jan 2020 - Present
- Led development of microservices architecture using Node.js and Docker
- Improved API response time by 40% through optimization
- Mentored 5 junior developers

Software Engineer | StartupXYZ | Jun 2018 - Dec 2019
- Built RESTful APIs using Express.js and PostgreSQL
- Implemented CI/CD pipeline with GitHub Actions
- Developed React frontend components

EDUCATION

Bachelor of Science in Computer Science | University of Technology | 2014 - 2018
GPA: 3.8/4.0
Dean's List all semesters

SKILLS

Technical: JavaScript, TypeScript, Node.js, React, PostgreSQL, Docker, AWS
Soft: Leadership, Communication, Problem Solving
Languages: English (Native), Spanish (Intermediate)

PROJECTS

E-commerce Platform
- Built full-stack e-commerce application with React and Node.js
- Integrated Stripe payment processing
- Technologies: React, Node.js, PostgreSQL, Redis
- GitHub: github.com/johndoe/ecommerce
    `.trim();

    // Create temporary test file
    const testFilePath = path.join(__dirname, 'test-resume.txt');
    fs.writeFileSync(testFilePath, sampleResume);

    const formData = new FormData();
    formData.append('resume', fs.createReadStream(testFilePath), {
      filename: 'test-resume.pdf',
      contentType: 'application/pdf',
    });

    const response = await axios.post(`${BASE_URL}/upload/resume`, formData, {
      headers: {
        ...headers,
        ...formData.getHeaders(),
      },
    });

    console.log('✅ Upload successful!');
    console.log('Response:', JSON.stringify(response.data, null, 2));

    // Clean up test file
    fs.unlinkSync(testFilePath);

    return response.data.data.id;
  } catch (error) {
    console.error('❌ Upload failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test 2: Get parsed data
 */
async function testGetParsedData(parseId) {
  console.log('\n📥 Test 2: Get Parsed Data');
  console.log('=' .repeat(50));

  try {
    const response = await axios.get(`${BASE_URL}/upload/parsed/${parseId}`, {
      headers,
    });

    console.log('✅ Retrieved parsed data successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));

    return response.data.data.parsedData;
  } catch (error) {
    console.error('❌ Get parsed data failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test 3: Confirm parsed data
 */
async function testConfirmParsedData(parseId, parsedData) {
  console.log('\n✅ Test 3: Confirm Parsed Data');
  console.log('=' .repeat(50));

  try {
    const response = await axios.post(
      `${BASE_URL}/upload/confirm/${parseId}`,
      parsedData,
      { headers }
    );

    console.log('✅ Confirmed parsed data successfully!');
    console.log('Response:', JSON.stringify(response.data, null, 2));
  } catch (error) {
    console.error('❌ Confirm parsed data failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Test 4: Verify data was saved to profile
 */
async function testVerifyProfile() {
  console.log('\n🔍 Test 4: Verify Profile Data');
  console.log('=' .repeat(50));

  try {
    const response = await axios.get(`${BASE_URL}/profile`, { headers });

    console.log('✅ Profile retrieved successfully!');
    console.log('Work Experiences:', response.data.data.workExperiences?.length || 0);
    console.log('Educations:', response.data.data.educations?.length || 0);
    console.log('Skills:', response.data.data.skills?.length || 0);
    console.log('Projects:', response.data.data.projects?.length || 0);
  } catch (error) {
    console.error('❌ Verify profile failed:', error.response?.data || error.message);
    throw error;
  }
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🚀 Starting Upload Endpoints Tests');
  console.log('=' .repeat(50));

  try {
    // Test 1: Upload resume
    const parseId = await testUploadResume();

    // Test 2: Get parsed data
    const parsedData = await testGetParsedData(parseId);

    // Test 3: Confirm parsed data
    await testConfirmParsedData(parseId, parsedData);

    // Test 4: Verify profile
    await testVerifyProfile();

    console.log('\n' + '=' .repeat(50));
    console.log('✅ All tests passed!');
    console.log('=' .repeat(50));
  } catch (error) {
    console.log('\n' + '=' .repeat(50));
    console.log('❌ Tests failed!');
    console.log('=' .repeat(50));
    process.exit(1);
  }
}

// Run tests
runTests();
