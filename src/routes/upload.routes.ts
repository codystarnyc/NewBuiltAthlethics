import { Router } from 'express';
import { uploadImage, uploadVideo } from '../middleware/upload';
import { authenticate, optionalAuth } from '../middleware/auth';
import {
  handleImageUpload,
  handleVideoUpload,
  getProcessingResult,
  listResults,
} from '../controllers/upload.controller';

const router = Router();

router.post('/', optionalAuth, uploadImage, handleImageUpload);
router.post('/video', optionalAuth, uploadVideo, handleVideoUpload);
router.get('/results', optionalAuth, listResults);
router.get('/results/:id', optionalAuth, getProcessingResult);

export default router;
