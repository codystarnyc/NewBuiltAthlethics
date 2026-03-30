import { Router } from 'express';
import { optionalAuth } from '../middleware/auth';
import { createMealPlan } from '../controllers/mealplan.controller';

const router = Router();

router.post('/generate', optionalAuth, createMealPlan);

export default router;
