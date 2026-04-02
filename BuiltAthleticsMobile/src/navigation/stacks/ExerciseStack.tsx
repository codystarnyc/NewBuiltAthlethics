import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { ExerciseStackParamList } from '../types';
import { APP_COLORS } from '../../config/constants';

import GymDiaryScreen from '../../screens/exercise/GymDiaryScreen';
import WorkoutLibraryScreen from '../../screens/exercise/WorkoutLibraryScreen';
import ExerciseDetailsScreen from '../../screens/exercise/ExerciseDetailsScreen';
import ExerciseCategoriesScreen from '../../screens/exercise/ExerciseCategoriesScreen';
import AddCustomExerciseScreen from '../../screens/exercise/AddCustomExerciseScreen';
import HiitTimerScreen from '../../screens/exercise/HiitTimerScreen';
import AddRoutineScreen from '../../screens/exercise/AddRoutineScreen';
import VideoListScreen from '../../screens/exercise/VideoListScreen';
import FodVideoPlayerScreen from '../../screens/exercise/FodVideoPlayerScreen';
import GymCompletionScreen from '../../screens/exercise/GymCompletionScreen';

const Stack = createNativeStackNavigator<ExerciseStackParamList>();

export default function ExerciseStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerTintColor: APP_COLORS.primary,
        headerBackButtonDisplayMode: 'minimal',
      }}
    >
      <Stack.Screen name="GymDiary" component={GymDiaryScreen} options={{ headerShown: false }} />
      <Stack.Screen name="WorkoutLibrary" component={WorkoutLibraryScreen} options={{ title: 'Workout Library' }} />
      <Stack.Screen name="ExerciseDetails" component={ExerciseDetailsScreen} options={{ title: 'Exercise' }} />
      <Stack.Screen name="ExerciseCategories" component={ExerciseCategoriesScreen} options={{ title: 'Categories' }} />
      <Stack.Screen name="AddCustomExercise" component={AddCustomExerciseScreen} options={{ title: 'New Exercise' }} />
      <Stack.Screen name="HiitTimer" component={HiitTimerScreen} options={{ title: 'HIIT Timer', headerShown: false }} />
      <Stack.Screen name="AddRoutine" component={AddRoutineScreen} options={{ title: 'New Routine' }} />
      <Stack.Screen name="VideoList" component={VideoListScreen} options={{ title: 'On-demand classes' }} />
      <Stack.Screen name="FodVideoPlayer" component={FodVideoPlayerScreen} options={{ title: 'Class' }} />
      <Stack.Screen name="GymCompletion" component={GymCompletionScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  );
}
