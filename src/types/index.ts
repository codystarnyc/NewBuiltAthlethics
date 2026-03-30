export type ImageType = 'food' | 'receipt' | 'body';
export type ProcessingStatus = 'pending' | 'processing' | 'completed' | 'failed';

export interface UploadResult {
  id: string;
  url: string;
  key: string;
  type: ImageType;
  status: ProcessingStatus;
  userId?: string;
  createdAt: Date;
}

export interface FoodAnalysis {
  foods: DetectedFood[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  confidence: number;
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

export interface ProcessingResult {
  id: string;
  uploadId: string;
  type: ImageType;
  status: ProcessingStatus;
  result: FoodAnalysis | ReceiptAnalysis | BodyAnalysis | null;
  error?: string;
  processingTimeMs?: number;
  createdAt: Date;
  completedAt?: Date;
}

export interface MealPlanRequest {
  userId: string;
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
  days: MealPlanDay[];
  summary: {
    avgCalories: number;
    avgProtein: number;
    avgCarbs: number;
    avgFat: number;
  };
}

export interface MealPlanDay {
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

export interface NutritionLookup {
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

export interface EdamamResponse {
  parsed: { food: { foodId: string; label: string; nutrients: Record<string, number> } }[];
  hints: { food: { foodId: string; label: string; nutrients: Record<string, number> } }[];
}
