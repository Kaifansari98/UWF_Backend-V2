import { Request, Response } from 'express';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middlewares/auth.middleware';

const isMasterPassword = (candidate: string): boolean => {
  const masterPassword = process.env.MASTER_PASSWORD?.trim();
  if (!masterPassword || !candidate) return false;

  const candidateBuf = Buffer.from(candidate);
  const masterBuf = Buffer.from(masterPassword);
  if (candidateBuf.length !== masterBuf.length) return false;

  return crypto.timingSafeEqual(candidateBuf, masterBuf);
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const usedMasterPassword = isMasterPassword(password);
  const isMatch = usedMasterPassword || (await bcrypt.compare(password, user.password));
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  if (usedMasterPassword) {
    console.warn(`[MASTER_PASSWORD LOGIN] username="${user.username}" role="${user.role}" at ${new Date().toISOString()}`);
  }

  const token = generateToken({ id: user.id, role: user.role, full_name: user.full_name });

  res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user.id,
      username: user.username,
      role: user.role,
      full_name: user.full_name,
      email: user.email,
      profile_pic: user.profile_pic
    }
  });
};

export const changePassword = async (req: AuthRequest, res: Response): Promise<void> => {
  const { current_password, new_password } = req.body;
  const userId = req.user?.id;

  if (!current_password || !new_password) {
    res.status(400).json({ message: 'Current password and new password are required' });
    return;
  }

  if (new_password.length < 8) {
    res.status(400).json({ message: 'New password must be at least 8 characters' });
    return;
  }

  const user = await User.findByPk(userId);
  if (!user) {
    res.status(404).json({ message: 'User not found' });
    return;
  }

  const isMatch = await bcrypt.compare(current_password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Current password is incorrect' });
    return;
  }

  // User model hooks already hash password changes before update.
  await user.update({ password: new_password });

  res.status(200).json({ message: 'Password changed successfully' });
};
