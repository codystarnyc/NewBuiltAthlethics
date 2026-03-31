import { Router } from 'express';
import * as ex from '../controllers/exercise.controller';

const router = Router();

// Categories
router.get('/getCategories', ex.getCategories);
router.get('/getCategoriesForApp', ex.getCategoriesForApp);
router.post('/addCategory', ex.addCategory);
router.post('/updateCategory', ex.updateCategory);
router.post('/deleteCategory', ex.deleteCategory);

// Exercises
router.get('/getAllExerciseForApp', ex.getAllExercisesForApp);
router.post('/getExercises', ex.getExercisesByCategory);
router.post('/addExercise', ex.addExercise);
router.post('/updateExercise', ex.updateExercise);
router.post('/deleteExercise', ex.deleteExercise);
router.get('/getExercise', ex.getExercise);
router.post('/setViewVideo', ex.setViewVideo);
router.get('/getInsights', ex.getInsights);

// BA Workouts
router.post('/ba/addWorkout', ex.addWorkout);
router.post('/ba/getWorkout', ex.getWorkout);
router.post('/ba/getWorkoutByExerciseId', ex.getWorkoutByExerciseId);
router.post('/ba/updateWorkout', ex.updateWorkout);
router.post('/ba/deleteWorkout', ex.deleteWorkout);
router.post('/ba/setWorkout', ex.addWorkout);

// Custom Exercises
router.post('/ba/addCustomExercise', ex.addCustomExercise);
router.post('/ba/getCustomExercise', ex.getCustomExercises);
router.post('/ba/deleteExercise', ex.deleteCustomExercise);
router.post('/ba/updateCustomExercise', ex.updateCustomExercise);

export default router;
