import { Router } from 'express';
import { TemplateController } from '../controllers/template.controller';

const router = Router();
const templateController = new TemplateController();

// GET /api/templates - List all active templates
router.get('/', (req, res) => templateController.listTemplates(req, res));

// GET /api/templates/:id - Get template by ID
router.get('/:id', (req, res) => templateController.getTemplate(req, res));

// GET /api/templates/:id/preview - Get template preview image
router.get('/:id/preview', (req, res) => templateController.getTemplatePreview(req, res));

export default router;
