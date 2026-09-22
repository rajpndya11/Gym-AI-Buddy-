import React, { useState } from 'react';
import { WorkoutSession as IWorkoutSession } from '../types';
import { ExerciseVisualizer } from './ExerciseVisualizer';
import { RestTimerModal } from './RestTimerModal';
import {
  X,
  Check,
  ChevronRight,
  AlertTriangle,
  Lightbulb,
  ArrowRight,
  Sparkles,
  Info,
  RefreshCw,
} from 'lucide-react';

interface WorkoutSessionProps {
  initialSession: IWorkoutSession;
  onFinishWorkout: (session: IWorkoutSession) => void;
  onExit: () => void;
}

export const WorkoutSession: React.FC<WorkoutSessionProps> = ({
  initialSession,
  onFinishWorkout,
  onExit,
}) => {
  const [session, setSession] = useState<IWorkoutSession>(initialSession);
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState<number>(0);
  const [currentSetIndex, setCurrentSetIndex] = useState<number>(0);
  const [showRestTimer, setShowRestTimer] = useState<boolean>(false);
  const [isSetJustCompleted, setIsSetJustCompleted] = useState<boolean>(false);
  const [showQuitConfirm, setShowQuitConfirm] = useState<boolean>(false);

  const currentExerciseState = session.exercises[currentExerciseIndex];
  const exercise = currentExerciseState?.exercise;

  // Pre-session overview screen
  if (!hasStarted) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col justify-between p-6 max-w-md mx-auto" id="workout-preview-screen">
        <div>
          {/* Header */}
          <div className="flex items-center justify-between pt-4 mb-6">
            <button
              onClick={onExit}
              className="p-2 rounded-xl bg-[#171717] border border-[#262626] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <span className="text-xs uppercase font-bold tracking-widest text-[#C7FF3D]">
              Session Preview
            </span>
            <div className="w-9" />
          </div>

          <div className="mb-6">
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#8A8A8A]">
              TODAY'S SESSION
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-[#F5F5F5] mt-1">
              {session.title}
            </h1>
            <p className="text-sm text-[#8A8A8A] mt-1">
              {session.exercises.length} exercises · ~{session.estimatedMinutes} min
            </p>
          </div>

          {/* AI Reassurance Card */}
          <div className="p-4 rounded-2xl bg-[#171717] border border-[#262626] mb-6 flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#C7FF3D]/15 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-[#C7FF3D]" />
            </div>
            <div>
              <span className="text-xs font-bold text-[#C7FF3D] block">GymBuddy Guidance</span>
              <p className="text-xs text-[#8A8A8A] mt-0.5 leading-relaxed">
                Take your time with every rep. We focus on form, not ego lifting. If any weight feels heavy, you can adjust it anytime.
              </p>
            </div>
          </div>

          {/* Exercise sequence list */}
          <div className="space-y-2.5">
            <div className="text-xs font-semibold text-[#8A8A8A] px-1 uppercase tracking-wider">
              Routine Sequence
            </div>
            {session.exercises.map((item, idx) => (
              <div
                key={item.exercise.id + '-' + idx}
                className="p-3.5 rounded-xl bg-[#141414] border border-[#222222] flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-lg bg-[#202020] text-xs font-bold text-[#8A8A8A] flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="text-sm font-semibold text-[#F5F5F5]">{item.exercise.name}</h4>
                    <span className="text-xs text-[#8A8A8A]">
                      {item.exercise.defaultSets} sets × {item.exercise.defaultReps} reps · {item.exercise.defaultWeight} {item.exercise.weightUnit}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[11px] text-[#C7FF3D] bg-[#1a2e0a] border border-[#C7FF3D]/30 px-2 py-0.5 rounded-md font-medium">
                    {item.exercise.targetMuscles[0]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start CTA */}
        <div className="pt-6 pb-4">
          <button
            onClick={() => setHasStarted(true)}
            className="w-full py-4 px-6 rounded-xl bg-[#C7FF3D] hover:bg-[#bbf335] active:scale-[0.99] text-black font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C7FF3D]/10"
            id="lets-go-workout-btn"
          >
            <span>LET'S GO</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Active workout execution
  const currentSet = currentExerciseState.sets[currentSetIndex] || {
    setNumber: currentSetIndex + 1,
    weight: exercise.defaultWeight,
    reps: exercise.defaultReps,
    completed: false,
  };

  const updateCurrentSet = (deltaWeight: number, deltaReps: number) => {
    setSession((prev) => {
      const updatedExercises = [...prev.exercises];
      const ex = updatedExercises[currentExerciseIndex];
      const updatedSets = [...ex.sets];
      const target = { ...updatedSets[currentSetIndex] };

      target.weight = Math.max(0, target.weight + deltaWeight);
      target.reps = Math.max(1, target.reps + deltaReps);
      updatedSets[currentSetIndex] = target;

      updatedExercises[currentExerciseIndex] = {
        ...ex,
        sets: updatedSets,
      };

      return { ...prev, exercises: updatedExercises };
    });
  };

  const handleCompleteSet = () => {
    setIsSetJustCompleted(true);

    // Mark current set complete
    setSession((prev) => {
      const updatedExercises = [...prev.exercises];
      const ex = updatedExercises[currentExerciseIndex];
      const updatedSets = [...ex.sets];
      updatedSets[currentSetIndex] = {
        ...updatedSets[currentSetIndex],
        completed: true,
      };

      const allSetsDone = updatedSets.every((s) => s.completed);
      updatedExercises[currentExerciseIndex] = {
        ...ex,
        sets: updatedSets,
        isCompleted: allSetsDone,
      };

      return { ...prev, exercises: updatedExercises };
    });

    // Try gentle tactile haptic feedback if supported
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in window.navigator) {
      try {
        window.navigator.vibrate([30, 40, 45]);
      } catch {
        // ignore
      }
    }

    // Micro-delay then show Rest Timer to allow user to experience the satisfying checkmark transition
    setTimeout(() => {
      setIsSetJustCompleted(false);
      setShowRestTimer(true);
    }, 650);
  };

  const handleRestFinishedOrSkipped = () => {
    setShowRestTimer(false);

    // Check if more sets remain for this exercise
    if (currentSetIndex + 1 < currentExerciseState.sets.length) {
      setCurrentSetIndex(currentSetIndex + 1);
    } else {
      // Exercise complete, move to next exercise or finish workout
      if (currentExerciseIndex + 1 < session.exercises.length) {
        setCurrentExerciseIndex(currentExerciseIndex + 1);
        setCurrentSetIndex(0);
      } else {
        // Entire workout finished!
        const finishedSession: IWorkoutSession = {
          ...session,
          isCompleted: true,
        };
        onFinishWorkout(finishedSession);
      }
    }
  };

  // Replace exercise alternative handler
  const handleSwapAlternative = () => {
    if (!exercise.alternativeExerciseId) return;
    // Simple swap
    alert(`Swapped to ${exercise.alternativeName}! Mechanical control adjusted for beginners.`);
  };

  const nextUpText =
    currentSetIndex + 1 < currentExerciseState.sets.length
      ? `${exercise.name} · Set ${currentSetIndex + 2} of ${currentExerciseState.sets.length}`
      : currentExerciseIndex + 1 < session.exercises.length
      ? `${session.exercises[currentExerciseIndex + 1].exercise.name} · Set 1`
      : 'Workout Complete 🎉';

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col justify-between p-4 max-w-md mx-auto" id="active-workout-mode">
      {/* Top Bar: Progress Indicator & Exit */}
      <div>
        <div className="flex items-center justify-between pt-3 pb-3">
          <button
            onClick={() => setShowQuitConfirm(true)}
            className="p-2 rounded-xl bg-[#171717] border border-[#262626] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-[#C7FF3D]">
              {String(currentExerciseIndex + 1).padStart(2, '0')}
            </span>
            <span className="text-xs text-[#8A8A8A]">/</span>
            <span className="text-xs font-semibold text-[#8A8A8A]">
              {String(session.exercises.length).padStart(2, '0')}
            </span>
          </div>

          <div className="text-right">
            <span className="text-[11px] font-semibold text-[#8A8A8A] uppercase tracking-wider">
              Set {currentSetIndex + 1}/{currentExerciseState.sets.length}
            </span>
          </div>
        </div>

        {/* Global Workout Progress bar */}
        <div className="w-full h-1 bg-[#1c1c1c] rounded-full mb-4 overflow-hidden">
          <div
            className="h-full bg-[#C7FF3D] transition-all duration-300"
            style={{
              width: `${
                ((currentExerciseIndex + (currentSetIndex + 1) / currentExerciseState.sets.length) /
                  session.exercises.length) *
                100
              }%`,
            }}
          />
        </div>

        {/* Exercise Header & Target Muscles */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#F5F5F5] uppercase">
              {exercise.name}
            </h2>
            <div className="flex items-center gap-1.5 mt-1 flex-wrap">
              {exercise.targetMuscles.map((muscle) => (
                <span
                  key={muscle}
                  className="text-[11px] font-medium text-[#8A8A8A] bg-[#171717] border border-[#262626] px-2 py-0.5 rounded-md"
                >
                  {muscle}
                </span>
              ))}
            </div>
          </div>

          {exercise.alternativeName && (
            <button
              onClick={handleSwapAlternative}
              className="text-[11px] text-[#8A8A8A] hover:text-[#C7FF3D] flex items-center gap-1 bg-[#171717] border border-[#262626] px-2 py-1 rounded-lg transition-colors"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Swap</span>
            </button>
          )}
        </div>

        {/* Section 16: Exercise Visual Video & Animation Component */}
        <div className="mb-4">
          <ExerciseVisualizer
            type={exercise.animationType}
            exerciseName={exercise.name}
            targetMuscles={exercise.targetMuscles}
            videoUrl={exercise.videoUrl}
            instructions={exercise.instructions}
            formTip={exercise.formTip}
            commonMistake={exercise.commonMistake}
          />
        </div>

        {/* Active Set Adjustment Panel */}
        <div className="bg-[#171717] border border-[#262626] rounded-2xl p-4 mb-4 shadow-lg">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#C7FF3D]">
              SET {currentSetIndex + 1} OF {currentExerciseState.sets.length}
            </span>
            <div className="flex items-center gap-1.5">
              {currentExerciseState.sets.map((s, idx) => (
                <div
                  key={idx}
                  className={`w-2.5 h-2.5 rounded-full ${
                    s.completed
                      ? 'bg-[#C7FF3D]'
                      : idx === currentSetIndex
                      ? 'bg-[#C7FF3D]/40 ring-1 ring-[#C7FF3D]'
                      : 'bg-[#282828]'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {/* Weight selector */}
            <div className="bg-[#111111] border border-[#262626] rounded-xl p-3 flex flex-col items-center">
              <span className="text-[11px] text-[#8A8A8A] uppercase font-semibold">WEIGHT</span>
              <div className="flex items-center justify-between w-full mt-2">
                <button
                  onClick={() => updateCurrentSet(-2.5, 0)}
                  className="w-8 h-8 rounded-lg bg-[#202020] text-[#F5F5F5] font-bold hover:bg-[#282828] active:scale-95"
                >
                  −
                </button>
                <span className="text-lg font-extrabold text-[#F5F5F5]">
                  {currentSet.weight} <span className="text-xs font-normal text-[#8A8A8A]">{exercise.weightUnit}</span>
                </span>
                <button
                  onClick={() => updateCurrentSet(2.5, 0)}
                  className="w-8 h-8 rounded-lg bg-[#202020] text-[#F5F5F5] font-bold hover:bg-[#282828] active:scale-95"
                >
                  +
                </button>
              </div>
            </div>

            {/* Reps selector */}
            <div className="bg-[#111111] border border-[#262626] rounded-xl p-3 flex flex-col items-center">
              <span className="text-[11px] text-[#8A8A8A] uppercase font-semibold">TARGET REPS</span>
              <div className="flex items-center justify-between w-full mt-2">
                <button
                  onClick={() => updateCurrentSet(0, -1)}
                  className="w-8 h-8 rounded-lg bg-[#202020] text-[#F5F5F5] font-bold hover:bg-[#282828] active:scale-95"
                >
                  −
                </button>
                <span className="text-lg font-extrabold text-[#C7FF3D]">
                  {currentSet.reps}
                </span>
                <button
                  onClick={() => updateCurrentSet(0, 1)}
                  className="w-8 h-8 rounded-lg bg-[#202020] text-[#F5F5F5] font-bold hover:bg-[#282828] active:scale-95"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Section 16: How to perform instructions, Form Tip, Common Mistake */}
        <div className="space-y-3 mb-6">
          {/* How to perform */}
          <div className="bg-[#171717] border border-[#262626] rounded-2xl p-4">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A] mb-2.5">
              How to perform
            </h4>
            <div className="space-y-2 text-xs">
              {exercise.instructions.map((stepText, idx) => (
                <div key={idx} className="flex items-start gap-2.5">
                  <span className="text-[11px] font-bold text-[#C7FF3D] bg-[#222] px-1.5 py-0.5 rounded shrink-0">
                    0{idx + 1}
                  </span>
                  <p className="text-[#F5F5F5] leading-relaxed">{stepText}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Form Tip */}
          <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-[#C7FF3D]/15 flex items-center justify-center shrink-0 mt-0.5">
              <Lightbulb className="w-3.5 h-3.5 text-[#C7FF3D]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[#C7FF3D] block">FORM TIP</span>
              <p className="text-xs text-[#8A8A8A] mt-0.5 leading-snug">{exercise.formTip}</p>
            </div>
          </div>

          {/* Common Mistake */}
          <div className="p-3.5 rounded-xl bg-[#141414] border border-[#262626] flex items-start gap-2.5">
            <div className="w-5 h-5 rounded-md bg-[#FFB547]/15 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-3.5 h-3.5 text-[#FFB547]" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase text-[#FFB547] block">COMMON MISTAKE</span>
              <p className="text-xs text-[#8A8A8A] mt-0.5 leading-snug">{exercise.commonMistake}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Primary CTA: COMPLETE SET */}
      <div className="sticky bottom-0 pb-4 pt-2 bg-gradient-to-t from-[#050505] via-[#050505] to-transparent">
        <div className="relative w-full">
          {/* Subtle tactile ripple burst on set completion */}
          {isSetJustCompleted && (
            <div className="absolute inset-0 rounded-2xl bg-[#22c55e] animate-ripple pointer-events-none" />
          )}

          <button
            onClick={handleCompleteSet}
            disabled={isSetJustCompleted}
            className={`w-full py-4 px-6 rounded-2xl font-black text-base flex items-center justify-center gap-3 transition-all duration-300 relative overflow-hidden select-none ${
              isSetJustCompleted
                ? 'animate-scale-spring bg-gradient-to-r from-[#14532d] via-[#15803d] to-[#14532d] text-[#F5F5F5] border-2 border-[#22c55e] shadow-[0_0_28px_rgba(34,197,94,0.45)]'
                : 'bg-[#C7FF3D] hover:bg-[#bbf335] active:scale-[0.96] text-black shadow-lg shadow-[#C7FF3D]/15'
            }`}
            id="complete-set-btn"
          >
            {isSetJustCompleted ? (
              <div className="flex items-center gap-2.5 transition-all">
                {/* Tactile green checkmark badge with drawing SVG animation */}
                <div className="w-6 h-6 rounded-full bg-[#22c55e] text-black flex items-center justify-center shadow-md animate-scale-spring">
                  <svg
                    className="w-4 h-4 text-black"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M5 13l4 4L19 7" className="animate-draw-check" />
                  </svg>
                </div>
                <span className="tracking-wider uppercase font-black text-[#F5F5F5] drop-shadow-sm">
                  SET COMPLETED!
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-black stroke-[2.5]" />
                <span className="tracking-wide">COMPLETE SET</span>
              </div>
            )}
          </button>
        </div>
      </div>

      {/* Rest Timer Modal */}
      {showRestTimer && (
        <RestTimerModal
          initialSeconds={45}
          onFinish={handleRestFinishedOrSkipped}
          onSkip={handleRestFinishedOrSkipped}
          nextUpText={nextUpText}
        />
      )}

      {/* Quit Workout Confirmation Dialog */}
      {showQuitConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#171717] border border-[#262626] rounded-2xl p-5 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-[#F5F5F5]">Pause Workout?</h3>
            <p className="text-xs text-[#8A8A8A] mt-1.5">
              Your completed sets will be recorded. You can return anytime.
            </p>
            <div className="mt-5 space-y-2">
              <button
                onClick={() => setShowQuitConfirm(false)}
                className="w-full py-2.5 rounded-xl bg-[#C7FF3D] text-black font-bold text-sm"
              >
                Keep Going
              </button>
              <button
                onClick={onExit}
                className="w-full py-2.5 rounded-xl bg-[#222] hover:bg-[#2a2a2a] text-[#8A8A8A] hover:text-[#F5F5F5] font-semibold text-sm transition-colors"
              >
                Exit Workout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
