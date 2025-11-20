/**
 * Test script for profile management endpoints
 * Run with: node test-profile-endpoints.js
 */

const API_BASE = 'http://localhost:3000/api';

// Test user credentials
const testUser = {
  email: `profile-test-${Date.now()}@example.com`,
  password: 'Test123!@#',
  firstName: 'Profile',
  lastName: 'Tester',
};

let accessToken = '';
let workExperienceId = '';
let educationId = '';
let skillId = '';
let projectId = '';

/**
 * Helper function to make API requests
 */
async function apiRequest(method, endpoint, data = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const result = await response.json();

  return { status: response.status, data: result };
}

/**
 * Test 0: Register test user and get access token
 */
async function testRegister() {
  console.log('\n📝 Test 0: Register test user');

  const { status, data } = await apiRequest('POST', '/auth/register', testUser);

  if (status === 201 && data.success) {
    accessToken = data.data.tokens.accessToken;
    console.log('✅ User registered successfully');
    console.log(`   Email: ${testUser.email}`);
    console.log(`   Token: ${accessToken.substring(0, 20)}...`);
    return true;
  } else {
    console.log('❌ Registration failed:', data);
    return false;
  }
}

/**
 * Test 1: Get empty profile
 */
async function testGetEmptyProfile() {
  console.log('\n📝 Test 1: Get empty profile');
  const { status, data } = await apiRequest('GET', '/profile', null, accessToken);

  if (status === 200 && data.success) {
    console.log('✅ Profile fetched successfully');
    console.log(`   User: ${data.data.profile.firstName} ${data.data.profile.lastName}`);
    console.log(`   Work Experiences: ${data.data.profile.workExperiences.length}`);
    console.log(`   Education: ${data.data.profile.educations.length}`);
    console.log(`   Skills: ${data.data.profile.skills.length}`);
    console.log(`   Projects: ${data.data.profile.projects.length}`);
    return true;
  } else {
    console.log('❌ Failed to fetch profile:', data);
    return false;
  }
}

/**
 * Test 2: Create work experience
 */
async function testCreateWorkExperience() {
  console.log('\n📝 Test 2: Create work experience');
  const workExperience = {
    company: 'Tech Corp',
    position: 'Senior Software Engineer',
    startDate: '2020-01-01',
    endDate: '2023-12-31',
    description: 'Led development of cloud-based applications',
    achievements: [
      'Improved system performance by 40%',
      'Mentored 5 junior developers',
    ],
    technologies: ['Node.js', 'React', 'PostgreSQL', 'AWS'],
    order: 0,
  };

  const { status, data } = await apiRequest('POST', '/profile/experience', workExperience, accessToken);

  if (status === 201 && data.success) {
    workExperienceId = data.data.experience.id;
    console.log('✅ Work experience created successfully');
    console.log(`   ID: ${workExperienceId}`);
    console.log(`   Company: ${data.data.experience.company}`);
    console.log(`   Position: ${data.data.experience.position}`);
    return true;
  } else {
    console.log('❌ Failed to create work experience:', data);
    return false;
  }
}

/**
 * Test 3: Create education
 */
async function testCreateEducation() {
  console.log('\n📝 Test 3: Create education');
  const education = {
    institution: 'University of Technology',
    degree: 'Bachelor of Science',
    fieldOfStudy: 'Computer Science',
    startDate: '2015-09-01',
    endDate: '2019-06-30',
    gpa: 3.8,
    achievements: [
      'Dean\'s List all semesters',
      'Best Capstone Project Award',
    ],
    order: 0,
  };

  const { status, data } = await apiRequest('POST', '/profile/education', education, accessToken);

  if (status === 201 && data.success) {
    educationId = data.data.education.id;
    console.log('✅ Education created successfully');
    console.log(`   ID: ${educationId}`);
    console.log(`   Institution: ${data.data.education.institution}`);
    console.log(`   Degree: ${data.data.education.degree}`);
    return true;
  } else {
    console.log('❌ Failed to create education:', data);
    return false;
  }
}

/**
 * Test 4: Create skill
 */
