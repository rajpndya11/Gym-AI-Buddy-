import React from 'react';
import { UserProfile, WorkoutSession, UserCohort } from '../types';
import {
  Sparkles,
  ArrowRight,
  Flame,
  TrendingUp,
  Dumbbell,
  Calendar,
  CheckCircle2,
  Clock,
  HelpCircle,
  Play,
  RotateCcw,
  Utensils,
  Leaf,
  DollarSign,
} from 'lucide-react';
import { Logo } from './Logo';

interface HomeScreenProps {
  user: UserProfile;
  workoutSession: WorkoutSession;
  onStartWorkout: () => void;
  onOpenBuddyChat: () => void;
  onOpenProfile: () => void;
  onSelectCohort: (cohort: UserCohort) => void;
  onNavigateToDiet?: () => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  user,
  workoutSession,
  onStartWorkout,
  onOpenBuddyChat,
  onOpenProfile,
  onSelectCohort,
  onNavigateToDiet,
}) => {
  const cohort = user.cohort || 'returning';
  const completedCount = workoutSession.exercises.filter((e) => e.isCompleted).length;
  const totalExercises = workoutSession.exercises.length;

  // Cohort-specific headers and messaging
  const getCohortContent = () => {
    switch (cohort) {
      case 'new':
        return {
          greeting: `Welcome, ${user.name || 'Raj'}`,
          cardLabel: 'YOUR FIRST WORKOUT',
          cardTitle: workoutSession.title || 'Full Body Primer',
          duration: '30 min',
          ctaText: 'START WORKOUT',
          aiMessage: 'Beginner-friendly movements with steady machine support.',
        };
      case 'consistent':
        return {
          greeting: `Welcome back, ${user.name || 'Raj'}`,
          cardLabel: "TODAY'S WORKOUT",
          cardTitle: workoutSession.title || 'Upper Body Power',
          duration: '42 min',
          ctaText: 'START WORKOUT',
          aiMessage: 'Progression ready: +2 reps on bench press.',
        };
      case 'inactive':
        return {
          greeting: `Good to see you, ${user.name || 'Raj'}`,
          cardLabel: '20-MIN RESTART',
          cardTitle: 'Gentle Full Body Restart',
          duration: '20 min',
          ctaText: 'START WORKOUT',
          aiMessage: 'Ease back in smoothly with 3 core movements.',
        };
      case 'returning':
      default:
        return {
          greeting: `Good morning, ${user.name || 'Raj'}`,
          cardLabel: "TODAY'S WORKOUT",
          cardTitle: workoutSession.title || 'Upper Body',
          duration: `${workoutSession.estimatedMinutes} min`,
          ctaText: 'START WORKOUT',
          aiMessage: 'Calibrated for steady progressive overload.',
        };
    }
  };

  const cohortData = getCohortContent();

  const daysOfWeek = [
    { day: 'Mon', completed: true },
    { day: 'Tue', completed: true },
    { day: 'Wed', completed: false, isToday: true },
    { day: 'Thu', completed: true },
    { day: 'Fri', completed: false },
    { day: 'Sat', completed: false },
    { day: 'Sun', completed: false },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto" id="home-screen-root">
      {/* Top Bar with Logo, Date, and Profile Avatar */}
      <div className="flex items-center justify-between mb-4">
        <Logo size="sm" />

        <div className="flex items-center gap-2">
          {/* Quick Demo Cohort Switcher */}
          <div className="flex bg-[#141414] p-0.5 rounded-lg border border-[#262626]">
            {(['new', 'returning', 'consistent', 'inactive'] as UserCohort[]).map((c) => (
              <button
                key={c}
                onClick={() => onSelectCohort(c)}
                title={`Simulate ${c} user cohort`}
                className={`px-2 py-1 text-[10px] font-semibold rounded capitalize transition-all ${
                  cohort === c
                    ? 'bg-[#C7FF3D] text-black shadow-sm'
                    : 'text-[#8A8A8A] hover:text-[#F5F5F5]'
                }`}
              >
                {c === 'inactive' ? 'Restart' : c}
              </button>
            ))}
          </div>

          <button
            onClick={onOpenProfile}
            className="w-8 h-8 rounded-full bg-[#1c1c1c] border border-[#2f2f2f] flex items-center justify-center text-xs font-bold text-[#C7FF3D] hover:border-[#C7FF3D] transition-colors"
            title="Open Profile"
            id="home-profile-avatar-btn"
          >
            {user.name ? user.name[0].toUpperCase() : 'R'}
          </button>
        </div>
      </div>

      {/* Greeting Header */}
      <div className="mb-4">
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F5F5]">
          {cohortData.greeting}
        </h1>
        <p className="text-xs text-[#8A8A8A] mt-1">
          Tuesday, September 22
        </p>
      </div>

      {/* Main Today's Workout Card */}
      <div
        className="bg-[#171717] border border-[#262626] rounded-3xl p-5 shadow-xl relative overflow-hidden mb-4 group"
        id="today-workout-main-card"
      >
        {/* Subtle decorative accent glow */}
        <div className="absolute top-0 right-0 w-36 h-36 bg-gradient-to-bl from-[#C7FF3D]/10 to-transparent blur-2xl pointer-events-none" />

        <div className="flex items-center justify-between mb-3">
          <span className="text-xs uppercase font-extrabold tracking-wider text-[#C7FF3D]">
            {cohortData.cardLabel}
          </span>
          <div className="flex items-center gap-1.5 text-xs text-[#8A8A8A] bg-[#111111] px-2.5 py-1 rounded-full border border-[#262626]">
            <Clock className="w-3.5 h-3.5 text-[#C7FF3D]" />
            <span>{cohortData.duration}</span>
          </div>
        </div>

        <h2 className="text-2xl font-black text-[#F5F5F5] tracking-tight">
          {cohortData.cardTitle}
        </h2>
        <p className="text-xs text-[#8A8A8A] mt-1">
          {totalExercises} exercises · Personalized for your goal
        </p>

        {/* Progress indicator */}
        <div className="my-4 bg-[#111] p-3 rounded-2xl border border-[#222]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="text-[#8A8A8A]">Session Progress</span>
            <span className="font-bold text-[#F5F5F5]">
              {completedCount} / {totalExercises} exercises
            </span>
          </div>
          <div className="w-full h-1.5 bg-[#202020] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#C7FF3D] transition-all duration-300"
              style={{ width: `${(completedCount / Math.max(1, totalExercises)) * 100}%` }}
            />
          </div>
        </div>

        {/* Primary CTA */}
        <button
          onClick={onStartWorkout}
          className="w-full py-3.5 px-5 rounded-2xl bg-[#C7FF3D] hover:bg-[#bbf335] active:scale-[0.99] text-black font-extrabold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C7FF3D]/10"
          id="home-start-workout-cta"
        >
          <span>{cohortData.ctaText}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>

      {/* AI Insight Card */}
      <div
        onClick={onOpenBuddyChat}
        className="bg-[#171717] border border-[#262626] hover:border-[#333] rounded-2xl p-4 mb-4 cursor-pointer transition-colors shadow-sm flex items-start gap-3"
        id="home-ai-insight-card"
      >
        <div className="w-7 h-7 rounded-xl bg-[#A78BFA]/15 border border-[#A78BFA]/20 flex items-center justify-center shrink-0 mt-0.5">
          <Sparkles className="w-4 h-4 text-[#A78BFA]" />
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-[#A78BFA]">
              ✦ GYMBUDDY AI
            </span>
            <span className="text-[10px] text-[#8A8A8A]">Ask Buddy →</span>
          </div>
          <p className="text-xs text-[#F5F5F5] mt-1 leading-relaxed">
            “{cohortData.aiMessage}”
          </p>
        </div>
      </div>

      {/* TODAY'S DIET & NEXT MEAL REMINDER CARD */}
      <div
        onClick={onNavigateToDiet}
        className="bg-[#171717] border border-[#262626] hover:border-[#C7FF3D]/40 rounded-2xl p-4 mb-4 cursor-pointer transition-all shadow-sm group"
        id="home-diet-next-meal-card"
      >
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#C7FF3D]/10 text-[#C7FF3D] flex items-center justify-center">
              <Utensils className="w-3.5 h-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#F5F5F5]">
              Diet & Eating Schedule
            </span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] text-[#C7FF3D] font-bold bg-[#121212] px-2 py-0.5 rounded-full border border-[#242424]">
            <Clock className="w-3 h-3" />
            <span>Next Eating Window</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-bold text-[#F5F5F5] group-hover:text-[#C7FF3D] transition-colors">
              Tailored for {user.goal || 'Build Muscle'} ({user.dietaryPreference || 'Veg'})
            </h4>
            <p className="text-[11px] text-[#8A8A8A] mt-0.5">
              5 scheduled meals with macro targets & eating reminders
            </p>
          </div>
          <span className="text-xs font-bold text-[#C7FF3D] whitespace-nowrap ml-3">
            Open Plan →
          </span>
        </div>
      </div>

      {/* Weekly Consistency */}
      <div className="bg-[#171717] border border-[#262626] rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
            THIS WEEK
          </span>
          <span className="text-xs font-bold text-[#C7FF3D]">3 / 4 workouts</span>
        </div>

        <div className="grid grid-cols-7 gap-1.5 text-center">
          {daysOfWeek.map((d) => (
            <div
              key={d.day}
              className={`p-2 rounded-xl flex flex-col items-center gap-1.5 ${
                d.isToday ? 'bg-[#222] border border-[#333]' : 'bg-[#121212]'
              }`}
            >
              <span className="text-[10px] font-semibold text-[#8A8A8A]">{d.day}</span>
              <div
                className={`w-3.5 h-3.5 rounded-full flex items-center justify-center ${
                  d.completed
                    ? 'bg-[#C7FF3D] text-black shadow-sm'
                    : d.isToday
                    ? 'border-2 border-[#C7FF3D] bg-transparent'
                    : 'bg-[#222]'
                }`}
              >
                {d.completed && <CheckCircle2 className="w-3 h-3 text-black" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Progress Snapshot */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#171717] border border-[#262626] rounded-2xl p-3.5 text-left">
          <span className="text-2xl font-black text-[#F5F5F5] block">08</span>
          <span className="text-[11px] text-[#8A8A8A] mt-0.5 block">Workouts</span>
        </div>

        <div className="bg-[#171717] border border-[#262626] rounded-2xl p-3.5 text-left">
          <span className="text-2xl font-black text-[#C7FF3D] block">82%</span>
          <span className="text-[11px] text-[#8A8A8A] mt-0.5 block">Completion</span>
        </div>

        <div className="bg-[#171717] border border-[#262626] rounded-2xl p-3.5 text-left">
          <span className="text-2xl font-black text-[#F5F5F5] block">+12%</span>
          <span className="text-[11px] text-[#8A8A8A] mt-0.5 block">Strength</span>
        </div>
      </div>

      {/* Quick Action: Ask Buddy */}
      <div className="bg-[#141414] border border-[#262626] rounded-2xl p-3.5 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#222] border border-[#333] flex items-center justify-center">
            <HelpCircle className="w-4 h-4 text-[#C7FF3D]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#F5F5F5] block">Need quick help?</span>
            <span className="text-[11px] text-[#8A8A8A]">Ask about exercises, form, or weights</span>
          </div>
        </div>

        <button
          onClick={onOpenBuddyChat}
          className="px-3 py-1.5 rounded-xl bg-[#1f1f1f] hover:bg-[#282828] text-xs font-bold text-[#C7FF3D] border border-[#333] transition-colors flex items-center gap-1"
          id="home-ask-buddy-quick-btn"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Ask Buddy</span>
        </button>
      </div>
    </div>
  );
};
