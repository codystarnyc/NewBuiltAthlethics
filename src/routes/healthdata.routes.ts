import { Router } from 'express';
import * as hd from '../controllers/healthdata.controller';

const router = Router();

router.post('/health/setHealthData', hd.setHealthData);
router.post('/health/getHealthData', hd.getHealthData);

export default router;
