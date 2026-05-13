import { Router } from 'express';
import {
  createBankInfoLetter,
  searchBankInfoLetters,
  softDeleteBankInfoLetter,
} from '../controllers/bankInfoLetter.controller';
import { authenticateToken } from '../middlewares/auth.middleware';

const router = Router();

router.post('/search', authenticateToken, searchBankInfoLetters);
router.post('/', authenticateToken, createBankInfoLetter);
router.delete('/:id', authenticateToken, softDeleteBankInfoLetter);

export default router;
