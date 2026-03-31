import { Router } from 'express';
import * as ba from '../controllers/ba.controller';

const router = Router();

// Meal plan
router.post('/ba/setMealPlan', ba.setMealPlan);
router.post('/ba/getMealPlan', ba.getMealPlan);
router.post('/ba/setIngredients', ba.setIngredients);
router.post('/ba/getIngredients', ba.getIngredients);
router.post('/ba/getRecipes', ba.getRecipes);

// Shopping list
router.post('/ba/getShoppingIng', ba.getShoppingList);
router.post('/ba/addShoppingIng', ba.addShoppingItem);
router.post('/ba/isAddedInShoppingList', ba.isAddedInShoppingList);
router.post('/ba/deleteShoppingRecipe', ba.deleteShoppingRecipe);
router.post('/ba/updateShoppingIng', ba.updateShoppingItem);
router.post('/ba/clearMarkedItem', ba.clearMarkedItems);
router.post('/ba/clearEntireShopingList', ba.clearEntireShoppingList);

export default router;
