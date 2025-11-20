import { prisma } from '../lib/prisma';
import { hashPassword, comparePassword, validatePasswordStrength } from '../utils/password';
import { generateTokens, verifyRefreshToken, getTokenExpiration, TokenPair } from '../utils/jwt';
import { requireValidEmail, requireValidPassword, sanitizeString } from '../utils/validation';
import {
  UserExistsError,
  InvalidCredentialsError,
  InvalidTokenError,
  UserNotFoundError,
  DatabaseError,
} from '../utils/errors';
import { logger } from '../utils/logger';

export interface RegisterInput {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
  };
  accessToken: string;
  refreshToken: string;
}

export class AuthService {
  /**
   * Register a new user
   */
  async register(input: RegisterInput): Promise<AuthResponse> {
    const { email, password, firstName, lastName } = input;

    // Validate email and password (throws ValidationError if invalid)
    requireValidEmail(email);
    requireValidPassword(password);

    // Validate password strength
    const passwordValidation = validatePasswordStrength(password);
    if (!passwordValidation.isValid) {
      throw new UserExistsError(passwordValidation.errors.join(', '));
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser) {
      throw new UserExistsError('User with this email already exists');
    }

    // Hash password
    const passwordHash = await hashPassword(password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: email.toLowerCase(),
        passwordHash,
        firstName: sanitizeString(firstName),
        lastName: sanitizeString(lastName),
      },
    });

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token in database
    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: getTokenExpiration(tokens.expiresIn),
      },
    });

    logger.info('User registered', { userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Login user
   */
  async login(input: LoginInput): Promise<AuthResponse> {
    const { email, password } = input;

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      throw new InvalidCredentialsError();
    }

    // Verify password
    const isPasswordValid = await comparePassword(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new InvalidCredentialsError();
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
    });

    // Store refresh token in database
    await prisma.session.create({
      data: {
        userId: user.id,
        token: tokens.refreshToken,
        expiresAt: getTokenExpiration(tokens.expiresIn),
      },
    });

    logger.info('User logged in', { userId: user.id, email: user.email });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      },
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  /**
   * Refresh access token using refresh token
   */
  async refreshToken(refreshToken: string): Promise<TokenPair> {
    // Verify refresh token
    let payload;
    try {
      payload = verifyRefreshToken(refreshToken);
    } catch (error) {
      throw new InvalidTokenError('Invalid or expired refresh token');
    }

    // Check if refresh token exists in database
    const session = await prisma.session.findFirst({
      where: {
        token: refreshToken,
        userId: payload.userId,
        expiresAt: {
          gt: new Date(),
        },
      },
    });

    if (!session) {
      throw new InvalidTokenError('Invalid or expired refresh token');
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: payload.userId,
      email: payload.email,
    });

    // Update session with new refresh token
    await prisma.session.update({
      where: { id: session.id },
      data: {
        token: tokens.refreshToken,
        expiresAt: getTokenExpiration(tokens.expiresIn),
      },
    });

    logger.debug('Token refreshed', { userId: payload.userId });

    return tokens;
  }

  /**
   * Logout user (invalidate refresh token)
   */
  async logout(refreshToken: string): Promise<void> {
    await prisma.session.deleteMany({
      where: { token: refreshToken },
    });
  }

  /**
   * Get user by ID
   */
  async getUserById(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      throw new UserNotFoundError();
    }

    return user;
  }

  /**
   * Clean up expired sessions
   */
  async cleanupExpiredSessions(): Promise<number> {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });

    return result.count;
  }
}

export const authService = new AuthService();
