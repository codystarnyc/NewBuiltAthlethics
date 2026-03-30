import { Router } from 'express';
import uploadRoutes from './upload.routes';
import mealplanRoutes from './mealplan.routes';
import nutritionRoutes from './nutrition.routes';
import legacyRoutes from './legacy.routes';
import { healthCheck } from '../controllers/health.controller';

const router = Router();

router.get('/health', healthCheck);
router.use('/upload', uploadRoutes);
router.use('/mealplan', mealplanRoutes);
router.use('/nutrition', nutritionRoutes);

// Legacy routes for backward compatibility with old mobile app
router.use('/apiv2/order', legacyRoutes);

export default router;
