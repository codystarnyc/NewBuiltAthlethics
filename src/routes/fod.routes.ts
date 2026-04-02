import { Router } from 'express';
import { authenticate } from '../middleware/auth';
import * as fod from '../controllers/fod.controller';

const router = Router();

router.use(authenticate);

router.get('/session', fod.getFodSession);
router.get('/classes', fod.listFodClasses);
router.post('/playback/start', fod.startFodPlayback);
router.post('/playback/progress', fod.fodPlayProgress);
router.post('/playback/end', fod.fodEndEvent);

export default router;
