import { Router } from 'express';
import uploadRoutes from './upload.routes';
import mealplanRoutes from './mealplan.routes';
import nutritionRoutes from './nutrition.routes';
import legacyRoutes from './legacy.routes';
import authRoutes from './auth.routes';
import userRoutes from './user.routes';
import exerciseRoutes from './exercise.routes';
import foodRoutes from './food.routes';
import baRoutes from './ba.routes';
import healthdataRoutes from './healthdata.routes';
import productRoutes from './product.routes';
import { healthCheck } from '../controllers/health.controller';

const router = Router();

// Health check
router.get('/health', healthCheck);

// Image upload + AI processing (prefixed /api in server.ts)
router.use('/upload', uploadRoutes);
router.use('/mealplan', mealplanRoutes);
router.use('/nutrition', nutritionRoutes);

// Core backend routes (match mobile app endpoints exactly)
router.use(authRoutes);
router.use(userRoutes);
router.use(exerciseRoutes);
router.use(foodRoutes);
router.use(baRoutes);
router.use(healthdataRoutes);
router.use(productRoutes);

// Legacy routes for backward compatibility
router.use('/apiv2/order', legacyRoutes);

export default router;
