import type { NavigatorScreenParams } from '@react-navigation/native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs';

// --- Auth Stack ---
export type AuthStackParamList = {
  Intro: undefined;
  Login: undefined;
  SignUp: undefined;
  ForgotPassword: undefined;
};

// --- Onboarding Stack ---
export type OnboardingStackParamList = {
  SelectGender: undefined;
  SetName: undefined;
  SelectWeight: undefined;
  SelectHeight: undefined;
  SelectDOB: undefined;
  SelectRoutineDays: undefined;
  SelectFitnessGoal: undefined;
  FitCoach: undefined;
  RestrictiveDiet: undefined;
  CreatePlan: undefined;
};

// --- Profile Stack ---
export type ProfileStackParamList = {
  Profile: undefined;
  Settings: undefined;
  BodyMeasurements: undefined;
  FitpalDashboard: undefined;
  AddWeight: undefined;
  WearableList: undefined;
  DeleteAccount: undefined;
};

// --- Exercise Stack ---
export type ExerciseStackParamList = {
  GymDiary: undefined;
  WorkoutLibrary: undefined;
  ExerciseDetails: { exerciseId: string; exerciseName?: string };
  ExerciseCategories: undefined;
  AddCustomExercise: undefined;
  HiitTimer: { routineId?: string };
  AddRoutine: undefined;
  VideoList: { categoryId?: string };
  FodVideoPlayer: { videoId: number; title?: string };
  GymCompletion: undefined;
};

// --- Food Stack ---
export type FoodStackParamList = {
  FoodDiary: undefined;
  FoodList: { mealType?: string };
  BarcodeScanner: undefined;
  FoodDetails: { foodId: string };
  CreateFood: undefined;
  CalorieMama: undefined;
  FuelTrack: undefined;
};

// --- Rewards Stack ---
export type RewardsStackParamList = {
  Rewards: undefined;
  ProductListing: { categoryId?: string };
  ProductDetails: { productId: string };
  Cart: undefined;
  Checkout: undefined;
  Orders: undefined;
};

// --- Referral Stack ---
export type ReferralStackParamList = {
  Referral: undefined;
  MealPlanHome: undefined;
  CreateMealPlan: undefined;
  RecipeDetails: { recipeId: string };
  RecipeList: undefined;
  ShoppingList: undefined;
  MealQuestions: undefined;
};

// --- Main Tabs ---
export type MainTabParamList = {
  ProfileTab: NavigatorScreenParams<ProfileStackParamList>;
  ExerciseTab: NavigatorScreenParams<ExerciseStackParamList>;
  RewardsTab: NavigatorScreenParams<RewardsStackParamList>;
  FoodTab: NavigatorScreenParams<FoodStackParamList>;
  ReferralTab: NavigatorScreenParams<ReferralStackParamList>;
};

// --- Root ---
export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  Onboarding: NavigatorScreenParams<OnboardingStackParamList>;
  Main: NavigatorScreenParams<MainTabParamList>;
};

// --- Screen prop helpers ---
export type AuthScreenProps<T extends keyof AuthStackParamList> =
  NativeStackScreenProps<AuthStackParamList, T>;

export type OnboardingScreenProps<T extends keyof OnboardingStackParamList> =
  NativeStackScreenProps<OnboardingStackParamList, T>;

export type ProfileScreenProps<T extends keyof ProfileStackParamList> =
  NativeStackScreenProps<ProfileStackParamList, T>;

export type ExerciseScreenProps<T extends keyof ExerciseStackParamList> =
  NativeStackScreenProps<ExerciseStackParamList, T>;

export type FoodScreenProps<T extends keyof FoodStackParamList> =
  NativeStackScreenProps<FoodStackParamList, T>;

export type RewardsScreenProps<T extends keyof RewardsStackParamList> =
  NativeStackScreenProps<RewardsStackParamList, T>;

export type ReferralScreenProps<T extends keyof ReferralStackParamList> =
  NativeStackScreenProps<ReferralStackParamList, T>;

export type MainTabScreenProps<T extends keyof MainTabParamList> =
  BottomTabScreenProps<MainTabParamList, T>;
