/**
 * Test script for content selection algorithm
 * 
 * Prerequisites:
 * 1. Database must be running (docker-compose up -d postgres)
 * 2. Backend server must be running (npm run dev)
 * 
 * Usage: node test-content-selection.js
 */

// Mock data for testing
const mockProfile = {
  user: {
    id: 'user-1',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
  },
  workExperiences: [
    {
      id: 'exp-1',
      company: 'Tech Corp',
      position: 'Senior Software Engineer',
      startDate: new Date('2020-01-01'),
      endDate: null,
      description: 'Led development of cloud-based applications',
      achievements: ['Improved system performance by 40%', 'Mentored 5 junior developers'],
      technologies: ['React', 'Node.js', 'AWS', 'TypeScript'],
    },
    {
      id: 'exp-2',
      company: 'StartupXYZ',
      position: 'Full Stack Developer',
      startDate: new Date('2018-06-01'),
      endDate: new Date('2019-12-31'),
      description: 'Built web applications from scratch',
      achievements: ['Launched 3 major features', 'Reduced load time by 50%'],
      technologies: ['Vue.js', 'Python', 'PostgreSQL'],
    },
  ],
  educations: [
    {
      id: 'edu-1',
      institution: 'University of Technology',
      degree: 'Bachelor of Science',
      fieldOfStudy: 'Computer Science',
      startDate: new Date('2014-09-01'),
      endDate: new Date('2018-05-31'),
      gpa: 3.8,
      achievements: ['Dean\'s List', 'Graduated with Honors'],
    },
  ],
  skills: [
    {
      id: 'skill-1',
      name: 'React',
      category: 'technical',
      proficiency: 'expert',
      yearsOfExperience: 5,
    },
    {
      id: 'skill-2',
      name: 'Node.js',
      category: 'technical',
      proficiency: 'advanced',
      yearsOfExperience: 4,
    },
    {
      id: 'skill-3',
      name: 'TypeScript',
      category: 'technical',
      proficiency: 'advanced',
      yearsOfExperience: 3,
    },
    {
      id: 'skill-4',
      name: 'AWS',
      category: 'technical',
      proficiency: 'intermediate',
      yearsOfExperience: 2,
    },
  ],
  projects: [
    {
      id: 'proj-1',
      title: 'E-commerce Platform',
      description: 'Built a full-stack e-commerce solution',
      technologies: ['React', 'Node.js', 'MongoDB'],
      url: 'https://example.com',
      githubUrl: 'https://github.com/user/project',
      startDate: new Date('2023-01-01'),
      endDate: new Date('2023-06-01'),
      highlights: ['Implemented payment processing', 'Built admin dashboard'],
    },
  ],
};

const mockJobAnalysis = {
  company: 'Tech Giant Inc',
  position: 'Senior Full Stack Engineer',
  rawText: 'Looking for a Senior Full Stack Engineer with React and Node.js experience...',
  requirements: [
    { text: '5+ years of React experience', category: 'required', type: 'skill', importance: 0.9 },
    { text: 'Node.js backend development', category: 'required', type: 'skill', importance: 0.8 },
    { text: 'AWS cloud experience', category: 'preferred', type: 'skill', importance: 0.6 },
  ],
  skills: ['React', 'Node.js', 'TypeScript', 'AWS', 'Docker', 'Kubernetes'],
  keywords: ['full stack', 'microservices', 'cloud', 'agile', 'leadership'],
  experienceLevel: 'senior',
};

// Test the content selection algorithm
async function testContentSelection() {
  console.log('🧪 Testing Content Selection Algorithm');
  console.log('======================================\n');

  try {
    // Import the service (adjust path as needed)
    const { ResumeGenerationService } = await import('./dist/services/resume-generation.service.js');
    const service = new ResumeGenerationService();

    console.log('📊 Input Data:');
    console.log(`   - Work Experiences: ${mockProfile.workExperiences.length}`);
    console.log(`   - Skills: ${mockProfile.skills.length}`);
    console.log(`   - Projects: ${mockProfile.projects.length}`);
    console.log(`   - Job Skills Required: ${mockJobAnalysis.skills.length}`);
    console.log(`   - Job Keywords: ${mockJobAnalysis.keywords.length}\n`);

    console.log('🔄 Running content selection...\n');

    const selectedContent = await service.selectRelevantContent(mockProfile, mockJobAnalysis);

    console.log('✅ Content Selection Results:');
    console.log('======================================\n');

    console.log('👤 Personal Info:');
    console.log(`   - Name: ${selectedContent.personalInfo.name}`);
    console.log(`   - Email: ${selectedContent.personalInfo.email}\n`);

    console.log('💼 Selected Work Experiences: ${selectedContent.experience.length}');
    selectedContent.experience.forEach((exp, index) => {
      console.log(`   ${index + 1}. ${exp.position} at ${exp.company}`);
      console.log(`      Relevance Score: ${exp.relevanceScore}`);
    });
    console.log('');

    console.log('🎓 Selected Education: ${selectedContent.education.length}');
    selectedContent.education.forEach((edu, index) => {
      console.log(`   ${index + 1}. ${edu.degree} in ${edu.fieldOfStudy}`);
      console.log(`      Institution: ${edu.institution}`);
    });
    console.log('');

    console.log('🛠️  Selected Skills: ${selectedContent.skills.length}');
    selectedContent.skills.forEach((skill, index) => {
      console.log(`   ${index + 1}. ${skill.name} (${skill.proficiency})`);
      console.log(`      Relevance Score: ${skill.relevanceScore}`);
    });
    console.log('');

    console.log('🚀 Selected Projects: ${selectedContent.projects.length}');
    selectedContent.projects.forEach((project, index) => {
      console.log(`   ${index + 1}. ${project.title}`);
      console.log(`      Relevance Score: ${project.relevanceScore}`);
    });
    console.log('');

    console.log('======================================');
    console.log('✨ Content selection test completed!\n');

    // Analyze the results
    console.log('📈 Analysis:');
    const avgExpScore = selectedContent.experience.reduce((sum, exp) => sum + exp.relevanceScore, 0) / selectedContent.experience.length;
    const avgSkillScore = selectedContent.skills.reduce((sum, skill) => sum + skill.relevanceScore, 0) / selectedContent.skills.length;
    const avgProjectScore = selectedContent.projects.reduce((sum, proj) => sum + proj.relevanceScore, 0) / selectedContent.projects.length;

    console.log(`   - Average Experience Relevance: ${avgExpScore.toFixed(2)}`);
    console.log(`   - Average Skill Relevance: ${avgSkillScore.toFixed(2)}`);
    console.log(`   - Average Project Relevance: ${avgProjectScore.toFixed(2)}`);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nMake sure:');
    console.error('1. Backend is built: npm run build');
    console.error('2. Database is running: docker-compose up -d postgres');
    console.error('3. Dependencies are installed: npm install\n');
  }
}

// Main execution
(async () => {
  await testContentSelection();
})();