async function testCreateSkill() {
  console.log('\n📝 Test 4: Create skill');
  const skill = {
    name: 'JavaScript',
    category: 'technical',
    proficiency: 'expert',
    yearsOfExperience: 8,
    order: 0,
  };

  const { status, data } = await apiRequest('POST', '/profile/skills', skill, accessToken);

  if (status === 201 && data.success) {
    skillId = data.data.skill.id;
    console.log('✅ Skill created successfully');
    console.log(`   ID: ${skillId}`);
    console.log(`   Name: ${data.data.skill.name}`);
    console.log(`   Proficiency: ${data.data.skill.proficiency}`);
    return true;
  } else {
    console.log('❌ Failed to create skill:', data);
    return false;
  }
}

/**
 * Test 5: Create project
 */
async function testCreateProject() {
  console.log('\n📝 Test 5: Create project');
  const project = {
    title: 'E-commerce Platform',
    description: 'Built a scalable e-commerce platform with microservices architecture',
    technologies: ['Node.js', 'React', 'MongoDB', 'Docker', 'Kubernetes'],
    url: 'https://example.com',
    githubUrl: 'https://github.com/example/ecommerce',
    startDate: '2022-01-01',
    endDate: '2022-12-31',
    highlights: [
      'Handled 10,000+ concurrent users',
      'Reduced page load time by 60%',
    ],
    order: 0,
  };

  const { status, data } = await apiRequest('POST', '/profile/projects', project, accessToken);

  if (status === 201 && data.success) {
    projectId = data.data.project.id;
    console.log('✅ Project created successfully');
    console.log(`   ID: ${projectId}`);
    console.log(`   Title: ${data.data.project.title}`);
    return true;
  } else {
    console.log('❌ Failed to create project:', data);
    return false;
  }
}

/**
 * Test 6: Get complete profile with all data
 */
async function testGetCompleteProfile() {
  console.log('\n📝 Test 6: Get complete profile with all data');
  const { status, data } = await apiRequest('GET', '/profile', null, accessToken);

  if (status === 200 && data.success) {
    console.log('✅ Complete profile fetched successfully');
    console.log(`   Work Experiences: ${data.data.profile.workExperiences.length}`);
    console.log(`   Education: ${data.data.profile.educations.length}`);
    console.log(`   Skills: ${data.data.profile.skills.length}`);
    console.log(`   Projects: ${data.data.profile.projects.length}`);
    return true;
  } else {
    console.log('❌ Failed to fetch complete profile:', data);
    return false;
  }
}

/**
 * Test 7: Update work experience
 */
async function testUpdateWorkExperience() {
  console.log('\n📝 Test 7: Update work experience');
  const updates = {
    position: 'Lead Software Engineer',
    description: 'Led development of cloud-based applications and managed team',
  };

  const { status, data } = await apiRequest('PUT', `/profile/experience/${workExperienceId}`, updates, accessToken);

  if (status === 200 && data.success) {
    console.log('✅ Work experience updated successfully');
    console.log(`   New Position: ${data.data.experience.position}`);
    return true;
  } else {
    console.log('❌ Failed to update work experience:', data);
    return false;
  }
}

/**
 * Test 8: Update skill
 */
async function testUpdateSkill() {
  console.log('\n📝 Test 8: Update skill');
  const updates = {
    yearsOfExperience: 9,
  };

  const { status, data } = await apiRequest('PUT', `/profile/skills/${skillId}`, updates, accessToken);

  if (status === 200 && data.success) {
    console.log('✅ Skill updated successfully');
    console.log(`   Years of Experience: ${data.data.skill.yearsOfExperience}`);
    return true;
  } else {
    console.log('❌ Failed to update skill:', data);
    return false;
  }
}

/**
 * Test 9: Get individual lists
 */
async function testGetIndividualLists() {
  console.log('\n📝 Test 9: Get individual lists');
  
  const endpoints = [
    { name: 'Work Experiences', path: '/profile/experience' },
    { name: 'Education', path: '/profile/education' },
    { name: 'Skills', path: '/profile/skills' },
    { name: 'Projects', path: '/profile/projects' },
  ];

  let allSuccess = true;

  for (const endpoint of endpoints) {
    const { status, data } = await apiRequest('GET', endpoint.path, null, accessToken);
    if (status === 200 && data.success) {
      const key = Object.keys(data.data)[0];
      console.log(`   ✅ ${endpoint.name}: ${data.data[key].length} items`);
    } else {
      console.log(`   ❌ ${endpoint.name}: Failed`);
      allSuccess = false;
    }
  }

  return allSuccess;
}

