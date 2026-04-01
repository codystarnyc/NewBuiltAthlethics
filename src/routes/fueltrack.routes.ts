import { Router } from 'express';
import * as fueltrack from '../controllers/fueltrack.controller';

const router = Router();

router.get('/today', fueltrack.getToday);
router.get('/history', fueltrack.getScoreHistory);
router.post('/walk', fueltrack.logWalk);
router.post('/sync-health', fueltrack.syncHealth);
router.get('/recalculate', fueltrack.recalculate);

export default router;
