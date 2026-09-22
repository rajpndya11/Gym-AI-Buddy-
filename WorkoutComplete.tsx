import React from 'react';
import { Trophy, CheckCircle2, TrendingUp, Sparkles, ArrowRight, Home } from 'lucide-react';
import { WorkoutSession } from '../types';

interface WorkoutCompleteProps {
  session: WorkoutSession;
  onViewProgress: () => void;
  onReturnHome: () => void;
}

export const WorkoutComplete: React.FC<WorkoutCompleteProps> = ({
  session,
  onViewProgress,
  onReturnHome,
}) => {
  const totalExercises = session.exercises.length;
  const totalSets = session.exercises.reduce((acc, curr) => acc + curr.sets.filter(s => s.completed).length, 0) || totalExercises * 3;
  const duration = session.estimatedMinutes || 42;

  // Derive dynamic win highlight from session
  const leadExercise = session.exercises[0]?.exercise;
  const currentWeight = leadExercise?.defaultWeight || 40;
  const progressiveTargetWeight = currentWeight + 2.5;

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col justify-between p-6 max-w-md mx-auto" id="workout-complete-screen">
      <div className="pt-8 text-center">
        {/* Celebration Trophy Badge */}
        <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-[#171717] border border-[#262626] mb-6 shadow-2xl">
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-[#C7FF3D]/20 to-transparent blur-md" />
          <Trophy className="w-10 h-10 text-[#C7FF3D] relative z-10 animate-bounce" />
        </div>

        <span className="text-xs uppercase font-extrabold tracking-widest text-[#C7FF3D] block mb-2">
          SESSION CONCLUDED
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-[#F5F5F5]">
          WORKOUT COMPLETE
        </h1>
        <p className="text-sm text-[#8A8A8A] mt-2 max-w-xs mx-auto">
          “You showed up. That's what matters.”
        </p>

        {/* 3 Metric blocks */}
        <div className="grid grid-cols-3 gap-3 my-8 text-left">
          <div className="bg-[#171717] border border-[#262626] rounded-2xl p-4">
            <span className="text-2xl font-black text-[#F5F5F5] block">{duration}m</span>
            <span className="text-[11px] text-[#8A8A8A] mt-0.5 block leading-tight">
              Workout duration
            </span>
          </div>

          <div className="bg-[#171717] border border-[#262626] rounded-2xl p-4">
            <span className="text-2xl font-black text-[#C7FF3D] block">{totalExercises}</span>
            <span className="text-[11px] text-[#8A8A8A] mt-0.5 block leading-tight">
              Exercises done
            </span>
          </div>

          <div className="bg-[#171717] border border-[#262626] rounded-2xl p-4">
            <span className="text-2xl font-black text-[#F5F5F5] block">{totalSets}</span>
            <span className="text-[11px] text-[#8A8A8A] mt-0.5 block leading-tight">
              Sets completed
            </span>
          </div>
        </div>

        {/* Today's Win Card */}
        <div className="bg-[#171717] border border-[#262626] rounded-2xl p-5 text-left mb-6 relative overflow-hidden">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-[#C7FF3D]/15 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5 text-[#C7FF3D]" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#C7FF3D]">
              TODAY'S WIN
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-base font-bold text-[#F5F5F5]">
                {leadExercise?.name || 'Bench Press'}
              </h4>
              <p className="text-xs text-[#8A8A8A] mt-0.5">Progressive overload achieved</p>
            </div>

            <div className="flex items-center gap-2 bg-[#202020] border border-[#333] px-3 py-1.5 rounded-xl font-bold text-sm">
              <span className="text-[#8A8A8A] line-through">{currentWeight} kg</span>
              <ArrowRight className="w-3 h-3 text-[#C7FF3D]" />
              <span className="text-[#C7FF3D]">{progressiveTargetWeight} kg</span>
            </div>
          </div>
        </div>

        {/* AI Adaptation Notice */}
        <div className="p-4 rounded-xl bg-[#121212] border border-[#262626] text-left flex items-start gap-3">
          <div className="w-7 h-7 rounded-lg bg-[#A78BFA]/15 flex items-center justify-center shrink-0 mt-0.5">
            <Sparkles className="w-4 h-4 text-[#A78BFA]" />
          </div>
          <div>
            <span className="text-xs font-semibold text-[#A78BFA] block">GymBuddy AI Adaptation</span>
            <p className="text-xs text-[#8A8A8A] mt-0.5 leading-relaxed">
              GymBuddy has updated your next workout. I’ve scheduled 48h recovery for chest and dialed in your next progression.
            </p>
          </div>
        </div>
      </div>

      {/* Primary and secondary CTAs */}
      <div className="pb-6 pt-4 space-y-3">
        <button
          onClick={onViewProgress}
          className="w-full py-4 px-6 rounded-xl bg-[#C7FF3D] hover:bg-[#bbf335] active:scale-[0.99] text-black font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C7FF3D]/10"
          id="see-my-progress-btn"
        >
          <span>SEE MY PROGRESS</span>
          <ArrowRight className="w-5 h-5" />
        </button>

        <button
          onClick={onReturnHome}
          className="w-full py-3.5 px-6 rounded-xl bg-[#171717] hover:bg-[#222222] text-[#8A8A8A] hover:text-[#F5F5F5] font-semibold text-sm flex items-center justify-center gap-2 border border-[#262626] transition-colors"
          id="return-to-home-btn"
        >
          <Home className="w-4 h-4" />
          <span>Return to Home</span>
        </button>
      </div>
    </div>
  );
};
