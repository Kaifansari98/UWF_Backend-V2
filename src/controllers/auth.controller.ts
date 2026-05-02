import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import User from '../models/user.model';
import { generateToken } from '../utils/jwt';
import { AuthRequest } from '../middlewares/auth.middleware';

export const login = async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  const user = await User.findOne({ where: { username } });
  if (!user) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401).json({ message: 'Invalid credentials' });
    return;
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

  const hashed = await bcrypt.hash(new_password, 10);
  await user.update({ password: hashed });

  res.status(200).json({ message: 'Password changed successfully' });
};
