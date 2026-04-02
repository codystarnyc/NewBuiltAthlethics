// --- Auth ---

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  gender?: string;
  weight?: number;
  height?: number;
  dateOfBirth?: string;
  fitnessGoal?: string;
  gymFrequency?: string;
  gymDays?: string[];
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  authToken: string;
  email: string;
  name: string;
  id: string;
}

export interface ResetPasswordRequest {
  email: string;
}

// --- User ---

export interface User {
  id: string;
  email: string;
  name: string;
  gender?: string;
  weight?: number;
  height?: number;
  dateOfBirth?: string;
  gym?: string;
  fitnessGoal?: string;
  gymFrequency?: string;
  gymDays?: string[];
  autoTracking?: boolean;
  isTrainer?: boolean;
  promoCode?: string;
  referralCode?: string;
  gymiles?: number;
  imageUrl?: string;
  isSubscribed?: boolean;
  subscriptionType?: string;
}

export interface UserHealthInfo {
  email: string;
  date: string;
  steps?: number;
  pulse?: number;
  calories?: number;
}

// --- Exercise ---

export interface Exercise {
  id: string;
  name: string;
  categoryId: string;
  categoryName?: string;
  description?: string;
  imageUrl?: string;
  videoUrl?: string;
  isCustom?: boolean;
  status?: string;
}

export interface Category {
  id: string;
  name: string;
  imageUrl?: string;
  cntExercise?: number;
  status?: string;
}

// --- Workout ---

export interface Workout {
  id: string;
  email: string;
  date: string;
  exerciseId: string;
  exerciseName?: string;
  sets?: WorkoutSet[];
  notes?: string;
}

export interface WorkoutSet {
  reps: number;
  weight: number;
  unit?: string;
}

export interface CustomExercise {
  id: string;
  email: string;
  name: string;
  categoryId?: string;
  notes?: string;
}

// --- Food ---

export interface Food {
  id: string;
  name: string;
  brand?: string;
  barcode?: string;
  calories?: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  fiber?: number;
  sugar?: number;
  sodium?: number;
  servingSize?: string;
  servingUnit?: string;
  imageUrl?: string;
  searchData?: string;
}

export interface FoodDiaryEntry {
  id: string;
  email: string;
  date: string;
  mealTime?: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodId?: string;
  foodName: string;
  calories: number;
  protein?: number;
  carbs?: number;
  fat?: number;
  servings?: number;
}

// --- Meal Plan ---

export interface MealPlan {
  id: string;
  email: string;
  startDate: string;
  endDate: string;
  meals: MealPlanDay[];
  preferences?: MealPlanPreferences;
}

export interface MealPlanDay {
  day: number;
  date: string;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snack?: Recipe;
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
}

export interface Recipe {
  id: string;
  name: string;
  imageUrl?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: Ingredient[];
  instructions?: string[];
  prepTime?: number;
  cookTime?: number;
  servings?: number;
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  checked?: boolean;
}

export interface MealPlanPreferences {
  calorieTarget?: number;
  diet?: string;
  allergies?: string[];
  excludedIngredients?: string[];
}

export interface ShoppingListItem {
  id: string;
  ingredientName: string;
  amount: number;
  unit: string;
  recipeId: string;
  recipeName: string;
  checked: boolean;
}

// --- Image Upload & AI Processing ---

export type ImageType = 'food' | 'receipt' | 'body';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface ImageUploadResponse {
  id: string;
  url: string;
  type: ImageType;
  status: ProcessingStatus;
  message: string;
}

export interface ProcessingResult {
  id: string;
  uploadId: string;
  type: ImageType;
  status: ProcessingStatus;
  result: FoodAnalysis | ReceiptAnalysis | BodyAnalysis | null;
  error?: string;
  processingTimeMs?: number;
  createdAt: string;
  completedAt?: string;
}

export interface FoodAnalysis {
  foods: DetectedFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  confidence: number;
  mealInsulinScore?: number;
  pfcOrder?: string[];
}

export interface DetectedFood {
  name: string;
  quantity: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
  sugar?: number;
  confidence: number;
  gi?: number;
  insulinScore?: number;
}

export interface ReceiptAnalysis {
  storeName?: string;
  date?: string;
  items: ReceiptItem[];
  total?: number;
  currency?: string;
}

export interface ReceiptItem {
  name: string;
  quantity: number;
  price: number;
  category?: string;
}

export interface BodyAnalysis {
  estimatedBodyFatPercentage?: number;
  bodyFatRange?: string;
  muscleAssessment?: string;
  posture?: string;
  recommendations: string[];
  disclaimer: string;
}

// --- AI Meal Plan Generation ---

export interface MealPlanGenerateRequest {
  calorieTarget: number;
  proteinTarget?: number;
  carbsTarget?: number;
  fatTarget?: number;
  diet?: string;
  allergies?: string[];
  excludedIngredients?: string[];
  ingredients?: string[];
  daysCount?: number;
  mealsPerDay?: number;
}

export interface GeneratedMealPlan {
  days: GeneratedMealPlanDay[];
  summary: {
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFat: number;
  };
}

export interface GeneratedMealPlanDay {
  day: number;
  meals: GeneratedMeal[];
  totals: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  };
}

export interface GeneratedMeal {
  type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  name: string;
  description?: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  ingredients: { name: string; amount: string }[];
  instructions?: string[];
  prepTimeMinutes?: number;
}

// --- AI Nutrition Search ---

export interface NutritionSearchResult {
  foodId: string;
  label: string;
  nutrients: {
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
    fiber?: number;
  };
  measures: { uri: string; label: string; weight: number }[];
}

// --- Health ---

export interface HealthData {
  email: string;
  date: string;
  steps?: number;
  heartRate?: number;
  calories?: number;
  distance?: number;
  activeMinutes?: number;
}

export interface StepsDayData {
  email: string;
  date: string;
  steps: number;
  source?: string;
}

// --- Product / Rewards ---

export interface Product {
  id: string;
  name: string;
  description?: string;
  imageUrl?: string;
  price?: number;
  gymilesPrice?: number;
  category?: string;
  vendorId?: string;
  rating?: number;
  reviewCount?: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  email: string;
  rating: number;
  comment?: string;
  date: string;
}

// --- Subscription ---

export interface SubscriptionStatus {
  isSubscribed: boolean;
  subscriptionType?: string;
  expirationDate?: string;
}

// --- FuelTrack ---

export interface FuelTrackDay {
  id: string;
  userId: string;
  date: string;
  pfcScore: number;
  postMealWalks: number;
  fastedWalk: boolean;
  insulinScore: number;
  overallScore: number;
}

export interface FuelTrackBreakdown {
  pfcScore: number;
  postMealWalkScore: number;
  fastedWalkScore: number;
  insulinScoreValue: number;
  complianceBonus: number;
  overallScore: number;
}

export interface WalkLogEntry {
  type: 'post_meal' | 'fasted';
  startTime: string;
  durationMin: number;
  steps?: number;
  source: 'manual' | 'apple_health' | 'google_fit';
  mealType?: string;
}

// --- Generic ---

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
