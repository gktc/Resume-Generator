/**
 * Test script for Template API endpoints
 * 
 * Prerequisites:
 * 1. Database must be running (docker-compose up -d postgres)
 * 2. Templates must be seeded (npm run prisma:seed:templates)
 * 3. Backend server must be running (npm run dev)
 * 
 * Usage: node test-template-endpoints.js
 */

const BASE_URL = 'http://localhost:3000/api';

// Helper function to make HTTP requests
async function request(method, endpoint, body = null, token = null) {
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

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    const data = await response.json();
    return { status: response.status, data };
  } catch (error) {
    console.error('Request failed:', error.message);
    return { status: 0, data: { error: error.message } };
  }
}

// Test functions
async function testListTemplates() {
  console.log('\n📋 Testing: GET /api/templates (List all templates)');
  const result = await request('GET', '/templates');
  
  if (result.status === 200 && result.data.success) {
    console.log('✅ Success! Found', result.data.data.length, 'templates');
    result.data.data.forEach(template => {
      console.log(`   - ${template.name} (${template.category})`);
    });
    return result.data.data[0]?.id; // Return first template ID for next tests
  } else {
    console.log('❌ Failed:', result.data);
    return null;
  }
}

async function testListTemplatesByCategory() {
  console.log('\n📋 Testing: GET /api/templates?category=modern (Filter by category)');
  const result = await request('GET', '/templates?category=modern');
  
  if (result.status === 200 && result.data.success) {
    console.log('✅ Success! Found', result.data.data.length, 'modern templates');
    result.data.data.forEach(template => {
      console.log(`   - ${template.name}`);
    });
  } else {
    console.log('❌ Failed:', result.data);
  }
}

async function testGetTemplate(templateId) {
  if (!templateId) {
    console.log('\n⚠️  Skipping: GET /api/templates/:id (No template ID available)');
    return;
  }

  console.log('\n📄 Testing: GET /api/templates/:id (Get template details)');
  const result = await request('GET', `/templates/${templateId}`);
  
  if (result.status === 200 && result.data.success) {
    console.log('✅ Success! Retrieved template:', result.data.data.name);
    console.log('   - Category:', result.data.data.category);
    console.log('   - Description:', result.data.data.description.substring(0, 50) + '...');
    console.log('   - Variables:', result.data.data.variables.length);
    console.log('   - LaTeX content length:', result.data.data.latexContent.length, 'characters');
  } else {
    console.log('❌ Failed:', result.data);
  }
}

async function testGetTemplatePreview(templateId) {
  if (!templateId) {
    console.log('\n⚠️  Skipping: GET /api/templates/:id/preview (No template ID available)');
    return;
  }

  console.log('\n🖼️  Testing: GET /api/templates/:id/preview (Get preview image)');
  
  try {
    const response = await fetch(`${BASE_URL}/templates/${templateId}/preview`);
    
    if (response.ok) {
      const contentType = response.headers.get('content-type');
      console.log('✅ Success! Preview image retrieved');
      console.log('   - Content-Type:', contentType);
      console.log('   - Note: Current previews are placeholders. Replace with actual PNG images.');
    } else {
      const data = await response.json();
      console.log('❌ Failed:', data);
    }
  } catch (error) {
    console.log('❌ Error:', error.message);
  }
}

async function testGetNonExistentTemplate() {
  console.log('\n🔍 Testing: GET /api/templates/:id (Non-existent template)');
  const fakeId = '00000000-0000-0000-0000-000000000000';
  const result = await request('GET', `/templates/${fakeId}`);
  
  if (result.status === 404 && !result.data.success) {
    console.log('✅ Success! Correctly returned 404 for non-existent template');
    console.log('   - Error code:', result.data.error.code);
  } else {
    console.log('❌ Failed: Expected 404 status');
  }
}

// Run all tests
async function runTests() {
  console.log('🧪 Starting Template API Tests');
  console.log('================================');
  
  try {
    // Test listing templates
    const templateId = await testListTemplates();
    
    // Test filtering by category
    await testListTemplatesByCategory();
    
    // Test getting specific template
    await testGetTemplate(templateId);
    
    // Test getting template preview
    await testGetTemplatePreview(templateId);
    
    // Test error handling
    await testGetNonExistentTemplate();
    
    console.log('\n================================');
    console.log('✨ All tests completed!');
    console.log('\nNote: To fully test the template system:');
    console.log('1. Ensure database is running: docker-compose up -d postgres');
    console.log('2. Seed templates: npm run prisma:seed:templates');
    console.log('3. Replace placeholder preview images with actual PNG files');
    
  } catch (error) {
    console.error('\n❌ Test suite failed:', error);
  }
}

// Check if server is running before starting tests
async function checkServer() {
  try {
    const response = await fetch(`${BASE_URL.replace('/api', '')}/health`);
    if (response.ok) {
      console.log('✅ Server is running\n');
      return true;
    }
  } catch (error) {
    console.error('❌ Server is not running. Please start the backend server first.');
    console.error('   Run: npm run dev\n');
    return false;
  }
}

// Main execution
(async () => {
  const serverRunning = await checkServer();
  if (serverRunning) {
    await runTests();
  }
})();
