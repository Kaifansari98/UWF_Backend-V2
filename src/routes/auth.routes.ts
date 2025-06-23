import { Router } from 'express';
import { login } from '../controllers/auth.controller'; // named import ✅

const router = Router();

router.post('/login', login); // this should now match correctly

export default router;
