import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileTypeFromBuffer } from 'file-type';

// Ensure uploads directory exists
const uploadsDir = path.join(process.cwd(), 'uploads', 'resumes');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (_req, file, cb) => {
    // Generate unique filename: timestamp_randomstring_originalname
    const uniqueSuffix = `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const ext = path.extname(file.originalname);
    const nameWithoutExt = path.basename(file.originalname, ext);
    cb(null, `${nameWithoutExt}_${uniqueSuffix}${ext}`);
  },
});

/**
 * Validate file type using magic numbers (file signature)
 * This prevents users from bypassing extension checks by renaming files
 */
async function validateFileType(buffer: Buffer): Promise<boolean> {
  try {
    const fileType = await fileTypeFromBuffer(buffer);
    
    if (!fileType) {
      return false;
    }

    // Allow PDF and DOCX files based on magic numbers
    const allowedMimeTypes = [
      'application/pdf',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    return allowedMimeTypes.includes(fileType.mime);
  } catch (error) {
    return false;
  }
}

// File filter to validate file types (basic check)
const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    'application/pdf',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  ];

  const allowedExtensions = ['.pdf', '.docx'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        'Invalid file type. Only PDF and DOCX files are allowed.'
      ) as any,
      false
    );
  }
};

// Configure multer
export const uploadResume = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB max file size
  },
});

// Error handler middleware for multer errors
import { Request, Response, NextFunction } from 'express';

export const handleUploadError = (
  err: any,
  _req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({
        success: false,
        error: {
          code: 'FILE_TOO_LARGE',
          message: 'File size exceeds the maximum limit of 10MB',
        },
      });
      return;
    }
    res.status(400).json({
      success: false,
      error: {
        code: 'UPLOAD_ERROR',
        message: err.message,
      },
    });
    return;
  }

  if (err) {
    res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_FILE_TYPE',
        message: err.message || 'Invalid file upload',
      },
    });
    return;
  }

  next();
};

/**
 * Middleware to validate uploaded file using magic numbers
 * This runs after multer has saved the file
 */
export const validateUploadedFile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(400).json({
        success: false,
        error: {
          code: 'NO_FILE_UPLOADED',
          message: 'No file was uploaded',
        },
      });
      return;
    }

    // Read the file buffer
    const fileBuffer = await fs.promises.readFile(req.file.path);

    // Validate file type using magic numbers
    const isValid = await validateFileType(fileBuffer);

    if (!isValid) {
      // Delete the invalid file
      await fs.promises.unlink(req.file.path).catch(() => {});

      res.status(400).json({
        success: false,
        error: {
          code: 'INVALID_FILE_TYPE',
          message: 'File type validation failed. The file may be corrupted or not a valid PDF/DOCX file.',
        },
      });
      return;
    }

    next();
  } catch (error: any) {
    // Clean up file on error
    if (req.file?.path) {
      await fs.promises.unlink(req.file.path).catch(() => {});
    }

    res.status(500).json({
      success: false,
      error: {
        code: 'FILE_VALIDATION_ERROR',
        message: 'Failed to validate uploaded file',
      },
    });
  }
};
