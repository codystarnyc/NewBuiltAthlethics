import { Router } from 'express';
import * as auth from '../controllers/auth.controller';

const router = Router();

router.post('/signUp', auth.signUp);
router.post('/login', auth.login);
router.post('/user/send-reset-password-email', auth.sendResetPasswordEmail);
router.post('/deleteMyAccount', auth.deleteAccount);
router.post('/user/password', auth.setPassword);

export default router;
