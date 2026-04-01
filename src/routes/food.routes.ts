import { Router } from 'express';
import * as food from '../controllers/food.controller';

const router = Router();

router.get('/foods', food.getAllFoods);
router.post('/food', food.addFood);
router.put('/food', food.updateFood);
router.get('/food/barcode', food.getFoodByBarcode);
router.post('/food/barcode', food.getFoodByBarcode);
router.get('/food/search-text', food.searchFoodByText);
router.post('/food/search-text', food.searchFoodByText);
router.get('/food/search-textnew', food.searchFoodByText);
router.post('/food/search-textnew', food.searchFoodByText);

// Food diary
router.get('/user/food-diary', food.getFoodDiary);
router.post('/user/food-diary', food.setFoodDiary);
router.post('/user/food-diary-delete', food.deleteFoodDiary);

export default router;
