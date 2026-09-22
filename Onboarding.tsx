import React, { useState } from 'react';
import {
  UserProfile,
  UserGoal,
  UserExperience,
  TrainingSchedule,
  WorkoutDuration,
  EquipmentAccess,
  UserGender,
} from '../types';
import { ArrowLeft, ArrowRight, Check, Dumbbell, Flame, HeartPulse, Activity, Zap, Sparkles } from 'lucide-react';
import { Logo } from './Logo';

interface OnboardingProps {
  onComplete: (profile: UserProfile) => void;
  initialProfile?: UserProfile;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete, initialProfile }) => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 10;

  // Form State
  const [name, setName] = useState<string>(initialProfile?.name || 'Raj');
  const [age, setAge] = useState<number>(initialProfile?.age || 24);
  const [gender, setGender] = useState<UserGender>(initialProfile?.gender || 'Male');
  const [height, setHeight] = useState<number>(initialProfile?.height || 175);
  const [heightUnit, setHeightUnit] = useState<'cm' | 'ft'>(initialProfile?.heightUnit || 'cm');
  const [weight, setWeight] = useState<number>(initialProfile?.weight || 64);
  const [weightUnit, setWeightUnit] = useState<'kg' | 'lb'>(initialProfile?.weightUnit || 'kg');
  const [goal, setGoal] = useState<UserGoal>(initialProfile?.goal || 'Build Muscle');
  const [experience, setExperience] = useState<UserExperience>(initialProfile?.experience || 'Complete Beginner');
  const [schedule, setSchedule] = useState<TrainingSchedule>(initialProfile?.schedule || '4 days');
  const [duration, setDuration] = useState<WorkoutDuration>(initialProfile?.duration || '45–60 min');
  const [equipment, setEquipment] = useState<EquipmentAccess>(initialProfile?.equipment || 'Full Gym');

  const [isSummarized, setIsSummarized] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      setIsSummarized(true);
    }
  };

  const handleBack = () => {
    if (isSummarized) {
      setIsSummarized(false);
      return;
    }
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleFinish = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const finalProfile: UserProfile = {
        name: name.trim() || 'Raj',
        age: Number(age) || 24,
        gender,
        height: Number(height) || 175,
        heightUnit,
        weight: Number(weight) || 64,
        weightUnit,
        goal,
        experience,
        schedule,
        duration,
        equipment,
        onboarded: true,
        cohort: 'new', // First-time onboarded user starts in 'new' cohort
        dietaryPreference: 'Veg',
        dailyBudgetTier: 'Moderate',
        foodAllergies: [],
      };
      onComplete(finalProfile);
    }, 900);
  };

  // Render Personalisation Summary after step 10
  if (isSummarized) {
    return (
      <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col justify-between p-6 max-w-md mx-auto" id="onboarding-summary-screen">
        <div className="pt-6">
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={handleBack}
              className="p-2 rounded-xl bg-[#171717] border border-[#262626] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <Logo size="sm" />
            <div className="w-9" />
          </div>

          <div className="text-center mb-8">
            <span className="text-xs uppercase tracking-widest text-[#C7FF3D] font-semibold bg-[#171717] px-3 py-1 rounded-full border border-[#262626]">
              Profile Complete
            </span>
            <h1 className="text-2xl font-bold mt-3 text-[#F5F5F5]">YOUR GYMBUDDY PROFILE</h1>
            <p className="text-sm text-[#8A8A8A] mt-1">Here is what we personalized for you</p>
          </div>

          {/* User profile card */}
          <div className="bg-[#171717] border border-[#262626] rounded-2xl p-6 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
              <div>
                <h2 className="text-xl font-bold text-[#F5F5F5]">{name || 'Raj'}</h2>
                <p className="text-xs text-[#8A8A8A] mt-0.5">
                  {age} years · {height} {heightUnit} · {weight} {weightUnit}
                </p>
              </div>
              <div className="w-10 h-10 rounded-full bg-[#202020] border border-[#333] flex items-center justify-center text-sm font-bold text-[#C7FF3D]">
                {name ? name[0].toUpperCase() : 'R'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1 text-sm">
              <div className="p-3 bg-[#111] rounded-xl border border-[#222]">
                <span className="text-[11px] text-[#8A8A8A] block">Goal</span>
                <span className="font-semibold text-[#F5F5F5]">{goal}</span>
              </div>

              <div className="p-3 bg-[#111] rounded-xl border border-[#222]">
                <span className="text-[11px] text-[#8A8A8A] block">Experience</span>
                <span className="font-semibold text-[#F5F5F5]">{experience}</span>
              </div>

              <div className="p-3 bg-[#111] rounded-xl border border-[#222]">
                <span className="text-[11px] text-[#8A8A8A] block">Training</span>
                <span className="font-semibold text-[#F5F5F5]">{schedule} / week</span>
              </div>

              <div className="p-3 bg-[#111] rounded-xl border border-[#222]">
                <span className="text-[11px] text-[#8A8A8A] block">Workout duration</span>
                <span className="font-semibold text-[#F5F5F5]">{duration}</span>
              </div>
            </div>

            <div className="p-3 bg-[#111] rounded-xl border border-[#222] text-sm">
              <span className="text-[11px] text-[#8A8A8A] block">Equipment</span>
              <span className="font-semibold text-[#F5F5F5]">{equipment}</span>
            </div>
          </div>

          {/* Friendly AI Reassurance */}
          <div className="mt-6 p-4 rounded-xl bg-[#121212] border border-[#262626] flex items-start gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#C7FF3D]/15 flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-4 h-4 text-[#C7FF3D]" />
            </div>
            <p className="text-xs text-[#8A8A8A] leading-relaxed">
              <span className="text-[#F5F5F5] font-medium block mb-0.5">GymBuddy AI</span>
              “I’ve got everything I need. I’ve balanced your volume so you build momentum without feeling sore or overwhelmed.”
            </p>
          </div>
        </div>

        <div className="pb-6">
          <button
            onClick={handleFinish}
            disabled={isGenerating}
            className="w-full py-4 px-6 rounded-xl bg-[#C7FF3D] hover:bg-[#b8f52e] active:scale-[0.99] text-black font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C7FF3D]/10"
            id="create-my-workout-btn"
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                Preparing your workout…
              </span>
            ) : (
              <>
                <span>CREATE MY WORKOUT</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-[#F5F5F5] flex flex-col justify-between p-6 max-w-md mx-auto" id="onboarding-step-screen">
      {/* Top Bar */}
      <div>
        <div className="flex items-center justify-between pt-4 mb-6">
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="p-2 rounded-xl bg-[#171717] border border-[#262626] text-[#8A8A8A] hover:text-[#F5F5F5] transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          ) : (
            <div className="w-9" />
          )}

          <div className="text-center">
            <span className="text-[11px] font-semibold tracking-widest text-[#8A8A8A] uppercase">
              LET'S GET TO KNOW YOU
            </span>
            <div className="text-xs font-bold text-[#C7FF3D] mt-0.5">
              {String(step).padStart(2, '0')} / {String(totalSteps).padStart(2, '0')}
            </div>
          </div>

          <button
            onClick={() => setIsSummarized(true)}
            className="text-xs text-[#8A8A8A] hover:text-[#C7FF3D] transition-colors font-medium px-2 py-1"
          >
            Skip
          </button>
        </div>

        {/* Progress line */}
        <div className="w-full h-1 bg-[#171717] rounded-full mb-8 overflow-hidden">
          <div
            className="h-full bg-[#C7FF3D] transition-all duration-300 ease-out"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>

        {/* Step-by-Step Question Views */}
        <div className="space-y-6">
          {step === 1 && (
            <div>
              <h1 className="text-2xl font-bold text-[#F5F5F5]">What should I call you?</h1>
              <p className="text-sm text-[#8A8A8A] mt-1">This is how your AI companion will greet you.</p>
              <div className="mt-6">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  autoFocus
                  className="w-full bg-[#171717] border border-[#262626] focus:border-[#C7FF3D] rounded-xl px-4 py-3.5 text-lg font-medium text-[#F5F5F5] outline-none transition-colors"
                  onKeyDown={(e) => e.key === 'Enter' && handleNext()}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="text-2xl font-bold text-[#F5F5F5]">How old are you?</h1>
              <p className="text-sm text-[#8A8A8A] mt-1">This helps me personalise your experience.</p>
              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setAge(Math.max(14, age - 1))}
                  className="w-12 h-12 rounded-xl bg-[#171717] border border-[#262626] text-xl font-bold hover:bg-[#202020] text-[#F5F5F5]"
                >
                  −
                </button>
                <div className="px-8 py-3 bg-[#171717] border border-[#262626] rounded-xl text-3xl font-bold text-[#C7FF3D] min-w-[120px] text-center">
                  {age}
                </div>
                <button
                  type="button"
                  onClick={() => setAge(Math.min(90, age + 1))}
                  className="w-12 h-12 rounded-xl bg-[#171717] border border-[#262626] text-xl font-bold hover:bg-[#202020] text-[#F5F5F5]"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="text-2xl font-bold text-[#F5F5F5]">How do you identify?</h1>
              <p className="text-sm text-[#8A8A8A] mt-1">Used for metabolic baselines. Kept strictly private.</p>
              <div className="mt-6 space-y-2.5">
                {(['Male', 'Female', 'Non-binary', 'Prefer not to say'] as UserGender[]).map((g) => (
                  <button
                    key={g}
                    type="button"
                    onClick={() => setGender(g)}
                    className={`w-full p-4 rounded-xl border text-left font-medium transition-all flex items-center justify-between ${
                      gender === g
                        ? 'bg-[#171717] border-[#C7FF3D] text-[#F5F5F5]'
                        : 'bg-[#121212] border-[#262626] text-[#8A8A8A] hover:border-[#3a3a3a]'
                    }`}
                  >
                    <span>{g}</span>
                    {gender === g && <Check className="w-5 h-5 text-[#C7FF3D]" />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#F5F5F5]">How tall are you?</h1>
                <div className="flex bg-[#171717] p-1 rounded-lg border border-[#262626]">
                  <button
                    type="button"
                    onClick={() => setHeightUnit('cm')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      heightUnit === 'cm' ? 'bg-[#C7FF3D] text-black' : 'text-[#8A8A8A]'
                    }`}
                  >
                    cm
                  </button>
                  <button
                    type="button"
                    onClick={() => setHeightUnit('ft')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      heightUnit === 'ft' ? 'bg-[#C7FF3D] text-black' : 'text-[#8A8A8A]'
                    }`}
                  >
                    ft
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#8A8A8A] mt-1">Allows us to gauge range of motion guidelines.</p>

              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setHeight(Math.max(120, height - 1))}
                  className="w-12 h-12 rounded-xl bg-[#171717] border border-[#262626] text-xl font-bold hover:bg-[#202020] text-[#F5F5F5]"
                >
                  −
                </button>
                <div className="px-6 py-3 bg-[#171717] border border-[#262626] rounded-xl text-3xl font-bold text-[#C7FF3D] min-w-[140px] text-center">
                  {height} <span className="text-sm font-normal text-[#8A8A8A]">{heightUnit}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setHeight(Math.min(230, height + 1))}
                  className="w-12 h-12 rounded-xl bg-[#171717] border border-[#262626] text-xl font-bold hover:bg-[#202020] text-[#F5F5F5]"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-[#F5F5F5]">What's your current weight?</h1>
                <div className="flex bg-[#171717] p-1 rounded-lg border border-[#262626]">
                  <button
                    type="button"
                    onClick={() => setWeightUnit('kg')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      weightUnit === 'kg' ? 'bg-[#C7FF3D] text-black' : 'text-[#8A8A8A]'
                    }`}
                  >
                    kg
                  </button>
                  <button
                    type="button"
                    onClick={() => setWeightUnit('lb')}
                    className={`px-2.5 py-1 text-xs font-semibold rounded ${
                      weightUnit === 'lb' ? 'bg-[#C7FF3D] text-black' : 'text-[#8A8A8A]'
                    }`}
                  >
                    lb
                  </button>
                </div>
              </div>
              <p className="text-sm text-[#8A8A8A] mt-1">Starting point to measure body recomposition.</p>

              <div className="mt-8 flex items-center justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setWeight(Math.max(30, weight - 1))}
                  className="w-12 h-12 rounded-xl bg-[#171717] border border-[#262626] text-xl font-bold hover:bg-[#202020] text-[#F5F5F5]"
                >
                  −
                </button>
                <div className="px-6 py-3 bg-[#171717] border border-[#262626] rounded-xl text-3xl font-bold text-[#C7FF3D] min-w-[140px] text-center">
                  {weight} <span className="text-sm font-normal text-[#8A8A8A]">{weightUnit}</span>
                </div>
                <button
                  type="button"
                  onClick={() => setWeight(Math.min(200, weight + 1))}
                  className="w-12 h-12 rounded-xl bg-[#171717] border border-[#262626] text-xl font-bold hover:bg-[#202020] text-[#F5F5F5]"
                >
                  +
                </button>
              </div>
            </div>
          )}

          {step === 6 && (
            <div>
              <h1 className="text-2xl font-bold text-[#F5F5F5]">What are you working towards?</h1>
              <p className="text-sm text-[#8A8A8A] mt-1">Choose your primary focus for now.</p>
              <div className="mt-6 space-y-2.5">
                {[
                  { id: 'Build Muscle', label: 'Build Muscle', desc: 'Hypertrophy & tone', icon: Dumbbell },
                  { id: 'Lose Fat', label: 'Lose Fat', desc: 'Burn energy & lean out', icon: Flame },
                  { id: 'Get Stronger', label: 'Get Stronger', desc: 'Lifting heavier milestones', icon: Zap },
                  { id: 'Improve Fitness', label: 'Improve Fitness', desc: 'Stamina & overall health', icon: HeartPulse },
                  { id: 'Stay Active', label: 'Stay Active', desc: 'Healthy habit consistency', icon: Activity },
                ].map((item) => {
                  const Icon = item.icon;
                  const isSelected = goal === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setGoal(item.id as UserGoal)}
                      className={`w-full p-3.5 rounded-xl border text-left font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#171717] border-[#C7FF3D] text-[#F5F5F5]'
                          : 'bg-[#121212] border-[#262626] text-[#8A8A8A] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                            isSelected ? 'bg-[#C7FF3D] text-black' : 'bg-[#1c1c1c] text-[#8A8A8A]'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-[#F5F5F5]">{item.label}</div>
                          <div className="text-xs text-[#8A8A8A]">{item.desc}</div>
                        </div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-[#C7FF3D]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 7 && (
            <div>
              <h1 className="text-2xl font-bold text-[#F5F5F5]">How comfortable are you in the gym?</h1>
              <p className="text-sm text-[#8A8A8A] mt-1">GymBuddy adapts explanations based on this.</p>
              <div className="mt-6 space-y-3">
                {[
                  {
                    id: 'Complete Beginner',
                    title: 'Complete Beginner',
                    subtitle: "I've just started.",
                    badge: 'Recommended',
                  },
                  {
                    id: 'Some Experience',
                    title: 'Some Experience',
                    subtitle: 'I know the basics.',
                  },
                  {
                    id: 'Experienced',
                    title: 'Experienced',
                    subtitle: 'I already have a routine.',
                  },
                ].map((item) => {
                  const isSelected = experience === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setExperience(item.id as UserExperience)}
                      className={`w-full p-4 rounded-xl border text-left transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#171717] border-[#C7FF3D] text-[#F5F5F5]'
                          : 'bg-[#121212] border-[#262626] text-[#8A8A8A] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm text-[#F5F5F5]">{item.title}</span>
                          {item.badge && (
                            <span className="text-[10px] bg-[#C7FF3D]/20 text-[#C7FF3D] px-2 py-0.5 rounded-full font-bold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-[#8A8A8A] mt-0.5 block">{item.subtitle}</span>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-[#C7FF3D]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 8 && (
            <div>
              <h1 className="text-2xl font-bold text-[#F5F5F5]">How often can you realistically train?</h1>
              <p className="text-sm text-[#8A8A8A] mt-1">Realistic consistency beats burn-out every time.</p>
              <div className="mt-6 grid grid-cols-2 gap-3">
                {(['2 days', '3 days', '4 days', '5+ days'] as TrainingSchedule[]).map((s) => {
                  const isSelected = schedule === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSchedule(s)}
                      className={`p-4 rounded-xl border text-center font-semibold transition-all ${
                        isSelected
                          ? 'bg-[#171717] border-[#C7FF3D] text-[#C7FF3D]'
                          : 'bg-[#121212] border-[#262626] text-[#8A8A8A] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <span className="text-lg block">{s}</span>
                      <span className="text-[11px] text-[#8A8A8A] font-normal">per week</span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 9 && (
            <div>
              <h1 className="text-2xl font-bold text-[#F5F5F5]">How much time do you usually have?</h1>
              <p className="text-sm text-[#8A8A8A] mt-1">We will size sets and rest periods to fit your time.</p>
              <div className="mt-6 space-y-2.5">
                {(['20–30 min', '30–45 min', '45–60 min', '60+ min'] as WorkoutDuration[]).map((d) => {
                  const isSelected = duration === d;
                  return (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDuration(d)}
                      className={`w-full p-4 rounded-xl border text-left font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#171717] border-[#C7FF3D] text-[#F5F5F5]'
                          : 'bg-[#121212] border-[#262626] text-[#8A8A8A] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <span>{d}</span>
                      {isSelected && <Check className="w-5 h-5 text-[#C7FF3D]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 10 && (
            <div>
              <h1 className="text-2xl font-bold text-[#F5F5F5]">What do you have access to?</h1>
              <p className="text-sm text-[#8A8A8A] mt-1">We only recommend movements you can actually do.</p>
              <div className="mt-6 space-y-2.5">
                {[
                  { id: 'Full Gym', title: 'Full Gym', desc: 'Barbells, cables, dumbbells, and machines' },
                  { id: 'Basic Gym', title: 'Basic Gym', desc: 'Dumbbells and basic machines' },
                  { id: 'Home Equipment', title: 'Home Equipment', desc: 'Dumbbells or resistance bands' },
                  { id: 'Bodyweight Only', title: 'Bodyweight Only', desc: 'Calisthenics and floor exercises' },
                ].map((item) => {
                  const isSelected = equipment === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setEquipment(item.id as EquipmentAccess)}
                      className={`w-full p-4 rounded-xl border text-left font-medium transition-all flex items-center justify-between ${
                        isSelected
                          ? 'bg-[#171717] border-[#C7FF3D] text-[#F5F5F5]'
                          : 'bg-[#121212] border-[#262626] text-[#8A8A8A] hover:border-[#3a3a3a]'
                      }`}
                    >
                      <div>
                        <div className="font-semibold text-sm text-[#F5F5F5]">{item.title}</div>
                        <div className="text-xs text-[#8A8A8A]">{item.desc}</div>
                      </div>
                      {isSelected && <Check className="w-5 h-5 text-[#C7FF3D]" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="pt-6 pb-4">
        <button
          onClick={handleNext}
          className="w-full py-4 px-6 rounded-xl bg-[#C7FF3D] hover:bg-[#b8f52e] active:scale-[0.99] text-black font-bold text-base flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#C7FF3D]/10"
          id="onboarding-continue-btn"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
