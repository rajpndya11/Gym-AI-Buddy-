import React, { useState, useEffect, useMemo } from 'react';
import {
  Utensils,
  Clock,
  Flame,
  CheckCircle2,
  AlertCircle,
  Leaf,
  Drumstick,
  Droplets,
  Sparkles,
  ChevronDown,
  ChevronUp,
  Bell,
  BellRing,
  HelpCircle,
  RefreshCw,
  Sliders,
  DollarSign,
  ShieldAlert,
  ArrowRight,
  Plus,
  Egg,
  Info,
} from 'lucide-react';
import {
  UserProfile,
  UserGoal,
  DietaryPreference,
  BudgetTier,
  FoodAllergy,
  DailyDietPlan,
  Meal,
  FoodItem,
} from '../types';
import { getTailoredDietPlan, DIET_FAQS, COMMON_FOOD_SWAPS } from '../data/dietData';

interface DietScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: Partial<UserProfile>) => void;
  onOpenBuddyChat?: () => void;
}

export const DietScreen: React.FC<DietScreenProps> = ({
  user,
  onUpdateUser,
  onOpenBuddyChat,
}) => {
  // Dietary state initialized from user or defaults
  const [preference, setPreference] = useState<DietaryPreference>(
    user.dietaryPreference || 'Veg'
  );
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(
    user.dailyBudgetTier || 'Moderate'
  );
  const [allergies, setAllergies] = useState<FoodAllergy[]>(
    user.foodAllergies || []
  );
  const [currentGoal, setCurrentGoal] = useState<UserGoal>(user.goal);

  // Eaten meals tracker (persisted in localStorage for today)
  const [eatenMealIds, setEatenMealIds] = useState<string[]>(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`gymbuddy_eaten_meals_${today}`);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Water intake tracker (liters logged today)
  const [waterDrankMl, setWaterDrankMl] = useState<number>(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      const saved = localStorage.getItem(`gymbuddy_water_${today}`);
      return saved ? JSON.parse(saved) : 1250;
    } catch {
      return 1250;
    }
  });

  // Reminders toggle
  const [remindersEnabled, setRemindersEnabled] = useState<boolean>(() => {
    return localStorage.getItem('gymbuddy_diet_reminders') === 'true';
  });

  // Expanded meal cards
  const [expandedMealId, setExpandedMealId] = useState<string | null>('meal-breakfast');

  // Customizer / Questionnaire Modal state
  const [isQuestionnaireOpen, setIsQuestionnaireOpen] = useState<boolean>(false);

  // Custom question ask state
  const [userCustomQuestion, setUserCustomQuestion] = useState<string>('');
  const [customQuestionAnswer, setCustomQuestionAnswer] = useState<string | null>(null);

  // Current time for countdown calculations
  const [nowTime, setNowTime] = useState<Date>(new Date());

  // Tick clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setNowTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Sync eaten meals to localStorage
  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(`gymbuddy_eaten_meals_${today}`, JSON.stringify(eatenMealIds));
    } catch {
      // ignore
    }
  }, [eatenMealIds]);

  // Sync water to localStorage
  useEffect(() => {
    try {
      const today = new Date().toISOString().slice(0, 10);
      localStorage.setItem(`gymbuddy_water_${today}`, JSON.stringify(waterDrankMl));
    } catch {
      // ignore
    }
  }, [waterDrankMl]);

  // Sync preferences to user profile
  const handlePreferenceChange = (newPref: DietaryPreference) => {
    setPreference(newPref);
    onUpdateUser({ dietaryPreference: newPref });
  };

  const handleBudgetChange = (newBudget: BudgetTier) => {
    setBudgetTier(newBudget);
    onUpdateUser({ dailyBudgetTier: newBudget });
  };

  const handleToggleAllergy = (allergy: FoodAllergy) => {
    const updated = allergies.includes(allergy)
      ? allergies.filter((a) => a !== allergy)
      : [...allergies, allergy];
    setAllergies(updated);
    onUpdateUser({ foodAllergies: updated });
  };

  // Generate current plan based on selected state
  const dietPlan: DailyDietPlan = useMemo(() => {
    return getTailoredDietPlan(
      currentGoal,
      preference,
      budgetTier,
      allergies,
      user.weight || 70
    );
  }, [currentGoal, preference, budgetTier, allergies, user.weight]);

  // Calculate eaten macros
  const eatenMacros = useMemo(() => {
    let calories = 0;
    let protein = 0;
    let carbs = 0;
    let fats = 0;
    let fiber = 0;
    let spent = 0;

    dietPlan.meals.forEach((meal) => {
      if (eatenMealIds.includes(meal.id)) {
        calories += meal.targetCalories;
        protein += meal.targetProtein;
        carbs += meal.targetCarbs;
        fats += meal.targetFats;
        fiber += meal.targetFiber;
        spent += meal.estimatedCost;
      }
    });

    return {
      calories: Math.round(calories),
      protein: Math.round(protein),
      carbs: Math.round(carbs),
      fats: Math.round(fats),
      fiber: Math.round(fiber * 10) / 10,
      spent: Math.round(spent),
    };
  }, [dietPlan, eatenMealIds]);

  // Calculate Next Meal & Remainder Eating Time
  const nextMealInfo = useMemo(() => {
    const currentHours = nowTime.getHours();
    const currentMinutes = nowTime.getMinutes();
    const currentSeconds = nowTime.getSeconds();
    const currentTotalSec = currentHours * 3600 + currentMinutes * 60 + currentSeconds;

    // Find first meal whose scheduled time is ahead of current time and not yet eaten
    for (const meal of dietPlan.meals) {
      const [mH, mM] = meal.time.split(':').map(Number);
      const mealTotalSec = mH * 3600 + mM * 60;

      if (mealTotalSec > currentTotalSec && !eatenMealIds.includes(meal.id)) {
        const diffSec = mealTotalSec - currentTotalSec;
        const diffH = Math.floor(diffSec / 3600);
        const diffM = Math.floor((diffSec % 3600) / 60);
        const diffS = diffSec % 60;

        return {
          meal,
          isDueNow: false,
          hours: diffH,
          minutes: diffM,
          seconds: diffS,
          countdownText: `${diffH > 0 ? `${diffH}h ` : ''}${diffM}m ${diffS}s`,
          statusText: `Eat in ${diffH > 0 ? `${diffH}h ` : ''}${diffM}m`,
        };
      }
    }

    // Check if any meal is currently pending (even if slightly past time)
    const pendingMeal = dietPlan.meals.find((m) => !eatenMealIds.includes(m.id));
    if (pendingMeal) {
      return {
        meal: pendingMeal,
        isDueNow: true,
        hours: 0,
        minutes: 0,
        seconds: 0,
        countdownText: 'Due Now',
        statusText: `Ready to eat (${pendingMeal.timeLabel})`,
      };
    }

    // All meals eaten for the day
    return {
      meal: null,
      isDueNow: false,
      hours: 0,
      minutes: 0,
      seconds: 0,
      countdownText: 'Completed',
      statusText: 'All daily meals logged! Recovery underway.',
    };
  }, [dietPlan.meals, eatenMealIds, nowTime]);

  const toggleMealEaten = (mealId: string) => {
    setEatenMealIds((prev) =>
      prev.includes(mealId) ? prev.filter((id) => id !== mealId) : [...prev, mealId]
    );
  };

  const handleAddWater = (amountMl: number) => {
    setWaterDrankMl((prev) => Math.max(0, prev + amountMl));
  };

  const toggleReminders = () => {
    const nextVal = !remindersEnabled;
    setRemindersEnabled(nextVal);
    localStorage.setItem('gymbuddy_diet_reminders', String(nextVal));
  };

  const handleAskCustomQuestion = () => {
    if (!userCustomQuestion.trim()) return;

    const qLower = userCustomQuestion.toLowerCase();
    let answer =
      'For your goal of ' +
      currentGoal +
      ', consistency in total daily calories and hitting your ' +
      dietPlan.targetProteinGrams +
      'g protein target is 80% of the battle. Keep hydration above 3L and ensure at least 30g dietary fiber from whole vegetables and oats to optimize metabolic absorption.';

    if (qLower.includes('protein') || qLower.includes('egg') || qLower.includes('soya')) {
      answer =
        'High-protein champion foods on a budget: Soya chunks contain 52g protein per 100g, whole eggs provide 6g each, and low-fat paneer or tofu give 18–20g per 100g. Aim for 25–35g protein distributed across each of your 4–5 daily meals.';
    } else if (qLower.includes('fiber') || qLower.includes('digestion') || qLower.includes('carb')) {
      answer =
        'Your daily fiber target is ' +
        dietPlan.targetFiberGrams +
        'g. Good sources: Rolled oats (9g/100g), Guava/Apple with skin (4–6g), Sprouted moong (7g/100g), and Steamed broccoli. Fiber prevents insulin spikes and keeps you feeling full on fat loss phases.';
    } else if (qLower.includes('budget') || qLower.includes('money') || qLower.includes('cost') || qLower.includes('rupee') || qLower.includes('cheap')) {
      answer =
        'Your current estimated daily spend is ' +
        dietPlan.currencySymbol +
        dietPlan.estimatedDailyCost +
        '. To save maximum money, buy oats, brown rice, and lentils in 5kg bags, and use soya chunks, seasonal eggs, and homemade hung curd as your primary protein staples.';
    } else if (qLower.includes('timing') || qLower.includes('before workout') || qLower.includes('after workout')) {
      answer =
        'Eat your Pre-Workout Fuel 45–60 minutes before training (fast carbs like banana + light protein). Have your post-workout dinner or protein within 60–90 minutes following your session to maximize muscle protein synthesis.';
    } else if (qLower.includes('allergy') || qLower.includes('lactose') || qLower.includes('gluten')) {
      answer =
        'If lactose or gluten causes bloating or distress, toggle the allergy chips above! The diet generator automatically excludes dairy and wheat, substituting safe alternatives like tofu, eggs, brown rice, and almond/soy milks.';
    }

    setCustomQuestionAnswer(answer);
  };

  const ALLERGY_OPTIONS: FoodAllergy[] = [
    'Dairy / Lactose',
    'Gluten',
    'Nuts / Peanuts',
    'Soy',
    'Eggs',
    'Seafood',
  ];

  const GOAL_OPTIONS: UserGoal[] = [
    'Build Muscle',
    'Lose Fat',
    'Get Stronger',
    'Improve Fitness',
  ];

  return (
    <div className="pb-28 pt-4 px-4 max-w-lg mx-auto" id="diet-screen-root">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-[#C7FF3D]/10 text-[#C7FF3D]">
              <Utensils className="w-5 h-5" />
            </span>
            <h1 className="text-2xl font-black tracking-tight text-[#F5F5F5]">
              Diet & Nutrition
            </h1>
          </div>
          <p className="text-xs text-[#8A8A8A] mt-0.5">
            Calibrated for <span className="text-[#C7FF3D] font-bold">{currentGoal}</span> · Gram-accurate macros
          </p>
        </div>

        {/* Reminders & Customize action buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleReminders}
            title={remindersEnabled ? 'Eating Reminders Active' : 'Enable Eating Reminders'}
            className={`p-2.5 rounded-xl border transition-all flex items-center justify-center ${
              remindersEnabled
                ? 'bg-[#C7FF3D]/15 border-[#C7FF3D]/40 text-[#C7FF3D]'
                : 'bg-[#171717] border-[#2A2A2A] text-[#8A8A8A] hover:text-[#F5F5F5]'
            }`}
            id="diet-reminder-toggle-btn"
          >
            {remindersEnabled ? <BellRing className="w-4 h-4 animate-pulse" /> : <Bell className="w-4 h-4" />}
          </button>

          <button
            onClick={() => setIsQuestionnaireOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[#171717] border border-[#2A2A2A] hover:border-[#C7FF3D]/50 text-xs font-semibold text-[#F5F5F5] transition-colors"
            id="diet-customize-btn"
          >
            <Sliders className="w-3.5 h-3.5 text-[#C7FF3D]" />
            <span>Customize</span>
          </button>
        </div>
      </div>

      {/* QUICK PREFERENCE PILLS: Veg / Non-Veg / Vegan / Eggitarian & Budget Tier */}
      <div className="bg-[#141414] border border-[#242424] rounded-2xl p-3 mb-4 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8A8A]">
            Diet Type
          </span>
          <div className="flex items-center gap-1">
            {(['Veg', 'Non-Veg', 'Vegan', 'Eggitarian'] as DietaryPreference[]).map((pref) => (
              <button
                key={pref}
                onClick={() => handlePreferenceChange(pref)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  preference === pref
                    ? 'bg-[#C7FF3D] text-black shadow-sm'
                    : 'bg-[#1C1C1C] text-[#8A8A8A] hover:text-[#F5F5F5] hover:bg-[#252525]'
                }`}
              >
                {pref === 'Veg' || pref === 'Vegan' ? (
                  <Leaf className="w-3 h-3" />
                ) : pref === 'Eggitarian' ? (
                  <Egg className="w-3 h-3" />
                ) : (
                  <Drumstick className="w-3 h-3" />
                )}
                <span>{pref}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1 border-t border-[#202020]">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8A8A] flex items-center gap-1">
            <DollarSign className="w-3 h-3 text-[#C7FF3D]" />
            <span>Daily Budget</span>
          </span>
          <div className="flex items-center gap-1">
            {(['Budget', 'Moderate', 'Premium'] as BudgetTier[]).map((tier) => (
              <button
                key={tier}
                onClick={() => handleBudgetChange(tier)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                  budgetTier === tier
                    ? 'bg-[#222] border border-[#C7FF3D] text-[#C7FF3D]'
                    : 'bg-[#1C1C1C] text-[#8A8A8A] hover:text-[#F5F5F5]'
                }`}
              >
                {tier === 'Budget' ? '₹ Budget' : tier === 'Moderate' ? '₹₹ Balanced' : '₹₹₹ Premium'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* REMAINDER EATING TIME / NEXT MEAL COUNTDOWN WIDGET */}
      <div
        className="bg-gradient-to-br from-[#1A1A1A] to-[#121212] border border-[#2B2B2B] rounded-3xl p-5 mb-4 shadow-xl relative overflow-hidden"
        id="next-meal-countdown-widget"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-[#C7FF3D]/10 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C7FF3D] animate-ping" />
            <span className="text-xs font-extrabold uppercase tracking-wider text-[#C7FF3D]">
              Next Eating Time
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-[#8A8A8A] bg-[#111] px-2.5 py-1 rounded-full border border-[#2A2A2A]">
            <Clock className="w-3.5 h-3.5 text-[#C7FF3D]" />
            <span className="font-mono font-bold text-[#F5F5F5]">
              {nextMealInfo.countdownText}
            </span>
          </div>
        </div>

        {nextMealInfo.meal ? (
          <div>
            <div className="flex items-baseline justify-between mt-1">
              <h2 className="text-xl font-black text-[#F5F5F5] tracking-tight">
                {nextMealInfo.meal.title}
              </h2>
              <span className="text-sm font-bold text-[#C7FF3D]">
                {nextMealInfo.meal.timeLabel}
              </span>
            </div>

            <p className="text-xs text-[#8A8A8A] mt-1 line-clamp-1">
              {nextMealInfo.meal.foods.map((f) => f.name).join(' · ')}
            </p>

            {/* Quick Macro Pills for Next Meal */}
            <div className="grid grid-cols-4 gap-2 my-3">
              <div className="bg-[#111] p-2 rounded-xl border border-[#222] text-center">
                <span className="text-[10px] text-[#8A8A8A] block uppercase">Calories</span>
                <span className="text-xs font-black text-[#F5F5F5]">
                  {nextMealInfo.meal.targetCalories} kcal
                </span>
              </div>
              <div className="bg-[#111] p-2 rounded-xl border border-[#222] text-center">
                <span className="text-[10px] text-[#8A8A8A] block uppercase">Protein GM</span>
                <span className="text-xs font-black text-[#C7FF3D]">
                  {nextMealInfo.meal.targetProtein}g
                </span>
              </div>
              <div className="bg-[#111] p-2 rounded-xl border border-[#222] text-center">
                <span className="text-[10px] text-[#8A8A8A] block uppercase">Carbs GM</span>
                <span className="text-xs font-black text-[#38BDF8]">
                  {nextMealInfo.meal.targetCarbs}g
                </span>
              </div>
              <div className="bg-[#111] p-2 rounded-xl border border-[#222] text-center">
                <span className="text-[10px] text-[#8A8A8A] block uppercase">Fiber GM</span>
                <span className="text-xs font-black text-[#A78BFA]">
                  {nextMealInfo.meal.targetFiber}g
                </span>
              </div>
            </div>

            {/* Action button */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => toggleMealEaten(nextMealInfo.meal!.id)}
                className="flex-1 py-2.5 px-4 rounded-xl bg-[#C7FF3D] hover:bg-[#bbf335] active:scale-[0.99] text-black font-extrabold text-xs flex items-center justify-center gap-2 transition-all"
                id="next-meal-eaten-cta"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Mark as Eaten ({nextMealInfo.meal.targetCalories} kcal)</span>
              </button>

              <button
                onClick={() => setExpandedMealId(nextMealInfo.meal!.id)}
                className="py-2.5 px-3 rounded-xl bg-[#222] hover:bg-[#282828] text-xs font-semibold text-[#F5F5F5] transition-colors"
                id="view-next-meal-recipe-btn"
              >
                View Recipe
              </button>
            </div>
          </div>
        ) : (
          <div className="py-2 text-center">
            <p className="text-sm font-bold text-[#C7FF3D]">
              All daily meals finished!
            </p>
            <p className="text-xs text-[#8A8A8A] mt-0.5">
              Great job hitting your nutrition targets today. Hydrate and get 7–8 hours of rest.
            </p>
          </div>
        )}
      </div>

      {/* DAILY MACRO & NUTRIENT BALANCE TRACKER (CALORIES, PROTEIN, CARBS, FATS, FIBER) */}
      <div className="bg-[#171717] border border-[#262626] rounded-3xl p-5 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-[#8A8A8A]">
              Daily Nutrients & Macros
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-2xl font-black text-[#F5F5F5]">
                {eatenMacros.calories}
              </span>
              <span className="text-xs text-[#8A8A8A]">
                / {dietPlan.totalCalories} kcal target
              </span>
            </div>
          </div>

          {/* Daily Spend Tracker */}
          <div className="text-right bg-[#111] px-3 py-1.5 rounded-2xl border border-[#222]">
            <span className="text-[10px] text-[#8A8A8A] block uppercase">Est. Daily Spend</span>
            <span className="text-xs font-bold text-[#C7FF3D]">
              {dietPlan.currencySymbol}{eatenMacros.spent} / {dietPlan.currencySymbol}{dietPlan.estimatedDailyCost}
            </span>
          </div>
        </div>

        {/* Calories main progress bar */}
        <div className="w-full h-2 bg-[#202020] rounded-full overflow-hidden mb-5">
          <div
            className="h-full bg-[#C7FF3D] transition-all duration-300 rounded-full"
            style={{
              width: `${Math.min(100, (eatenMacros.calories / Math.max(1, dietPlan.totalCalories)) * 100)}%`,
            }}
          />
        </div>

        {/* 4 MACRO METRICS: Protein (g), Carbs (g), Fats (g), Fiber (g) */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {/* Protein */}
          <div className="bg-[#121212] p-3 rounded-2xl border border-[#222]">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-[#8A8A8A] font-semibold">Protein</span>
              <span className="font-mono font-bold text-[#C7FF3D]">
                {eatenMacros.protein}g / {dietPlan.targetProteinGrams}g
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#C7FF3D] transition-all"
                style={{
                  width: `${Math.min(100, (eatenMacros.protein / Math.max(1, dietPlan.targetProteinGrams)) * 100)}%`,
                }}
              />
            </div>
            <span className="text-[9px] text-[#666] block mt-1">
              {Math.max(0, dietPlan.targetProteinGrams - eatenMacros.protein)}g remaining
            </span>
          </div>

          {/* Carbs */}
          <div className="bg-[#121212] p-3 rounded-2xl border border-[#222]">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-[#8A8A8A] font-semibold">Carbs</span>
              <span className="font-mono font-bold text-[#38BDF8]">
                {eatenMacros.carbs}g / {dietPlan.targetCarbsGrams}g
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#38BDF8] transition-all"
                style={{
                  width: `${Math.min(100, (eatenMacros.carbs / Math.max(1, dietPlan.targetCarbsGrams)) * 100)}%`,
                }}
              />
            </div>
            <span className="text-[9px] text-[#666] block mt-1">
              Fuel for lifts
            </span>
          </div>

          {/* Fiber - Explicitly highlighted */}
          <div className="bg-[#121212] p-3 rounded-2xl border border-[#222]">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-[#8A8A8A] font-semibold">Fiber</span>
              <span className="font-mono font-bold text-[#A78BFA]">
                {eatenMacros.fiber}g / {dietPlan.targetFiberGrams}g
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#A78BFA] transition-all"
                style={{
                  width: `${Math.min(100, (eatenMacros.fiber / Math.max(1, dietPlan.targetFiberGrams)) * 100)}%`,
                }}
              />
            </div>
            <span className="text-[9px] text-[#666] block mt-1">
              Gut & Satiety
            </span>
          </div>

          {/* Fats */}
          <div className="bg-[#121212] p-3 rounded-2xl border border-[#222]">
            <div className="flex items-center justify-between text-[11px] mb-1">
              <span className="text-[#8A8A8A] font-semibold">Fats</span>
              <span className="font-mono font-bold text-[#F59E0B]">
                {eatenMacros.fats}g / {dietPlan.targetFatsGrams}g
              </span>
            </div>
            <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#F59E0B] transition-all"
                style={{
                  width: `${Math.min(100, (eatenMacros.fats / Math.max(1, dietPlan.targetFatsGrams)) * 100)}%`,
                }}
              />
            </div>
            <span className="text-[9px] text-[#666] block mt-1">
              Hormone support
            </span>
          </div>
        </div>

        {/* WATER INTAKE TRACKER */}
        <div className="mt-4 pt-3 border-t border-[#222] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-[#38BDF8]/15 border border-[#38BDF8]/30 flex items-center justify-center text-[#38BDF8]">
              <Droplets className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#F5F5F5] block">
                Hydration: {(waterDrankMl / 1000).toFixed(1)}L / {dietPlan.waterTargetLiters}L
              </span>
              <span className="text-[10px] text-[#8A8A8A]">
                Drink water between meals for optimal nutrient delivery
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={() => handleAddWater(250)}
              className="px-2.5 py-1.5 rounded-lg bg-[#202020] hover:bg-[#282828] text-xs font-bold text-[#38BDF8] border border-[#333] transition-colors"
            >
              +250ml
            </button>
            <button
              onClick={() => handleAddWater(500)}
              className="px-2.5 py-1.5 rounded-lg bg-[#202020] hover:bg-[#282828] text-xs font-bold text-[#38BDF8] border border-[#333] transition-colors"
            >
              +500ml
            </button>
          </div>
        </div>
      </div>

      {/* ALLERGY EXCLUSION CHIPS */}
      <div className="bg-[#141414] border border-[#242424] rounded-2xl p-3.5 mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-[#F59E0B]" />
            <span className="text-xs font-bold text-[#F5F5F5]">
              Food Allergies & Intolerances
            </span>
          </div>
          <span className="text-[10px] text-[#8A8A8A]">Tap to exclude</span>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {ALLERGY_OPTIONS.map((allergy) => {
            const isSelected = allergies.includes(allergy);
            return (
              <button
                key={allergy}
                onClick={() => handleToggleAllergy(allergy)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  isSelected
                    ? 'bg-[#EF4444]/20 border border-[#EF4444] text-[#FCA5A5]'
                    : 'bg-[#1C1C1C] border border-[#2A2A2A] text-[#8A8A8A] hover:text-[#F5F5F5]'
                }`}
              >
                {isSelected ? '✕ ' : '+ '}
                {allergy}
              </button>
            );
          })}
        </div>

        {allergies.length > 0 && (
          <p className="text-[10px] text-[#FCA5A5] mt-2 flex items-center gap-1">
            <AlertCircle className="w-3 h-3 shrink-0" />
            <span>
              All recipes auto-filtered to remove {allergies.join(', ')}.
            </span>
          </p>
        )}
      </div>

      {/* COMPLETE MEAL SCHEDULE WITH INGREDIENTS & GRAM WEIGHTS */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-black text-[#F5F5F5] tracking-tight">
            Daily Eating Schedule ({dietPlan.meals.length} Meals)
          </h3>
          <span className="text-xs text-[#8A8A8A]">
            {eatenMealIds.length} of {dietPlan.meals.length} logged
          </span>
        </div>

        <div className="space-y-3">
          {dietPlan.meals.map((meal) => {
            const isEaten = eatenMealIds.includes(meal.id);
            const isExpanded = expandedMealId === meal.id;

            return (
              <div
                key={meal.id}
                className={`bg-[#171717] border rounded-2xl transition-all overflow-hidden ${
                  isEaten
                    ? 'border-[#C7FF3D]/40 bg-[#151a10]/40'
                    : 'border-[#262626] hover:border-[#333]'
                }`}
                id={`meal-card-${meal.id}`}
              >
                {/* Meal Header */}
                <div
                  className="p-4 flex items-center justify-between cursor-pointer"
                  onClick={() => setExpandedMealId(isExpanded ? null : meal.id)}
                >
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleMealEaten(meal.id);
                      }}
                      className={`w-6 h-6 rounded-lg flex items-center justify-center transition-all ${
                        isEaten
                          ? 'bg-[#C7FF3D] text-black shadow-sm'
                          : 'border-2 border-[#444] hover:border-[#C7FF3D]'
                      }`}
                      title={isEaten ? 'Marked as Eaten' : 'Click to log as eaten'}
                    >
                      {isEaten && <CheckCircle2 className="w-4 h-4" />}
                    </button>

                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-extrabold text-[#F5F5F5]">
                          {meal.title}
                        </span>
                        <span className="text-[11px] font-mono text-[#C7FF3D] font-bold px-1.5 py-0.5 rounded bg-[#111] border border-[#222]">
                          {meal.timeLabel}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-[#8A8A8A] mt-0.5">
                        <span>{meal.targetCalories} kcal</span>
                        <span>·</span>
                        <span className="text-[#C7FF3D] font-medium">{meal.targetProtein}g Protein</span>
                        <span>·</span>
                        <span className="text-[#A78BFA]">{meal.targetFiber}g Fiber</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-[#8A8A8A]">
                      {dietPlan.currencySymbol}{meal.estimatedCost}
                    </span>
                    <button className="text-[#8A8A8A] hover:text-[#F5F5F5]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Expanded Meal Content */}
                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 border-t border-[#222] bg-[#131313]/60">
                    <div className="text-xs font-bold text-[#8A8A8A] mb-2 uppercase tracking-wider">
                      Food Items & Gram Weights (GM)
                    </div>

                    <div className="space-y-2 mb-3">
                      {meal.foods.map((food) => (
                        <div
                          key={food.id}
                          className="flex items-center justify-between p-2.5 rounded-xl bg-[#191919] border border-[#262626]"
                        >
                          <div>
                            <div className="flex items-center gap-1.5">
                              {food.isVeg ? (
                                <Leaf className="w-3 h-3 text-[#22C55E]" />
                              ) : (
                                <Drumstick className="w-3 h-3 text-[#EF4444]" />
                              )}
                              <span className="text-xs font-bold text-[#F5F5F5]">
                                {food.name}
                              </span>
                            </div>
                            <span className="text-[11px] text-[#8A8A8A] block mt-0.5">
                              {food.portionDesc} · <span className="text-[#C7FF3D] font-mono font-semibold">{food.quantityGrams} GM</span>
                            </span>
                          </div>

                          <div className="text-right">
                            <span className="text-xs font-black text-[#F5F5F5] block">
                              {food.calories} kcal
                            </span>
                            <span className="text-[10px] text-[#C7FF3D] font-mono">
                              {food.proteinGrams}g P | {food.fiberGrams}g Fib
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Eating Tip Callout */}
                    <div className="p-2.5 rounded-xl bg-[#171717] border border-[#2A2A2A] flex items-start gap-2 text-xs text-[#8A8A8A]">
                      <Info className="w-4 h-4 text-[#C7FF3D] shrink-0 mt-0.5" />
                      <span>{meal.eatingTip}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* BUDGET TIPS & COMMON FOOD SWAPS */}
      <div className="bg-[#171717] border border-[#262626] rounded-3xl p-5 mb-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <DollarSign className="w-4 h-4 text-[#C7FF3D]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F5F5]">
            Budget Protein & Fiber Swaps
          </h3>
        </div>

        <div className="space-y-2.5">
          {COMMON_FOOD_SWAPS.map((swap, idx) => (
            <div
              key={idx}
              className="p-3 rounded-2xl bg-[#121212] border border-[#242424] flex items-start justify-between gap-2"
            >
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-bold text-[#8A8A8A] line-through">
                    {swap.original}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[#C7FF3D]" />
                  <span className="text-xs font-bold text-[#C7FF3D]">
                    {swap.substitute}
                  </span>
                </div>
                <p className="text-[11px] text-[#A0A0A0] mt-0.5">{swap.benefit}</p>
              </div>

              <span className="text-[9px] font-bold uppercase px-2 py-0.5 rounded bg-[#C7FF3D]/10 text-[#C7FF3D] shrink-0">
                {swap.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ASK QUESTIONS / DIET FAQS SECTION */}
      <div className="bg-[#171717] border border-[#262626] rounded-3xl p-5 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4 text-[#A78BFA]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-[#F5F5F5]">
              Ask Diet Questions
            </h3>
          </div>
          {onOpenBuddyChat && (
            <button
              onClick={onOpenBuddyChat}
              className="text-xs font-semibold text-[#C7FF3D] hover:underline flex items-center gap-1"
            >
              <Sparkles className="w-3 h-3" />
              <span>Ask AI Buddy →</span>
            </button>
          )}
        </div>

        {/* Interactive Question Input */}
        <div className="mb-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={userCustomQuestion}
              onChange={(e) => setUserCustomQuestion(e.target.value)}
              placeholder="e.g. How to hit 120g protein on a ₹200 budget?"
              className="flex-1 bg-[#121212] border border-[#2C2C2C] focus:border-[#C7FF3D] text-xs text-[#F5F5F5] rounded-xl px-3 py-2.5 outline-none transition-colors"
              onKeyDown={(e) => e.key === 'Enter' && handleAskCustomQuestion()}
            />
            <button
              onClick={handleAskCustomQuestion}
              className="px-3.5 py-2.5 rounded-xl bg-[#C7FF3D] hover:bg-[#bbf335] text-black font-extrabold text-xs transition-colors shrink-0"
            >
              Ask
            </button>
          </div>

          {customQuestionAnswer && (
            <div className="mt-2.5 p-3 rounded-xl bg-[#141a0d] border border-[#C7FF3D]/30 text-xs text-[#E5E5E5] leading-relaxed">
              <span className="font-bold text-[#C7FF3D] block mb-1">Coach Answer:</span>
              {customQuestionAnswer}
            </div>
          )}
        </div>

        {/* Expandable FAQs */}
        <div className="space-y-2">
          {DIET_FAQS.map((faq) => (
            <details
              key={faq.id}
              className="group bg-[#121212] border border-[#222] rounded-xl overflow-hidden text-xs"
            >
              <summary className="p-3 font-semibold text-[#F5F5F5] cursor-pointer flex items-center justify-between list-none">
                <span>{faq.question}</span>
                <ChevronDown className="w-3.5 h-3.5 text-[#8A8A8A] group-open:rotate-180 transition-transform shrink-0 ml-2" />
              </summary>
              <div className="px-3 pb-3 pt-1 text-[#8A8A8A] leading-relaxed border-t border-[#1C1C1C]">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>

      {/* CUSTOMIZE QUESTIONNAIRE MODAL */}
      {isQuestionnaireOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#171717] border border-[#2C2C2C] rounded-3xl p-6 max-w-md w-full shadow-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-black text-[#F5F5F5]">
                Customize Diet Blueprint
              </h3>
              <button
                onClick={() => setIsQuestionnaireOpen(false)}
                className="text-xs font-bold text-[#8A8A8A] hover:text-[#F5F5F5] p-1"
              >
                ✕ Close
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Question 1: Goal */}
              <div>
                <label className="block font-bold text-[#8A8A8A] mb-1.5 uppercase tracking-wider text-[10px]">
                  1. Primary Fitness Goal
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {GOAL_OPTIONS.map((g) => (
                    <button
                      key={g}
                      onClick={() => {
                        setCurrentGoal(g);
                        onUpdateUser({ goal: g });
                      }}
                      className={`p-2.5 rounded-xl font-bold transition-all text-left ${
                        currentGoal === g
                          ? 'bg-[#C7FF3D] text-black shadow-sm'
                          : 'bg-[#121212] border border-[#2A2A2A] text-[#F5F5F5]'
                      }`}
                    >
                      {g}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 2: Preference */}
              <div>
                <label className="block font-bold text-[#8A8A8A] mb-1.5 uppercase tracking-wider text-[10px]">
                  2. Food Preference
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {(['Veg', 'Non-Veg', 'Vegan', 'Eggitarian'] as DietaryPreference[]).map((p) => (
                    <button
                      key={p}
                      onClick={() => handlePreferenceChange(p)}
                      className={`p-2.5 rounded-xl font-bold transition-all text-left ${
                        preference === p
                          ? 'bg-[#C7FF3D] text-black shadow-sm'
                          : 'bg-[#121212] border border-[#2A2A2A] text-[#F5F5F5]'
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 3: Budget */}
              <div>
                <label className="block font-bold text-[#8A8A8A] mb-1.5 uppercase tracking-wider text-[10px]">
                  3. Daily Spend Budget
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Budget', 'Moderate', 'Premium'] as BudgetTier[]).map((b) => (
                    <button
                      key={b}
                      onClick={() => handleBudgetChange(b)}
                      className={`p-2.5 rounded-xl font-bold transition-all text-center ${
                        budgetTier === b
                          ? 'bg-[#C7FF3D] text-black shadow-sm'
                          : 'bg-[#121212] border border-[#2A2A2A] text-[#F5F5F5]'
                      }`}
                    >
                      {b}
                    </button>
                  ))}
                </div>
              </div>

              {/* Question 4: Allergies */}
              <div>
                <label className="block font-bold text-[#8A8A8A] mb-1.5 uppercase tracking-wider text-[10px]">
                  4. Allergies & Intolerances
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ALLERGY_OPTIONS.map((a) => {
                    const sel = allergies.includes(a);
                    return (
                      <button
                        key={a}
                        onClick={() => handleToggleAllergy(a)}
                        className={`p-2 rounded-xl text-left font-medium transition-all ${
                          sel
                            ? 'bg-[#EF4444]/20 border border-[#EF4444] text-[#FCA5A5]'
                            : 'bg-[#121212] border border-[#2A2A2A] text-[#8A8A8A]'
                        }`}
                      >
                        {sel ? '✓ ' : '+ '}
                        {a}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            <button
              onClick={() => setIsQuestionnaireOpen(false)}
              className="mt-5 w-full py-3 rounded-2xl bg-[#C7FF3D] hover:bg-[#bbf335] text-black font-extrabold text-sm transition-colors"
            >
              Apply & Generate Diet Plan
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
