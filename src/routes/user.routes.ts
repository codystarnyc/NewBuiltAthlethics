import { Router } from 'express';
import * as user from '../controllers/user.controller';

const router = Router();

router.get('/user', user.getUser);
router.get('/userDetails', user.getUserDetails);
router.get('/userHome', user.getUserHome);
router.get('/getWelcomeData', user.getWelcomeData);
router.get('/userHealthInfo', user.getUserHealthInfo);
router.get('/getCalendarDates', user.getCalendarDates);

router.put('/user/name', user.setName);
router.put('/user/gender', user.setGender);
router.put('/user/weight', user.setWeight);
router.put('/user/height', user.setHeight);
router.put('/user/dateOfBirth', user.setDateOfBirth);
router.put('/user/gym', user.setGym);
router.put('/user/fitness-goal', user.setFitnessGoal);
router.put('/user/gym-frequency', user.setGymFrequency);
router.put('/user/gym-days', user.setGymDays);
router.put('/user/autoTracking', user.setAutoTracking);
router.put('/user/setAsTrainer', user.setAsTrainer);
router.put('/user/workout-config', user.setWorkoutConfig);
router.put('/user/push-notification-token', user.setPushToken);
router.put('/user/push-notification-token-fcm', user.setPushTokenFCM);
router.put('/user/addStepsDay', user.addStepsDay);
router.put('/user/addPulseDay', user.addPulseDay);

export default router;
