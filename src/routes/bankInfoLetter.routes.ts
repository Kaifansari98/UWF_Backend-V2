import { Router } from 'express';
import {
  createBankInfoLetter,
  searchBankInfoLetters,
} from '../controllers/bankInfoLetter.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/search', authenticateToken, searchBankInfoLetters);
router.post('/', authenticateToken, createBankInfoLetter);

export default router;
