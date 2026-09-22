import React, { useState, useEffect } from 'react';
import {
  UserProfile,
  WorkoutSession as IWorkoutSession,
  UserCohort,
} from './types';
import {
  DEFAULT_USER,
  INITIAL_UPPER_BODY_SESSION,
  FIRST_TIME_BEGINNER_SESSION,
  RESTART_SESSION,
  createInitialWorkout,
} from './data/mockData';
import { HomeScreen } from './components/HomeScreen';
import { WorkoutSession } from './components/WorkoutSession';
import { WorkoutComplete } from './components/WorkoutComplete';
import { ProgressScreen } from './components/ProgressScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { Onboarding } from './components/Onboarding';
import { BuddyAIChat } from './components/BuddyAIChat';
import { DietScreen } from './components/DietScreen';
import { Home, Dumbbell, TrendingUp, User, Sparkles, Utensils } from 'lucide-react';

export default function App() {
  // Persistence state
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('gymbuddy_user_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_USER;
  });

  const [workoutSession, setWorkoutSession] = useState<IWorkoutSession>(() => {
    try {
      const saved = localStorage.getItem('gymbuddy_workout_v1');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return INITIAL_UPPER_BODY_SESSION;
  });

  const [activeTab, setActiveTab] = useState<'home' | 'workout' | 'diet' | 'progress' | 'profile'>('home');
  const [isWorkoutActive, setIsWorkoutActive] = useState<boolean>(false);
  const [isWorkoutCompletedView, setIsWorkoutCompletedView] = useState<boolean>(false);
  const [isBuddyChatOpen, setIsBuddyChatOpen] = useState<boolean>(false);

  // Sync user and workout to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('gymbuddy_user_v1', JSON.stringify(user));
    } catch {
      // ignore
    }
  }, [user]);

  useEffect(() => {
    try {
      localStorage.setItem('gymbuddy_workout_v1', JSON.stringify(workoutSession));
    } catch {
      // ignore
    }
  }, [workoutSession]);

  // Handle Cohort Change
  const handleSelectCohort = (cohort: UserCohort) => {
    let session = INITIAL_UPPER_BODY_SESSION;
    if (cohort === 'new') {
      session = FIRST_TIME_BEGINNER_SESSION;
    } else if (cohort === 'inactive') {
      session = RESTART_SESSION;
    }

    setUser((prev) => ({
      ...prev,
      cohort,
    }));
    setWorkoutSession(session);
    setIsWorkoutCompletedView(false);
    setIsWorkoutActive(false);
  };

  // Start workout action
  const handleStartWorkout = () => {
    setIsWorkoutCompletedView(false);
    setIsWorkoutActive(true);
    setActiveTab('workout');
  };

  // Workout finished
  const handleFinishWorkout = (finishedSession: IWorkoutSession) => {
    setWorkoutSession(finishedSession);
    setIsWorkoutActive(false);
    setIsWorkoutCompletedView(true);
  };

  // Onboarding completion
  const handleOnboardingComplete = (newProfile: UserProfile) => {
    setUser(newProfile);
    const newSession = createInitialWorkout(
      ['incline_press', 'pull_ups', 'squat', 'dumbbell_curl', 'tricep_pushdown'],
      'First-Time Beginner Full Body',
      30
    );
    setWorkoutSession(newSession);
    setActiveTab('home');
  };

  // Reset Onboarding
  const handleResetOnboarding = () => {
    try {
      localStorage.removeItem('gymbuddy_user_v1');
      localStorage.removeItem('gymbuddy_workout_v1');
    } catch {
      // ignore
    }
    setUser({
      ...DEFAULT_USER,
      onboarded: false,
    });
    setWorkoutSession(INITIAL_UPPER_BODY_SESSION);
    setIsWorkoutActive(false);
    setIsWorkoutCompletedView(false);
  };

  // Action dispatcher from Buddy AI
  const handleBuddyAction = (actionType: string, payload?: any) => {
    if (actionType === 'start_workout') {
      handleStartWorkout();
    } else if (actionType === 'switch_short_workout') {
      setWorkoutSession(RESTART_SESSION);
      setUser((prev) => ({ ...prev, cohort: 'inactive' }));
      handleStartWorkout();
    } else if (actionType === 'replace_exercise') {
      // Swap first exercise to chest press
      setWorkoutSession((prev) => {
        const updatedExercises = [...prev.exercises];
        if (updatedExercises.length > 0) {
          // Replace bench press with chest press
          const chestPress = createInitialWorkout(['chest_press_machine']).exercises[0];
          updatedExercises[0] = chestPress;
        }
        return { ...prev, exercises: updatedExercises };
      });
      handleStartWorkout();
    }
  };

  // If user has not completed onboarding
  if (!user.onboarded) {
    return (
      <main className="min-h-screen bg-[#050505] text-[#F5F5F5]">
        <Onboarding onComplete={handleOnboardingComplete} initialProfile={user} />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] selection:bg-[#C7FF3D] selection:text-black flex flex-col justify-between antialiased">
      {/* Centered mobile-app frame container for desktop viewports */}
      <div className="w-full max-w-lg mx-auto flex-1 flex flex-col relative min-h-screen">
        {/* Main Content Area */}
        <main className="flex-1 w-full overflow-x-hidden">
          {/* Active Workout Mode (focused full screen without bottom nav) */}
          {isWorkoutActive && (
            <WorkoutSession
              initialSession={workoutSession}
              onFinishWorkout={handleFinishWorkout}
              onExit={() => {
                setIsWorkoutActive(false);
                setActiveTab('home');
              }}
            />
          )}

          {/* Workout Complete Celebration Screen */}
          {!isWorkoutActive && isWorkoutCompletedView && (
            <WorkoutComplete
              session={workoutSession}
              onViewProgress={() => {
                setIsWorkoutCompletedView(false);
                setActiveTab('progress');
              }}
              onReturnHome={() => {
                setIsWorkoutCompletedView(false);
                setActiveTab('home');
              }}
            />
          )}

          {/* Standard Tab Navigation Views */}
          {!isWorkoutActive && !isWorkoutCompletedView && (
            <>
              {activeTab === 'home' && (
                <HomeScreen
                  user={user}
                  workoutSession={workoutSession}
                  onStartWorkout={handleStartWorkout}
                  onOpenBuddyChat={() => setIsBuddyChatOpen(true)}
                  onOpenProfile={() => setActiveTab('profile')}
                  onSelectCohort={handleSelectCohort}
                  onNavigateToDiet={() => setActiveTab('diet')}
                />
              )}

              {activeTab === 'workout' && (
                <WorkoutSession
                  initialSession={workoutSession}
                  onFinishWorkout={handleFinishWorkout}
                  onExit={() => setActiveTab('home')}
                />
              )}

              {activeTab === 'diet' && (
                <DietScreen
                  user={user}
                  onUpdateUser={(partial) => setUser((prev) => ({ ...prev, ...partial }))}
                  onOpenBuddyChat={() => setIsBuddyChatOpen(true)}
                />
              )}

              {activeTab === 'progress' && <ProgressScreen />}

              {activeTab === 'profile' && (
                <ProfileScreen
                  user={user}
                  onUpdateUser={setUser}
                  onResetOnboarding={handleResetOnboarding}
                  onSelectCohort={handleSelectCohort}
                />
              )}
            </>
          )}
        </main>

        {/* Floating "✦ Ask Buddy" Button (Visible except during active set execution) */}
        {!isWorkoutActive && !isWorkoutCompletedView && (
          <div className="fixed bottom-20 right-4 sm:right-[calc(50%-230px)] z-40">
            <button
              onClick={() => setIsBuddyChatOpen(true)}
              className="px-4 py-2.5 rounded-full bg-[#171717] hover:bg-[#202020] text-[#F5F5F5] border border-[#262626] hover:border-[#C7FF3D] flex items-center gap-2 shadow-2xl transition-all active:scale-95 group"
              id="floating-ask-buddy-btn"
            >
              <div className="relative">
                <Sparkles className="w-4 h-4 text-[#C7FF3D] transition-transform group-hover:rotate-12" />
                <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-[#C7FF3D] animate-ping" />
              </div>
              <span className="text-xs font-bold tracking-tight">✦ Ask Buddy</span>
            </button>
          </div>
        )}

        {/* Bottom Mobile Navigation (Home | Workout | Diet | Progress | Profile) */}
        {!isWorkoutActive && !isWorkoutCompletedView && (
          <nav
            className="fixed bottom-0 left-0 right-0 z-30 bg-[#101010]/95 backdrop-blur-lg border-t border-[#262626] max-w-lg mx-auto"
            id="mobile-bottom-navigation"
          >
            <div className="grid grid-cols-5 h-16 px-1.5">
              {/* Home */}
              <button
                onClick={() => setActiveTab('home')}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  activeTab === 'home' ? 'text-[#C7FF3D]' : 'text-[#8A8A8A] hover:text-[#F5F5F5]'
                }`}
                id="nav-tab-home"
              >
                <Home className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Home</span>
              </button>

              {/* Workout */}
              <button
                onClick={() => {
                  setActiveTab('workout');
                  setIsWorkoutActive(true);
                }}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  activeTab === 'workout' ? 'text-[#C7FF3D]' : 'text-[#8A8A8A] hover:text-[#F5F5F5]'
                }`}
                id="nav-tab-workout"
              >
                <Dumbbell className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Workout</span>
              </button>

              {/* Diet */}
              <button
                onClick={() => setActiveTab('diet')}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  activeTab === 'diet' ? 'text-[#C7FF3D]' : 'text-[#8A8A8A] hover:text-[#F5F5F5]'
                }`}
                id="nav-tab-diet"
              >
                <Utensils className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Diet</span>
              </button>

              {/* Progress */}
              <button
                onClick={() => setActiveTab('progress')}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  activeTab === 'progress' ? 'text-[#C7FF3D]' : 'text-[#8A8A8A] hover:text-[#F5F5F5]'
                }`}
                id="nav-tab-progress"
              >
                <TrendingUp className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Progress</span>
              </button>

              {/* Profile */}
              <button
                onClick={() => setActiveTab('profile')}
                className={`flex flex-col items-center justify-center gap-1 transition-colors ${
                  activeTab === 'profile' ? 'text-[#C7FF3D]' : 'text-[#8A8A8A] hover:text-[#F5F5F5]'
                }`}
                id="nav-tab-profile"
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Profile</span>
              </button>
            </div>
          </nav>
        )}

        {/* Buddy AI Chat Drawer */}
        <BuddyAIChat
          isOpen={isBuddyChatOpen}
          onClose={() => setIsBuddyChatOpen(false)}
          user={user}
          onActionTrigger={handleBuddyAction}
        />
      </div>
    </div>
  );
}
