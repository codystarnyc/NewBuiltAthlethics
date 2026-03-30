import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
import { searchNutrition } from '../controllers/nutrition.controller';

const router = Router();

router.get('/search', optionalAuth, searchNutrition);

export default router;
