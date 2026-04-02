const UNIFIED_API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000';

export const API_BASE = UNIFIED_API_URL;
export const IMAGE_API_BASE = UNIFIED_API_URL;

export const ENDPOINTS = {
  auth: {
    signUp: '/signUp',
    login: '/login',
    sendResetPasswordEmail: '/user/send-reset-password-email',
    deleteAccount: '/deleteMyAccount',
  },

  user: {
    get: '/user',
    getDetails: '/userDetails',
    getHome: '/userHome',
    getWelcomeData: '/getWelcomeData',
    getHealthInfo: '/userHealthInfo',
    getCalendarDates: '/getCalendarDates',
    setName: '/user/name',
    setGender: '/user/gender',
    setWeight: '/user/weight',
    setHeight: '/user/height',
    setDateOfBirth: '/user/dateOfBirth',
    setGym: '/user/gym',
    setFitnessGoal: '/user/fitness-goal',
    setGymFrequency: '/user/gym-frequency',
    setGymDays: '/user/gym-days',
    setAutoTracking: '/user/autoTracking',
    setAsTrainer: '/user/setAsTrainer',
    setWorkoutConfig: '/user/workout-config',
    setPushToken: '/user/push-notification-token',
    setPushTokenFCM: '/user/push-notification-token-fcm',
    setPassword: '/user/password',
    addStepsDay: '/user/addStepsDay',
    addPulseDay: '/user/addPulseDay',
    setMeditationHistory: '/user/setMeditationHistory',
  },

  exercise: {
    getAllForApp: '/getAllExerciseForApp',
    getByCategory: '/getExercises',
    add: '/addExercise',
    update: '/updateExercise',
    delete: '/deleteExercise',
    getExercise: '/getExercise',
    setViewVideo: '/setViewVideo',
    getInsights: '/getInsights',
  },

  category: {
    getAll: '/getCategories',
    getForApp: '/getCategoriesForApp',
    add: '/addCategory',
    update: '/updateCategory',
    delete: '/deleteCategory',
  },

  food: {
    getAll: '/foods',
    add: '/food',
    update: '/food',
    getByBarcode: '/food/barcode',
    searchByText: '/food/search-text',
    searchByTextNew: '/food/search-textnew',
  },

  foodDiary: {
    get: '/user/food-diary',
    set: '/user/food-diary',
    delete: '/user/food-diary-delete',
  },

  workout: {
    add: '/user/workout',
    setType: '/user/setWorkoutType',
    redeemReward: '/redeem-reward',
  },

  hiit: {
    setRoutineList: '/user/hiit-routine-list',
    setHistory: '/user/hiit-history',
    addToHistory: '/user/addToHiitHistory',
    addReward: '/user/hiit-reward',
  },

  ba: {
    setWorkout: '/ba/setWorkout',
    getWorkout: '/ba/getWorkout',
    addWorkout: '/ba/addWorkout',
    getWorkoutByExerciseId: '/ba/getWorkoutByExerciseId',
    updateWorkout: '/ba/updateWorkout',
    deleteWorkout: '/ba/deleteWorkout',
    addCustomExercise: '/ba/addCustomExercise',
    getCustomExercise: '/ba/getCustomExercise',
    deleteExercise: '/ba/deleteExercise',
    updateCustomExercise: '/ba/updateCustomExercise',
    setMealPlan: '/ba/setMealPlan',
    getMealPlan: '/ba/getMealPlan',
    setIngredients: '/ba/setIngredients',
    getIngredients: '/ba/getIngredients',
    getRecipes: '/ba/getRecipes',
    getShoppingIng: '/ba/getShoppingIng',
    addShoppingIng: '/ba/addShoppingIng',
    isAddedInShoppingList: '/ba/isAddedInShoppingList',
    deleteShoppingRecipe: '/ba/deleteShoppingRecipe',
    updateShoppingIng: '/ba/updateShoppingIng',
    clearMarkedItem: '/ba/clearMarkedItem',
    clearEntireShoppingList: '/ba/clearEntireShopingList',
  },

  health: {
    setData: '/health/setHealthData',
    getData: '/health/getHealthData',
  },

  subscription: {
    addIos: '/addiosSubscription',
    addAndroidToken: '/addAndroidToken',
    isSubscribed: '/isSubscribed',
    isSubscribedBA: '/isSubscribedBA',
    addReceipt: '/addReceipt',
    addReceiptWithOrderId: '/addReceiptWithOrderId',
    addReceiptWithOrderIdBA: '/addReceiptWithOrderIdBA',
  },

  product: {
    getAll: '/products',
    add: '/product',
    update: '/product/update',
    delete: '/product/delete',
    addReview: '/product/review',
  },

  fueltrack: {
    today: '/api/fueltrack/today',
    history: '/api/fueltrack/history',
    walk: '/api/fueltrack/walk',
    syncHealth: '/api/fueltrack/sync-health',
    recalculate: '/api/fueltrack/recalculate',
  },

  imageUpload: {
    upload: '/api/upload',
    uploadVideo: '/api/upload/video',
    results: '/api/upload/results',
    generateMealPlan: '/api/mealplan/generate',
    nutritionSearch: '/api/nutrition/search',
  },

  inApp: {
    getDetails: '/getInAppDetails',
    getDetailsFromEmail: '/getInAppDetailsFromEmail',
  },

  admin: {
    login: '/admin/login',
    fetchAllUsers: '/admin/fetchAllUsers',
  },
} as const;
