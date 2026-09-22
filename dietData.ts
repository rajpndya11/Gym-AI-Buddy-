import { DailyDietPlan, DietaryPreference, BudgetTier, FoodAllergy, UserGoal, Meal, FoodItem, DietFAQ, MealRecipe } from '../types';

export const DIET_FAQS: DietFAQ[] = [
  {
    id: 'faq-1',
    question: 'How do I hit 100g–130g protein on a Vegetarian diet without spending too much?',
    answer: 'Combine budget champions: Soya chunks (52g protein / 100g, costs only ~₹25/$0.30 per 100g), Low-fat Paneer (18g protein / 100g), Greek Yogurt / Hung Curd (10g / 100g), Roasted Chana / Chickpeas (19g / 100g), and Lentils/Dal with rice. 50g soya chunks + 150g paneer + 200g curd hits over 70g high-quality protein for under ₹120 ($1.50).',
    category: 'Protein',
  },
  {
    id: 'faq-2',
    question: 'What is the ideal eating time before my workout?',
    answer: 'Eat a light carb + moderate protein snack 45–60 minutes prior: e.g., 1 medium banana (27g carbs) + 1 tbsp peanut butter or 1 scoop whey / 2 boiled eggs. Avoid heavy fried foods or high fiber right before training to prevent sluggishness.',
    category: 'Timing',
  },
  {
    id: 'faq-3',
    question: 'Why is fiber measure so important for fat loss & muscle building?',
    answer: 'Aim for 28g–38g of dietary fiber daily. Soluble fiber slows gastric emptying, preventing blood sugar crashes and mid-day bingeing, while insoluble fiber optimizes digestion and nutrient absorption of high-protein diets.',
    category: 'Weight Loss',
  },
  {
    id: 'faq-4',
    question: 'How to manage daily food budget if protein supplements are too expensive?',
    answer: 'Whole foods can easily hit your targets: Whole eggs (6g protein, ~₹7/$0.10 each), Soya chunks, seasonal pulses (rajma, chole, moong), and curd are 3x cheaper per gram of protein than imported protein bars or commercial powders.',
    category: 'Budget',
  },
  {
    id: 'faq-5',
    question: 'I have Lactose Intolerance. What are safe protein & calcium swaps?',
    answer: 'Replace milk, whey concentrate, and standard paneer with Tofu (soy), Soy milk / Almond milk, Pea & Brown Rice plant protein isolate, Hard cheeses (naturally trace lactose), or whole eggs and chicken breast.',
    category: 'Allergies',
  },
];

// Helper to filter items if user has allergies
function isSafeFromAllergies(item: FoodItem, allergies: FoodAllergy[]): boolean {
  if (!allergies || allergies.length === 0) return true;
  if (!item.allergens) return true;
  return !item.allergens.some((a) => allergies.includes(a));
}

