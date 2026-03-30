import { Router } from 'express';
import { uploadImage, uploadVideo } from '../middleware/upload';
import { handleImageUpload, handleVideoUpload } from '../controllers/upload.controller';

const router = Router();

router.post('/uploadTempImage', uploadImage, handleImageUpload);
router.post('/uploadExerciseVideo', uploadVideo, handleVideoUpload);

export default router;
