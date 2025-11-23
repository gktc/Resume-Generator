import { Request, Response } from 'express';
import { authService } from '../services/auth.service';
import { requireFields } from '../utils/validation';
import { asyncHandler } from '../middleware/error.middleware';
import { UserNotFoundError } from '../utils/errors';

export class AuthController {
  /**
   * Register a new user
   * POST /api/auth/register
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName } = req.body;

    // Validate required fields (throws ValidationError if missing)
    requireFields(req.body, ['email', 'password', 'firstName', 'lastName']);

    // Register user (service will throw appropriate errors)
    const result = await authService.register({
      email,
      password,
      firstName,
      lastName,
    });

    res.status(201).json({
      success: true,
      data: result,
    });
  });

  /**
   * Login user
   * POST /api/auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // Validate required fields
    requireFields(req.body, ['email', 'password']);

    // Login user (service will throw appropriate errors)
    const result = await authService.login({ email, password });

    res.status(200).json({
      success: true,
      data: result,
    });
  });

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  refresh = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    requireFields(req.body, ['refreshToken']);

    const tokens = await authService.refreshToken(refreshToken);

    res.status(200).json({
      success: true,
      data: { tokens },
    });
  });

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await authService.logout(refreshToken);
    }

    res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  });

  /**
   * Get current user
   * GET /api/auth/me
   */
  me = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      throw new UserNotFoundError('User not authenticated');
    }

    const user = await authService.getUserById(req.user.userId);

    res.status(200).json({
      success: true,
      data: { user },
    });
  });
}

export const authController = new AuthController();