// Generate tailored meal plan based on user parameters
export function getTailoredDietPlan(
  goal: UserGoal,
  preference: DietaryPreference = 'Non-Veg',
  budgetTier: BudgetTier = 'Moderate',
  allergies: FoodAllergy[] = [],
  bodyWeightKg: number = 70,
  customBudgetAmount?: number
): DailyDietPlan {
  const isVeg = preference === 'Veg' || preference === 'Vegan';
  const isVegan = preference === 'Vegan';
  const currencySymbol = '₹';

  // Target macro calculations based on goal & weight
  let calories = 2200;
  let proteinG = Math.round(bodyWeightKg * 1.8);
  let fiberG = 32;
  let carbsG = 240;
  let fatsG = 65;
  let strategyTitle = 'Balanced Hypertrophy & Strength Fuel';
  let strategySummary = 'Optimized macro ratios for steady energy and progressive overload recovery.';

  if (goal === 'Build Muscle' || goal === 'Get Stronger') {
    calories = Math.round(bodyWeightKg * 34) + 250; // Caloric surplus
    proteinG = Math.round(bodyWeightKg * 2.0);
    fiberG = 35;
    fatsG = Math.round((calories * 0.25) / 9);
    carbsG = Math.round((calories - proteinG * 4 - fatsG * 9) / 4);
    strategyTitle = isVeg ? 'Plant & Dairy Hypertrophy Surplus' : 'Lean Mass Builder & Anabolic Recovery';
    strategySummary = 'Caloric surplus with high leucine-rich protein and complex carbs to fuel heavy lifts.';
  } else if (goal === 'Lose Fat') {
    calories = Math.round(bodyWeightKg * 26); // Caloric deficit
    proteinG = Math.round(bodyWeightKg * 2.2); // Sparing muscle
    fiberG = 38; // Extra satiety
    fatsG = Math.round((calories * 0.25) / 9);
    carbsG = Math.round((calories - proteinG * 4 - fatsG * 9) / 4);
    strategyTitle = isVeg ? 'High-Satiety Plant Deficit Plan' : 'High-Protein Muscle-Preserving Cut';
    strategySummary = 'Targeted caloric deficit pairing high fiber with lean protein to curb cravings and burn fat.';
  } else {
    // General Fitness / Stay Active
    calories = Math.round(bodyWeightKg * 30);
    proteinG = Math.round(bodyWeightKg * 1.6);
    fiberG = 30;
    fatsG = Math.round((calories * 0.28) / 9);
    carbsG = Math.round((calories - proteinG * 4 - fatsG * 9) / 4);
    strategyTitle = 'Vitality & Daily Stamina Framework';
    strategySummary = 'Clean whole foods prioritizing digestive health, hydration, and sustained vitality.';
  }

  // Cost estimate adjusted by custom budget or tier
  const baseDailyCost = isVeg ? 220 : 280;
  let budgetMultiplier = budgetTier === 'Budget' ? 0.7 : budgetTier === 'Premium' ? 1.5 : 1.0;
  let estimatedDailyCost = Math.round(baseDailyCost * budgetMultiplier);

  if (customBudgetAmount && customBudgetAmount > 0) {
    estimatedDailyCost = Math.round(customBudgetAmount);
    budgetMultiplier = customBudgetAmount / baseDailyCost;
  }

  // BUILD THE 5 MEALS
  let meals: Meal[] = [];

  // 1. BREAKFAST (08:30 AM)
  let breakfastFoods: FoodItem[] = [];
  if (isVegan) {
    breakfastFoods = [
      {
        id: 'f-oats',
        name: 'Rolled Oats with Soy Milk',
        quantityGrams: 80,
        portionDesc: '80g dry oats + 200ml fortified soy milk',
        calories: 380,
        proteinGrams: 18,
        carbsGrams: 58,
        fatsGrams: 9,
        fiberGrams: 9,
        isVeg: true,
        allergens: ['Soy'],
        estimatedCost: 35,
      },
      {
        id: 'f-chia',
        name: 'Chia Seeds & Crushed Almonds',
        quantityGrams: 25,
        portionDesc: '15g chia seeds + 10g almonds',
        calories: 135,
        proteinGrams: 5,
        carbsGrams: 7,
        fatsGrams: 10,
        fiberGrams: 6,
        isVeg: true,
        allergens: ['Nuts / Peanuts'],
        estimatedCost: 20,
      },
      {
        id: 'f-banana',
        name: 'Ripe Banana',
        quantityGrams: 110,
        portionDesc: '1 medium whole banana',
        calories: 95,
        proteinGrams: 1,
        carbsGrams: 23,
        fatsGrams: 0.3,
        fiberGrams: 3,
        isVeg: true,
        estimatedCost: 8,
      },
    ];
  } else if (isVeg) {
    breakfastFoods = [
      {
        id: 'f-veg-oats',
        name: 'High-Protein Oats & Greek Yogurt Bowl',
        quantityGrams: 75,
        portionDesc: '75g rolled oats + 150g hung curd / Greek yogurt',
        calories: 410,
        proteinGrams: 23,
        carbsGrams: 55,
        fatsGrams: 9,
        fiberGrams: 8,
        isVeg: true,
        allergens: ['Dairy / Lactose'],
        estimatedCost: 45,
      },
      {
        id: 'f-veg-nuts',
        name: 'Walnuts & Pumpkin Seeds',
        quantityGrams: 20,
        portionDesc: '10g walnuts + 10g pumpkin seeds',
        calories: 125,
        proteinGrams: 5,
        carbsGrams: 3,
        fatsGrams: 11,
        fiberGrams: 2,
        isVeg: true,
        allergens: ['Nuts / Peanuts'],
        estimatedCost: 22,
      },
      {
        id: 'f-veg-fruit',
        name: 'Fresh Apple Slices',
        quantityGrams: 120,
        portionDesc: '1 medium crisp apple with skin',
        calories: 65,
        proteinGrams: 0.5,
        carbsGrams: 17,
        fatsGrams: 0.2,
        fiberGrams: 3.5,
        isVeg: true,
        estimatedCost: 15,
      },
    ];
  } else {
    // Non-Veg Breakfast
    breakfastFoods = [
      {
        id: 'f-eggs',
        name: 'Farm Eggs Scramble (2 Whole + 2 Whites)',
        quantityGrams: 160,
        portionDesc: '2 whole eggs + 2 egg whites with pepper',
        calories: 220,
        proteinGrams: 22,
        carbsGrams: 1.5,
        fatsGrams: 12,
        fiberGrams: 0,
        isVeg: false,
        allergens: ['Eggs'],
        estimatedCost: 32,
      },
      {
        id: 'f-toast',
        name: 'Multigrain / Sourdough Toast',
        quantityGrams: 60,
        portionDesc: '2 toasted whole wheat slices',
        calories: 160,
        proteinGrams: 6,
        carbsGrams: 28,
        fatsGrams: 2,
        fiberGrams: 4.5,
        isVeg: true,
        allergens: ['Gluten'],
        estimatedCost: 12,
      },
      {
        id: 'f-orange',
        name: 'Fresh Orange / Citrus Fruit',
        quantityGrams: 130,
        portionDesc: '1 medium whole peeled orange',
        calories: 62,
        proteinGrams: 1.2,
        carbsGrams: 15,
        fatsGrams: 0.2,
        fiberGrams: 3.2,
        isVeg: true,
        estimatedCost: 12,
      },
    ];
  }

  // 2. MID-MORNING HYDRATION & RECOVERY SNACK (11:30 AM)
  let midMorningFoods: FoodItem[] = [];
  if (isVeg || isVegan) {
    midMorningFoods = [
      {
        id: 'f-sprouts',
        name: 'Steamed Moong Sprouts Salad',
        quantityGrams: 120,
        portionDesc: '120g sprouted moong + lemon + cucumber & tomatoes',
        calories: 145,
        proteinGrams: 11,
        carbsGrams: 24,
        fatsGrams: 0.8,
        fiberGrams: 7,
        isVeg: true,
        estimatedCost: 18,
      },
      {
        id: 'f-roasted-chana',
        name: 'Roasted Bengal Gram (Chana)',
        quantityGrams: 35,
        portionDesc: '35g crunchy roasted chana',
        calories: 130,
        proteinGrams: 7,
        carbsGrams: 20,
        fatsGrams: 2.2,
        fiberGrams: 5,
        isVeg: true,
        estimatedCost: 12,
      },
    ];
  } else {
    midMorningFoods = [
      {
        id: 'f-boiled-eggs',
        name: 'Boiled Egg Whites + Pinch of Salt',
        quantityGrams: 100,
        portionDesc: '3 hard-boiled egg whites',
        calories: 52,
        proteinGrams: 11,
        carbsGrams: 0.8,
        fatsGrams: 0.2,
        fiberGrams: 0,
        isVeg: false,
        allergens: ['Eggs'],
        estimatedCost: 20,
      },
      {
        id: 'f-mid-fruit',
        name: 'Seasonal Guava / Pears',
        quantityGrams: 120,
        portionDesc: '1 medium ripe guava (super fiber source)',
        calories: 80,
        proteinGrams: 2.6,
        carbsGrams: 17,
        fatsGrams: 1,
        fiberGrams: 6.5,
        isVeg: true,
        estimatedCost: 15,
      },
    ];
  }

  // 3. POWER LUNCH (01:45 PM)
  let lunchFoods: FoodItem[] = [];
  if (isVeg || isVegan) {
    lunchFoods = [
      {
        id: 'f-paneer-soya',
        name: isVegan ? 'Sautéed Tofu & Soya Chunks' : 'Low-Fat Grilled Paneer & Soya Medley',
        quantityGrams: 150,
        portionDesc: isVegan ? '100g firm tofu + 50g boiled soya chunks' : '100g low-fat paneer + 50g soya chunks',
        calories: 340,
        proteinGrams: 36,
        carbsGrams: 14,
        fatsGrams: 13,
        fiberGrams: 7,
        isVeg: true,
        allergens: isVegan ? ['Soy'] : ['Dairy / Lactose', 'Soy'],
        estimatedCost: 55,
      },
      {
        id: 'f-brown-rice',
        name: 'Steamed Brown Rice / Quinoa Bowl',
        quantityGrams: 160,
        portionDesc: '160g cooked brown basmati rice',
        calories: 215,
        proteinGrams: 5,
        carbsGrams: 45,
        fatsGrams: 1.8,
        fiberGrams: 4,
        isVeg: true,
        estimatedCost: 15,
      },
      {
        id: 'f-dal',
        name: 'Thick Yellow Dal / Rajma Curry',
        quantityGrams: 180,
        portionDesc: '1 medium bowl simmered lentil stew',
        calories: 170,
        proteinGrams: 10,
        carbsGrams: 28,
        fatsGrams: 2.5,
        fiberGrams: 6,
        isVeg: true,
        estimatedCost: 20,
      },
      {
        id: 'f-greens',
        name: 'Cucumber, Carrot & Green Leaf Salad',
        quantityGrams: 120,
        portionDesc: 'Crunchy raw vegetable bowl',
        calories: 38,
        proteinGrams: 1.2,
        carbsGrams: 8,
        fatsGrams: 0.3,
        fiberGrams: 3.2,
        isVeg: true,
        estimatedCost: 12,
      },
    ];
  } else {
    // Non-Veg Lunch
    lunchFoods = [
      {
        id: 'f-chicken',
        name: 'Spiced Herb-Grilled Chicken Breast',
        quantityGrams: 180,
        portionDesc: '180g lean chicken breast cooked with olive oil spray',
        calories: 295,
        proteinGrams: 54,
        carbsGrams: 0,
        fatsGrams: 7,
        fiberGrams: 0,
        isVeg: false,
        estimatedCost: 80,
      },
      {
        id: 'f-rice-carb',
        name: 'Steamed Basmati Rice / Baked Sweet Potato',
        quantityGrams: 180,
        portionDesc: '180g cooked white/brown rice or roasted sweet potato',
        calories: 235,
        proteinGrams: 5,
        carbsGrams: 51,
        fatsGrams: 1.2,
        fiberGrams: 3.8,
        isVeg: true,
        estimatedCost: 16,
      },
      {
        id: 'f-steamed-broccoli',
        name: 'Steamed Broccoli & French Beans',
        quantityGrams: 140,
        portionDesc: '140g crisp steamed florets with lemon',
        calories: 48,
        proteinGrams: 3.8,
        carbsGrams: 9,
        fatsGrams: 0.5,
        fiberGrams: 4.5,
        isVeg: true,
        estimatedCost: 25,
      },
    ];
  }

  // 4. PRE-WORKOUT FUEL (05:00 PM) - 60 mins before training
  let preWorkoutFoods: FoodItem[] = [
    {
      id: 'f-pre-banana',
      name: 'Energy Banana with Natural Peanut Butter',
      quantityGrams: 130,
      portionDesc: '1 banana + 1 tbsp (15g) 100% natural peanut butter',
      calories: 195,
      proteinGrams: 5,
      carbsGrams: 31,
      fatsGrams: 8,
      fiberGrams: 4,
      isVeg: true,
      allergens: ['Nuts / Peanuts'],
      estimatedCost: 18,
    },
    {
      id: 'f-black-coffee',
      name: 'Espresso / Black Coffee (Pre-Workout Stimulant)',
      quantityGrams: 150,
      portionDesc: '150ml brewed black coffee / green tea (no sugar)',
      calories: 5,
      proteinGrams: 0.2,
      carbsGrams: 0.8,
      fatsGrams: 0,
      fiberGrams: 0,
      isVeg: true,
      estimatedCost: 8,
    },
  ];

  // 5. POST-WORKOUT & DINNER (08:15 PM)
  let dinnerFoods: FoodItem[] = [];
  if (isVeg || isVegan) {
    dinnerFoods = [
      {
        id: 'f-din-chickpeas',
        name: 'Warm Spiced Chickpeas (Chole) & Tofu Stir-Fry',
        quantityGrams: 180,
        portionDesc: '120g chickpeas + 60g pan-seared tofu/paneer',
        calories: 310,
        proteinGrams: 22,
        carbsGrams: 38,
        fatsGrams: 9,
        fiberGrams: 8.5,
        isVeg: true,
        allergens: isVegan ? ['Soy'] : ['Dairy / Lactose', 'Soy'],
        estimatedCost: 45,
      },
      {
        id: 'f-din-roti',
        name: 'Whole Wheat Roti / Sourdough Flatbread',
        quantityGrams: 70,
        portionDesc: '2 medium soft rotis without butter',
        calories: 175,
        proteinGrams: 6,
        carbsGrams: 35,
        fatsGrams: 1.5,
        fiberGrams: 5,
        isVeg: true,
        allergens: ['Gluten'],
        estimatedCost: 10,
      },
      {
        id: 'f-din-curd',
        name: isVegan ? 'Almond / Coconut Yogurt' : 'Homemade Probiotic Curd / Dahi',
        quantityGrams: 120,
        portionDesc: '120g refreshing curd',
        calories: 85,
        proteinGrams: 4.5,
        carbsGrams: 6,
        fatsGrams: 4.5,
        fiberGrams: 0,
        isVeg: true,
        allergens: isVegan ? ['Nuts / Peanuts'] : ['Dairy / Lactose'],
        estimatedCost: 15,
      },
    ];
  } else {
    // Non-Veg Dinner
    dinnerFoods = [
      {
        id: 'f-din-fish-chicken',
        name: 'Pan-Seared White Fish / Shredded Chicken',
        quantityGrams: 160,
        portionDesc: '160g seasonal white fish fillet or chicken thigh/breast',
        calories: 240,
        proteinGrams: 42,
        carbsGrams: 0,
        fatsGrams: 6.5,
        fiberGrams: 0,
        isVeg: false,
        allergens: ['Seafood'],
        estimatedCost: 75,
      },
      {
        id: 'f-din-roti-nv',
        name: 'Warm Multigrain Roti / Steamed Sweet Potato',
        quantityGrams: 70,
        portionDesc: '2 rotis or 140g roasted sweet potato',
        calories: 165,
        proteinGrams: 5.5,
        carbsGrams: 34,
        fatsGrams: 1.2,
        fiberGrams: 4.8,
        isVeg: true,
        allergens: ['Gluten'],
        estimatedCost: 10,
      },
      {
        id: 'f-din-veggies',
        name: 'Sautéed Spinach, Zucchini & Garlic',
        quantityGrams: 130,
        portionDesc: '130g leafy greens cooked in 1 tsp olive oil',
        calories: 68,
        proteinGrams: 3.5,
        carbsGrams: 6,
        fatsGrams: 3.8,
        fiberGrams: 3.6,
        isVeg: true,
        estimatedCost: 18,
      },
    ];
  }

  // Filter food items based on active allergies
  const filterMeal = (items: FoodItem[]): FoodItem[] => {
    return items.filter((item) => isSafeFromAllergies(item, allergies));
  };

  const generateMealRecipe = (
    slot: Meal['slot'],
    safeFoods: FoodItem[]
  ): MealRecipe => {
    const ingredients = safeFoods.map((f) => ({
      item: f.name,
      amount: f.portionDesc,
      grams: f.quantityGrams,
    }));

    switch (slot) {
      case 'breakfast':
        if (isVegan) {
          return {
            title: 'Vegan High-Protein Overnight Oat & Berry Bowl',
            prepTimeMinutes: 5,
            cookTimeMinutes: 3,
            difficulty: 'Quick',
            servings: 1,
            ingredients,
            steps: [
              'Add 80g rolled oats to a breakfast bowl with 200ml fortified warm soy milk.',
              'Stir in 15g chia seeds and allow the mixture to thicken for 3 minutes.',
              'Top with sliced ripe banana and 10g crushed raw almonds for healthy fats.',
              'Serve warm or chilled. Dust with a pinch of cinnamon for blood sugar control.',
            ],
            chefTip: 'Prep this the night before in a sealed mason jar for an effortless 30-second grab-and-go morning.',
          };
        } else if (isVeg) {
          return {
            title: 'High-Protein Oats & Greek Yogurt Power Bowl',
            prepTimeMinutes: 5,
            cookTimeMinutes: 3,
            difficulty: 'Quick',
            servings: 1,
            ingredients,
            steps: [
              'Combine 75g rolled oats with 80ml warm water or light milk, resting 2 minutes until tender.',
              'Gently fold in 150g hung curd / Greek yogurt until thick, creamy, and completely lump-free.',
              'Crown with fresh apple slices, 10g walnuts, and 10g pumpkin seeds for natural crunch and zinc.',
              'Eat within 15 minutes to maximize digestive enzyme activation.',
            ],
            chefTip: 'Using hung curd provides 2x the bioavailable casein protein of standard yogurt without needing expensive powders.',
          };
        } else {
          return {
            title: 'Classic Farm Scramble & Multigrain Toast',
            prepTimeMinutes: 4,
            cookTimeMinutes: 6,
            difficulty: 'Easy',
            servings: 1,
            ingredients,
            steps: [
              'Whisk 2 whole eggs and 2 egg whites in a bowl with a pinch of pink rock salt and coarse black pepper.',
              'Heat a non-stick pan on medium-low with light olive oil or cooking spray.',
              'Pour eggs and sweep gently with a silicone spatula for 2–3 minutes until soft, velvety curds form.',
              'Toast multigrain bread slices until golden brown. Serve hot with a fresh peeled citrus orange.',
            ],
            chefTip: 'Low and gentle heat prevents egg proteins from hardening and drying out, keeping them easily digestible.',
          };
        }

      case 'mid_morning':
        if (isVeg || isVegan) {
          return {
            title: 'Crunchy Sprouted Moong & Roasted Chana Chaat',
            prepTimeMinutes: 5,
            cookTimeMinutes: 3,
            difficulty: 'Quick',
            servings: 1,
            ingredients,
            steps: [
              'Lightly steam 120g sprouted green moong for 3 minutes to preserve active live enzymes.',
              'Transfer to a mixing bowl and toss with 35g roasted chana, finely diced cucumber, and tomatoes.',
              'Squeeze 1/2 fresh lime and season with roasted cumin powder and rock salt.',
              'Toss well and enjoy immediately for a crisp, high-fiber midday bridge.',
            ],
            chefTip: 'Sprouting legumes activates amino acid synthesis and boosts vitamin C levels by up to 40%.',
          };
        } else {
          return {
            title: 'Soft-Boiled Egg Whites & Fresh Guava Plate',
            prepTimeMinutes: 3,
            cookTimeMinutes: 8,
            difficulty: 'Quick',
            servings: 1,
            ingredients,
            steps: [
              'Boil eggs in lightly salted water for 9 minutes, then transfer immediately to ice-cold water.',
              'Peel easily under cold running water and separate the whites.',
              'Season whites with freshly ground black pepper and oregano.',
              'Slice 1 fresh ripe guava (rich in digestive pectin fiber) and serve together.',
            ],
            chefTip: 'Guava delivers nearly 4x more vitamin C than oranges, aiding collagen synthesis and joint recovery.',
          };
        }

      case 'lunch':
        if (isVeg || isVegan) {
          return {
            title: isVegan ? 'Pan-Seared Tofu & Soya Medley with Brown Rice' : 'Grilled Low-Fat Paneer & Soya Medley with Rice & Dal',
            prepTimeMinutes: 10,
            cookTimeMinutes: 15,
            difficulty: 'Moderate',
            servings: 1,
            ingredients,
            steps: [
              'Boil 50g soya chunks in salted boiling water for 5 minutes, rinse, and squeeze out all excess moisture.',
              'Cut 100g low-fat paneer (or firm tofu) into bite-sized cubes.',
              'Heat 1 tsp oil in a pan; sear paneer/tofu and soya with turmeric, crushed garlic, and cumin for 5 minutes.',
              'Warm 180g prepared dal and serve alongside 160g steamed brown rice and a fresh cucumber salad.',
            ],
            chefTip: 'Thoroughly squeezing boiled soya chunks eliminates any raw beany taste and lets them soak up spices like a sponge.',
          };
        } else {
          return {
            title: 'Herb-Spiced Grilled Chicken Breast with Rice & Broccoli',
            prepTimeMinutes: 10,
            cookTimeMinutes: 14,
            difficulty: 'Moderate',
            servings: 1,
            ingredients,
            steps: [
              'Season 180g trimmed chicken breast with lemon juice, minced garlic, dried oregano, paprika, and olive oil.',
              'Preheat a grill pan or skillet over medium-high heat. Cook chicken for 6–7 minutes per side until 74°C internal temp.',
              'Steam 140g fresh broccoli florets for 4 minutes until crisp and vibrant green.',
              'Let chicken rest 3 minutes to seal in juices, slice diagonally, and serve with 180g steamed basmati rice.',
            ],
            chefTip: 'Resting grilled poultry on a warm plate allows internal juices to redistribute, preventing dryness.',
          };
        }

      case 'pre_workout':
        return {
          title: 'Quick Energy Banana & Natural Peanut Butter Fuel',
          prepTimeMinutes: 3,
          cookTimeMinutes: 0,
          difficulty: 'Quick',
          servings: 1,
          ingredients,
          steps: [
            'Slice 1 ripe banana into uniform coin rounds.',
            'Spread 1 tablespoon (15g) 100% natural peanut butter onto whole grain toast or directly onto banana slices.',
            'Brew 150ml of unsweetened black coffee or clean green tea.',
            'Consume 45–60 minutes prior to training for rapid muscle glycogen replenishment and mental alertness.',
          ],
          chefTip: 'Natural caffeine combined with the fast-acting potassium in bananas enhances motor-unit recruitment and eliminates muscle cramps.',
        };

      case 'dinner':
      default:
        if (isVeg || isVegan) {
          return {
            title: 'Warm Spiced Chickpea & Paneer Stir-Fry with Rotis',
            prepTimeMinutes: 8,
            cookTimeMinutes: 12,
            difficulty: 'Moderate',
            servings: 1,
            ingredients,
            steps: [
              'Heat 1 tsp cold-pressed oil in a pan and temper with whole cumin seeds.',
              'Add 120g tender boiled chickpeas and 60g cubed paneer/tofu with ginger-garlic paste and diced tomatoes.',
              'Simmer on medium heat for 6 minutes with coriander powder and garam masala until aromatic.',
              'Warm 2 whole wheat rotis on a tawa and serve with 120g chilled probiotic curd.',
            ],
            chefTip: 'Eating dinner at least 90 minutes before sleeping prevents acid reflux and optimizes nighttime growth hormone secretion.',
          };
        } else {
          return {
            title: 'Pan-Seared White Fish / Shredded Chicken with Sautéed Greens & Roti',
            prepTimeMinutes: 8,
            cookTimeMinutes: 10,
            difficulty: 'Moderate',
            servings: 1,
            ingredients,
            steps: [
              'Pat 160g fish fillet (or chicken) dry. Rub with olive oil, garlic paste, sea salt, and crushed black pepper.',
              'Pan-sear in a skillet over medium-high heat for 3–4 minutes per side until golden and flaky.',
              'In the same skillet, flash-sauté 130g spinach and zucchini with minced garlic for 2 minutes.',
              'Serve hot with 2 soft multigrain rotis or steamed sweet potato.',
            ],
            chefTip: 'White fish and leafy greens are light on the gastrointestinal tract, ensuring sound, uninterrupted sleep.',
          };
        }
    }
  };

  const createMealFromFoods = (
    id: string,
    slot: Meal['slot'],
    title: string,
    time: string,
    timeLabel: string,
    foods: FoodItem[],
    prepTimeMinutes: number,
    eatingTip: string
  ): Meal => {
    const safeFoods = filterMeal(foods);
    const mCalories = safeFoods.reduce((acc, f) => acc + f.calories, 0);
    const mProtein = safeFoods.reduce((acc, f) => acc + f.proteinGrams, 0);
    const mCarbs = safeFoods.reduce((acc, f) => acc + f.carbsGrams, 0);
    const mFats = safeFoods.reduce((acc, f) => acc + f.fatsGrams, 0);
    const mFiber = safeFoods.reduce((acc, f) => acc + f.fiberGrams, 0);
    const mCost = safeFoods.reduce((acc, f) => acc + f.estimatedCost, 0);

    return {
      id,
      slot,
      title,
      time,
      timeLabel,
      foods: safeFoods,
      targetCalories: Math.round(mCalories),
      targetProtein: Math.round(mProtein * 10) / 10,
      targetCarbs: Math.round(mCarbs * 10) / 10,
      targetFats: Math.round(mFats * 10) / 10,
      targetFiber: Math.round(mFiber * 10) / 10,
      prepTimeMinutes,
      eatingTip,
      estimatedCost: Math.round(mCost * budgetMultiplier),
      recipe: generateMealRecipe(slot, safeFoods),
    };
  };

  meals = [
    createMealFromFoods(
      'meal-breakfast',
      'breakfast',
      'Power Breakfast',
      '08:30',
      '8:30 AM',
      breakfastFoods,
      12,
      'Drink 500ml water first thing after waking up. Eat slowly to prime digestion.'
    ),
    createMealFromFoods(
      'meal-midmorning',
      'mid_morning',
      'Mid-Morning Fiber Boost',
      '11:30',
      '11:30 AM',
      midMorningFoods,
      5,
      'Crucial bridge meal to keep amino acids circulating and stop hunger spikes.'
    ),
    createMealFromFoods(
      'meal-lunch',
      'lunch',
      'Anabolic Power Lunch',
      '13:45',
      '1:45 PM',
      lunchFoods,
      20,
      'Chew thoroughly and pair your protein with green vegetables for optimal fiber transit.'
    ),
    createMealFromFoods(
      'meal-preworkout',
      'pre_workout',
      'Pre-Workout Energy Primer',
      '17:00',
      '5:00 PM',
      preWorkoutFoods,
      5,
      'Consume 45–60 minutes before your workout. Gives fast glycogen without heaviness.'
    ),
    createMealFromFoods(
      'meal-dinner',
      'dinner',
      'Overnight Recovery Dinner',
      '20:15',
      '8:15 PM',
      dinnerFoods,
      22,
      'Finish at least 90 minutes before sleep for optimal growth hormone release and deep REM.'
    ),
  ];

  // Recalculate totals from safe meals
  const totalCal = meals.reduce((sum, m) => sum + m.targetCalories, 0);
  const totalProt = meals.reduce((sum, m) => sum + m.targetProtein, 0);
  const totalCarb = meals.reduce((sum, m) => sum + m.targetCarbs, 0);
  const totalFat = meals.reduce((sum, m) => sum + m.targetFats, 0);
  const totalFib = meals.reduce((sum, m) => sum + m.targetFiber, 0);
  const totalSpend = meals.reduce((sum, m) => sum + m.estimatedCost, 0);

  const budgetTips = [
    'Buy staples in bulk: Oats, lentils, rice, and whole spices have 12-month shelf lives and cost 40% less in 5kg bags.',
    'Soya chunks are nature’s budget protein miracle: 52g protein per 100g costing less than ₹25 / $0.35.',
    'Don’t peel edible fruit skins (apples, guavas, pears) – that is where 70% of the gut-friendly dietary fiber lives.',
    'Cook once, eat twice: Batch-prep chicken breast or lentil curry for 2 days to save cooking gas and daily time.',
  ];

  return {
    id: `diet-plan-${goal.toLowerCase().replace(/\s+/g, '-')}-${preference.toLowerCase()}`,
    goal,
    preference,
    budgetTier,
    estimatedDailyCost: totalSpend,
    currencySymbol,
    totalCalories: totalCal,
    targetProteinGrams: Math.round(totalProt),
    targetCarbsGrams: Math.round(totalCarb),
    targetFatsGrams: Math.round(totalFat),
    targetFiberGrams: Math.round(totalFib),
    waterTargetLiters: Math.max(2.8, Math.round(bodyWeightKg * 0.04 * 10) / 10),
    dietStrategyTitle: strategyTitle,
    dietStrategySummary: strategySummary,
    meals,
    budgetTips,
  };
}

// Food swap recommendations for budget or allergy replacements
export const COMMON_FOOD_SWAPS = [
  {
    original: 'Paneer (100g / 18g Protein)',
    substitute: 'Soya Chunks (40g / 21g Protein)',
    benefit: 'Saves 70% cost & removes saturated dairy fat',
    tag: 'Budget Win',
  },
  {
    original: 'Imported Whey Scoop (24g Protein)',
    substitute: '4 Boiled Egg Whites + 1 Egg',
    benefit: 'Fresh whole food protein for 1/3rd the cost',
    tag: 'Pure Whole Food',
  },
  {
    original: 'White Rice (150g)',
    substitute: 'Steamed Sweet Potato / Brown Rice (150g)',
    benefit: '+3.5g more fiber for slower insulin release',
    tag: 'Fiber Upgrade',
  },
  {
    original: 'Peanut Butter (Lactose free, high calorie)',
    substitute: 'Roasted Peanuts / Chana (30g)',
    benefit: 'Same healthy fats & protein without added palm oils or sugars',
    tag: 'Zero Added Sugar',
  },
];
