import type { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt, { type SignOptions } from 'jsonwebtoken';
import { prisma } from '../services/db';
import { env } from '../config/env';
import { success, created } from '../utils/response';
import { AppError } from '../middleware/errorHandler';

const signOpts: SignOptions = { expiresIn: env.jwt.expiresIn as SignOptions['expiresIn'] };

export async function signUp(req: Request, res: Response, next: NextFunction) {
  try {
    const {
      name, email, password, gender, weight, height,
      dateOfBirth, fitnessGoal, gymFrequency, gymDays,
    } = req.body;

    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      throw new AppError(409, 'A user with this email already exists');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        name: name ?? '',
        gender,
        weight,
        height,
        dateOfBirth,
        fitnessGoal,
        gymFrequency,
        gymDays: gymDays ?? [],
      },
    });

    const authToken = jwt.sign(
      { userId: user.id, email: user.email },
      env.jwt.secret,
      signOpts,
    );

    created(res, {
      authToken,
      email: user.email,
      name: user.name,
      id: user.id,
    });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError(400, 'Email and password are required');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(401, 'Invalid email or password');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, 'Invalid email or password');
    }

    const authToken = jwt.sign(
      { userId: user.id, email: user.email },
      env.jwt.secret,
      signOpts,
    );

    success(res, {
      authToken,
      email: user.email,
      name: user.name,
      id: user.id,
    });
  } catch (err) {
    next(err);
  }
}

export async function sendResetPasswordEmail(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError(400, 'Email is required');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Don't reveal if user exists
      success(res, { message: 'If this email is registered, a reset link has been sent' });
      return;
    }

    // In production, integrate an email service (SES / SendGrid)
    // For now, acknowledge the request
    success(res, { message: 'If this email is registered, a reset link has been sent' });
  } catch (err) {
    next(err);
  }
}

export async function deleteAccount(req: Request, res: Response, next: NextFunction) {
  try {
    const { email } = req.body;
    if (!email) {
      throw new AppError(400, 'Email is required');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    await prisma.user.delete({ where: { email } });

    success(res, { message: 'Account deleted successfully' });
  } catch (err) {
    next(err);
  }
}

export async function setPassword(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, newPassword } = req.body;
    if (!email || !password || !newPassword) {
      throw new AppError(400, 'Email, current password, and new password are required');
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError(404, 'User not found');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError(401, 'Current password is incorrect');
    }

    const newHash = await bcrypt.hash(newPassword, 12);
    await prisma.user.update({
      where: { email },
      data: { passwordHash: newHash },
    });

    success(res, { message: 'Password updated' });
  } catch (err) {
    next(err);
  }
}
