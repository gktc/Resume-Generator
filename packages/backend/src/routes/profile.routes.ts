import { Router } from 'express';
import { profileController } from '../controllers/profile.controller';
import { authenticate } from '../middleware/auth.middleware';

const router = Router();

// All profile routes require authentication
router.use(authenticate);

/**
 * @route   GET /api/profile
 * @desc    Get complete user profile with all related data
 * @access  Private
 */
router.get('/', (req, res) => profileController.getProfile(req, res));

/**
 * @route   GET /api/profile/basic-info
 * @desc    Get basic user information
 * @access  Private
 */
router.get('/basic-info', (req, res) => profileController.getBasicInfo(req, res));

/**
 * @route   PUT /api/profile/basic-info
 * @desc    Update basic user information
 * @access  Private
 */
router.put('/basic-info', (req, res) => profileController.updateBasicInfo(req, res));

// ============================================
// Work Experience Routes
// ============================================

/**
 * @route   GET /api/profile/experience
 * @desc    Get all work experiences for user
 * @access  Private
 */
router.get('/experience', (req, res) => profileController.getWorkExperiences(req, res));

/**
 * @route   POST /api/profile/experience
 * @desc    Create new work experience
 * @access  Private
 */
router.post('/experience', (req, res) => profileController.createWorkExperience(req, res));

/**
 * @route   PUT /api/profile/experience/:id
 * @desc    Update work experience
 * @access  Private
 */
router.put('/experience/:id', (req, res) => profileController.updateWorkExperience(req, res));

/**
 * @route   DELETE /api/profile/experience/:id
 * @desc    Delete work experience
 * @access  Private
 */
router.delete('/experience/:id', (req, res) => profileController.deleteWorkExperience(req, res));

// ============================================
// Education Routes
// ============================================

/**
 * @route   GET /api/profile/education
 * @desc    Get all education entries for user
 * @access  Private
 */
router.get('/education', (req, res) => profileController.getEducations(req, res));

/**
 * @route   POST /api/profile/education
 * @desc    Create new education entry
 * @access  Private
 */
router.post('/education', (req, res) => profileController.createEducation(req, res));

/**
 * @route   PUT /api/profile/education/:id
 * @desc    Update education entry
 * @access  Private
 */
router.put('/education/:id', (req, res) => profileController.updateEducation(req, res));

/**
 * @route   DELETE /api/profile/education/:id
 * @desc    Delete education entry
 * @access  Private
 */
router.delete('/education/:id', (req, res) => profileController.deleteEducation(req, res));

// ============================================
// Skills Routes
// ============================================

/**
 * @route   GET /api/profile/skills
 * @desc    Get all skills for user
 * @access  Private
 */
router.get('/skills', (req, res) => profileController.getSkills(req, res));

/**
 * @route   POST /api/profile/skills
 * @desc    Create new skill
 * @access  Private
 */
router.post('/skills', (req, res) => profileController.createSkill(req, res));

/**
 * @route   PUT /api/profile/skills/:id
 * @desc    Update skill
 * @access  Private
 */
router.put('/skills/:id', (req, res) => profileController.updateSkill(req, res));

/**
 * @route   DELETE /api/profile/skills/:id
 * @desc    Delete skill
 * @access  Private
 */
router.delete('/skills/:id', (req, res) => profileController.deleteSkill(req, res));

// ============================================
// Projects Routes
// ============================================

/**
 * @route   GET /api/profile/projects
 * @desc    Get all projects for user
 * @access  Private
 */
router.get('/projects', (req, res) => profileController.getProjects(req, res));

/**
 * @route   POST /api/profile/projects
 * @desc    Create new project
 * @access  Private
 */
router.post('/projects', (req, res) => profileController.createProject(req, res));

/**
 * @route   PUT /api/profile/projects/:id
 * @desc    Update project
 * @access  Private
 */
router.put('/projects/:id', (req, res) => profileController.updateProject(req, res));

/**
 * @route   DELETE /api/profile/projects/:id
 * @desc    Delete project
 * @access  Private
 */
router.delete('/projects/:id', (req, res) => profileController.deleteProject(req, res));

export default router;
