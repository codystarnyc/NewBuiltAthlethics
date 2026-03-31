import { Router } from 'express';
import * as prod from '../controllers/product.controller';

const router = Router();

router.get('/products', prod.getAllProducts);
router.post('/product', prod.addProduct);
router.post('/product/update', prod.updateProduct);
router.post('/product/delete', prod.deleteProduct);
router.post('/product/review', prod.addReview);

export default router;
