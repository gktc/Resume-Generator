import { Request, Response } from 'express';
import { TemplateService } from '../services/template.service';
import path from 'path';
import fs from 'fs';

const templateService = new TemplateService();

export class TemplateController {
  /**
   * GET /api/templates
   * List all active templates with optional category filter
   */
  async listTemplates(req: Request, res: Response) {
    try {
      const { category } = req.query;

      const templates = await templateService.getAllTemplates(
        category as string | undefined
      );

      res.json({
        success: true,
        data: templates,
      });
    } catch (error: any) {
      console.error('Error listing templates:', error);
      res.status(500).json({
        success: false,
        error: {
          code: 'TEMPLATE_LIST_FAILED',
          message: 'Failed to retrieve templates',
          details: error.message,
        },
      });
    }
  }

  /**
   * GET /api/templates/:id
   * Get template details by ID
   */
  async getTemplate(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const template = await templateService.getTemplateById(id);

      res.json({
        success: true,
        data: template,
      });
    } catch (error: any) {
      console.error('Error getting template:', error);
      
      if (error.message === 'Template not found') {
        res.status(404).json({
          success: false,
          error: {
            code: 'TEMPLATE_NOT_FOUND',
            message: 'Template not found',
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'TEMPLATE_GET_FAILED',
          message: 'Failed to retrieve template',
          details: error.message,
        },
      });
    }
  }

  /**
   * GET /api/templates/:id/preview
   * Serve template preview image
   */
  async getTemplatePreview(req: Request, res: Response) {
    try {
      const { id } = req.params;

      const template = await templateService.getTemplateById(id);

      // Extract filename from preview URL
      const previewPath = path.join(
        process.cwd(),
        'public',
        'templates',
        path.basename(template.previewImageUrl)
      );

      // Check if file exists
      if (!fs.existsSync(previewPath)) {
        res.status(404).json({
          success: false,
          error: {
            code: 'PREVIEW_NOT_FOUND',
            message: 'Preview image not found',
          },
        });
        return;
      }

      // Serve the image file
      res.sendFile(previewPath);
    } catch (error: any) {
      console.error('Error getting template preview:', error);
      
      if (error.message === 'Template not found') {
        res.status(404).json({
          success: false,
          error: {
            code: 'TEMPLATE_NOT_FOUND',
            message: 'Template not found',
          },
        });
        return;
      }

      res.status(500).json({
        success: false,
        error: {
          code: 'PREVIEW_GET_FAILED',
          message: 'Failed to retrieve preview image',
          details: error.message,
        },
      });
    }
  }
}
