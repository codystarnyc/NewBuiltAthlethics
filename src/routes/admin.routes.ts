import { Router } from 'express';
import multer from 'multer';
import multerS3 from 'multer-s3';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { s3Client } from '../config/s3';
import { env } from '../config/env';
import { authenticate } from '../middleware/auth';
import * as admin from '../controllers/admin.controller';

const router = Router();

function s3Storage(prefix: string) {
  return multerS3({
    s3: s3Client as any,
    bucket: env.aws.s3BucketUploads,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key(_req, file, cb) {
      const ext = path.extname(file.originalname);
      cb(null, `${prefix}/${uuidv4()}${ext}`);
    },
  });
}

const uploadSingle = multer({ storage: s3Storage('admin'), limits: { fileSize: 10 * 1024 * 1024 } }).single('image');
const uploadExerciseFiles = multer({ storage: s3Storage('exercises'), limits: { fileSize: 100 * 1024 * 1024 } }).fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 },
]);

// Auth
router.post('/login', admin.adminLogin);

// Protected routes
router.use(authenticate);

// Dashboard stats
router.get('/stats', admin.getStats);

// Categories
router.get('/categories', admin.listCategories);
router.post('/categories', uploadSingle, admin.createCategory);
router.put('/categories/:id', uploadSingle, admin.updateCategory);
router.delete('/categories/:id', admin.deleteCategory);

// Exercises
router.get('/exercises', admin.listExercises);
router.post('/exercises', uploadExerciseFiles, admin.createExercise);
router.put('/exercises/:id', uploadExerciseFiles, admin.updateExercise);
router.delete('/exercises/:id', admin.deleteExercise);

// Users
router.get('/users', admin.listUsers);

// Foods
router.get('/foods', admin.listFoods);

// Products
router.get('/products', admin.listProducts);
router.post('/products', uploadSingle, admin.createProduct);
router.put('/products/:id', uploadSingle, admin.updateProduct);

export default router;