/**
 * Test 10: Delete items
 */
async function testDeleteItems() {
  console.log('\n📝 Test 10: Delete items');
  
  const deletions = [
    { name: 'Work Experience', path: `/profile/experience/${workExperienceId}` },
    { name: 'Education', path: `/profile/education/${educationId}` },
    { name: 'Skill', path: `/profile/skills/${skillId}` },
    { name: 'Project', path: `/profile/projects/${projectId}` },
  ];

  let allSuccess = true;

  for (const deletion of deletions) {
    const { status, data } = await apiRequest('DELETE', deletion.path, null, accessToken);
    if (status === 200 && data.success) {
      console.log(`   ✅ ${deletion.name} deleted`);
    } else {
      console.log(`   ❌ ${deletion.name} deletion failed:`, data);
      allSuccess = false;
    }
  }

  return allSuccess;
}

/**
 * Test 11: Verify profile is empty again
 */
async function testVerifyEmptyProfile() {
  console.log('\n📝 Test 11: Verify profile is empty again');
  const { status, data } = await apiRequest('GET', '/profile', null, accessToken);

  if (status === 200 && data.success) {
    const isEmpty = 
      data.data.profile.workExperiences.length === 0 &&
      data.data.profile.educations.length === 0 &&
      data.data.profile.skills.length === 0 &&
      data.data.profile.projects.length === 0;

    if (isEmpty) {
      console.log('✅ Profile is empty as expected');
      return true;
    } else {
      console.log('❌ Profile still has data');
      return false;
    }
  } else {
    console.log('❌ Failed to fetch profile:', data);
    return false;
  }
}

/**
 * Test 12: Test validation errors
 */
async function testValidationErrors() {
  console.log('\n📝 Test 12: Test validation errors');
  
  // Test missing required fields
  const { status: status1, data: data1 } = await apiRequest('POST', '/profile/experience', {
    company: 'Test Corp',
    // Missing position, startDate, description
  }, accessToken);

  if (status1 === 400 && data1.error.code === 'VALIDATION_FAILED') {
    console.log('   ✅ Missing fields validation works');
  } else {
    console.log('   ❌ Missing fields validation failed');
    return false;
  }

  // Test invalid date range
  const { status: status2, data: data2 } = await apiRequest('POST', '/profile/experience', {
    company: 'Test Corp',
    position: 'Developer',
    startDate: '2023-01-01',
    endDate: '2022-01-01', // End before start
    description: 'Test',
  }, accessToken);

  if (status2 === 400 && data2.error.code === 'VALIDATION_FAILED') {
    console.log('   ✅ Date range validation works');
  } else {
    console.log('   ❌ Date range validation failed');
    return false;
  }

  // Test invalid skill category
  const { status: status3, data: data3 } = await apiRequest('POST', '/profile/skills', {
    name: 'Test Skill',
    category: 'invalid_category',
    proficiency: 'expert',
  }, accessToken);

  if (status3 === 400 && data3.error.code === 'VALIDATION_FAILED') {
    console.log('   ✅ Skill category validation works');
  } else {
    console.log('   ❌ Skill category validation failed');
    return false;
  }

  return true;
}

/**
 * Run all tests
 */
async function runTests() {
  console.log('🧪 Starting Profile Management API Tests\n');
  console.log('='.repeat(50));

  const tests = [
    testRegister,
    testGetEmptyProfile,
    testCreateWorkExperience,
    testCreateEducation,
    testCreateSkill,
    testCreateProject,
    testGetCompleteProfile,
    testUpdateWorkExperience,
    testUpdateSkill,
    testGetIndividualLists,
    testDeleteItems,
    testVerifyEmptyProfile,
    testValidationErrors,
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      const result = await test();
      if (result) {
        passed++;
      } else {
        failed++;
      }
    } catch (error) {
      console.log(`❌ Test failed with error: ${error.message}`);
      failed++;
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log(`\n📊 Test Results: ${passed} passed, ${failed} failed`);
  
  if (failed === 0) {
    console.log('✅ All tests passed!');
  } else {
    console.log('❌ Some tests failed');
  }
}

// Run tests
runTests().catch(console.error);
