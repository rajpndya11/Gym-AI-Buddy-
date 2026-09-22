import React, { useState } from 'react';
import { UserProfile, UserCohort } from '../types';
import {
  User,
  Settings,
  Scale,
  Bell,
  Shield,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Check,
  Smartphone,
  Eye,
  Camera,
  Activity,
  X,
  Utensils,
  Leaf,
  DollarSign,
} from 'lucide-react';
import { DietaryPreference, BudgetTier } from '../types';
import { Logo } from './Logo';

interface ProfileScreenProps {
  user: UserProfile;
  onUpdateUser: (updated: UserProfile) => void;
  onResetOnboarding: () => void;
  onSelectCohort: (cohort: UserCohort) => void;
}

export const ProfileScreen: React.FC<ProfileScreenProps> = ({
  user,
  onUpdateUser,
  onResetOnboarding,
  onSelectCohort,
}) => {
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nameInput, setNameInput] = useState<string>(user.name);
  const [weightInput, setWeightInput] = useState<number>(user.weight);
  const [showResetConfirm, setShowResetConfirm] = useState<boolean>(false);

  const toggleWeightUnit = () => {
    const nextUnit = user.weightUnit === 'kg' ? 'lb' : 'kg';
    const nextWeight = nextUnit === 'lb' ? Math.round(user.weight * 2.20462) : Math.round(user.weight / 2.20462);
    onUpdateUser({
      ...user,
      weightUnit: nextUnit,
      weight: nextWeight,
    });
  };

  const toggleHeightUnit = () => {
    const nextUnit = user.heightUnit === 'cm' ? 'ft' : 'cm';
    onUpdateUser({
      ...user,
      heightUnit: nextUnit,
    });
  };

  const handleSaveProfile = () => {
    onUpdateUser({
      ...user,
      name: nameInput.trim() || user.name,
      weight: Number(weightInput) || user.weight,
    });
    setIsEditing(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto" id="profile-screen-root">
      {/* Top Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <span className="text-xs uppercase font-extrabold tracking-widest text-[#8A8A8A]">
            ACCOUNT & CONFIGURATION
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F5F5] mt-1">
            YOUR PROFILE
          </h1>
        </div>
        <Logo size="sm" showWordmark={false} />
      </div>

      {/* User Identity Card */}
      <div className="bg-[#171717] border border-[#262626] rounded-3xl p-5 mb-5 shadow-xl">
        <div className="flex items-center justify-between pb-4 border-b border-[#262626]">
          <div className="flex items-center gap-3.5">
            <div className="w-14 h-14 rounded-2xl bg-[#202020] border border-[#333] flex items-center justify-center text-xl font-black text-[#C7FF3D]">
              {user.name ? user.name[0].toUpperCase() : 'R'}
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#F5F5F5]">{user.name}</h2>
              <p className="text-xs text-[#8A8A8A] mt-0.5">
                {user.age} yrs · {user.height} {user.heightUnit} · {user.weight} {user.weightUnit}
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1.5 rounded-xl bg-[#222222] hover:bg-[#2b2b2b] text-xs font-semibold text-[#C7FF3D] border border-[#333] transition-colors"
            id="edit-profile-btn"
          >
            Edit
          </button>
        </div>

        {/* Core Parameters */}
        <div className="grid grid-cols-2 gap-3 pt-4 text-xs">
          <div className="p-3 rounded-xl bg-[#111] border border-[#222]">
            <span className="text-[#8A8A8A] text-[11px] block">Your Goal</span>
            <span className="text-[#F5F5F5] font-bold mt-0.5 block">{user.goal}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#111] border border-[#222]">
            <span className="text-[#8A8A8A] text-[11px] block">Experience Level</span>
            <span className="text-[#F5F5F5] font-bold mt-0.5 block">{user.experience}</span>
          </div>

          <div className="p-3 rounded-xl bg-[#111] border border-[#222]">
            <span className="text-[#8A8A8A] text-[11px] block">Training Schedule</span>
            <span className="text-[#F5F5F5] font-bold mt-0.5 block">{user.schedule} / week</span>
          </div>

          <div className="p-3 rounded-xl bg-[#111] border border-[#222]">
            <span className="text-[#8A8A8A] text-[11px] block">Workout Duration</span>
            <span className="text-[#F5F5F5] font-bold mt-0.5 block">{user.duration}</span>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-[#111] border border-[#222] text-xs mt-3">
          <span className="text-[#8A8A8A] text-[11px] block">Equipment Available</span>
          <span className="text-[#F5F5F5] font-bold mt-0.5 block">{user.equipment}</span>
        </div>
      </div>

      {/* DIET & NUTRITION PREFERENCES */}
      <div className="bg-[#171717] border border-[#262626] rounded-3xl p-5 mb-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-[#C7FF3D]/10 text-[#C7FF3D] flex items-center justify-center">
              <Utensils className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
              DIET & NUTRITION PREFERENCES
            </h3>
          </div>
        </div>

        <div className="space-y-3">
          <div>
            <span className="text-[11px] text-[#8A8A8A] block mb-1.5 font-semibold">Food Preference</span>
            <div className="grid grid-cols-4 gap-1.5">
              {(['Veg', 'Non-Veg', 'Vegan', 'Eggitarian'] as DietaryPreference[]).map((pref) => (
                <button
                  key={pref}
                  onClick={() => onUpdateUser({ ...user, dietaryPreference: pref })}
                  className={`py-2 px-1 text-xs font-bold rounded-xl transition-all text-center ${
                    (user.dietaryPreference || 'Veg') === pref
                      ? 'bg-[#C7FF3D] text-black shadow-sm'
                      : 'bg-[#121212] border border-[#262626] text-[#8A8A8A] hover:text-[#F5F5F5]'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
          </div>

          <div>
            <span className="text-[11px] text-[#8A8A8A] block mb-1.5 font-semibold">Daily Food Budget Tier</span>
            <div className="grid grid-cols-3 gap-1.5">
              {(['Budget', 'Moderate', 'Premium'] as BudgetTier[]).map((tier) => (
                <button
                  key={tier}
                  onClick={() => onUpdateUser({ ...user, dailyBudgetTier: tier })}
                  className={`py-2 px-1 text-xs font-bold rounded-xl transition-all text-center ${
                    (user.dailyBudgetTier || 'Moderate') === tier
                      ? 'bg-[#C7FF3D] text-black shadow-sm'
                      : 'bg-[#121212] border border-[#262626] text-[#8A8A8A] hover:text-[#F5F5F5]'
                  }`}
                >
                  {tier === 'Budget' ? '₹ Budget' : tier === 'Moderate' ? '₹₹ Balanced' : '₹₹₹ Premium'}
                </button>
              ))}
            </div>
          </div>

          {user.foodAllergies && user.foodAllergies.length > 0 && (
            <div className="p-2.5 rounded-xl bg-[#111] border border-[#222]">
              <span className="text-[10px] text-[#8A8A8A] uppercase font-bold block mb-1">Active Allergies</span>
              <div className="flex flex-wrap gap-1">
                {user.foodAllergies.map((a) => (
                  <span key={a} className="text-[11px] font-medium px-2 py-0.5 rounded-md bg-[#EF4444]/15 text-[#FCA5A5] border border-[#EF4444]/30">
                    {a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Cohort Demo Selector */}
      <div className="bg-[#171717] border border-[#262626] rounded-3xl p-5 mb-5 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
            COHORT PERSONALISATION SIMULATOR
          </h3>
          <span className="text-[10px] text-[#C7FF3D] font-bold bg-[#1a2e0a] border border-[#C7FF3D]/30 px-2 py-0.5 rounded">
            PROTOTYPE DEMO
          </span>
        </div>
        <p className="text-xs text-[#8A8A8A] mb-3">
          Switch between states to see GymBuddy's adaptive AI messaging and workouts:
        </p>

        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'new', label: 'New User', desc: 'First workout guidance' },
            { id: 'returning', label: 'Returning User', desc: 'Progression ready' },
            { id: 'consistent', label: 'Consistent User', desc: '4 workouts streak' },
            { id: 'inactive', label: 'After Inactivity', desc: '20-min ease-in restart' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectCohort(item.id as UserCohort)}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                user.cohort === item.id
                  ? 'bg-[#222] border-[#C7FF3D] text-[#F5F5F5]'
                  : 'bg-[#121212] border-[#262626] text-[#8A8A8A] hover:border-[#333]'
              }`}
            >
              <div className="text-xs font-bold text-[#F5F5F5] flex items-center justify-between">
                <span>{item.label}</span>
                {user.cohort === item.id && <Check className="w-3.5 h-3.5 text-[#C7FF3D]" />}
              </div>
              <span className="text-[10px] text-[#8A8A8A] block mt-0.5">{item.desc}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Preferences & Settings */}
      <div className="bg-[#171717] border border-[#262626] rounded-3xl p-5 mb-5 shadow-lg space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A] mb-2">
          PREFERENCES & UNITS
        </h3>

        {/* Weight Unit */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#121212] border border-[#222]">
          <div className="flex items-center gap-2.5">
            <Scale className="w-4 h-4 text-[#C7FF3D]" />
            <span className="text-xs font-semibold text-[#F5F5F5]">Weight Unit</span>
          </div>
          <button
            onClick={toggleWeightUnit}
            className="text-xs font-bold bg-[#202020] border border-[#333] px-3 py-1 rounded-lg text-[#C7FF3D] hover:bg-[#282828] transition-colors"
          >
            {user.weightUnit.toUpperCase()}
          </button>
        </div>

        {/* Height Unit */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#121212] border border-[#222]">
          <div className="flex items-center gap-2.5">
            <Settings className="w-4 h-4 text-[#C7FF3D]" />
            <span className="text-xs font-semibold text-[#F5F5F5]">Height Unit</span>
          </div>
          <button
            onClick={toggleHeightUnit}
            className="text-xs font-bold bg-[#202020] border border-[#333] px-3 py-1 rounded-lg text-[#C7FF3D] hover:bg-[#282828] transition-colors"
          >
            {user.heightUnit.toUpperCase()}
          </button>
        </div>

        {/* Notifications Mock */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#121212] border border-[#222]">
          <div className="flex items-center gap-2.5">
            <Bell className="w-4 h-4 text-[#8A8A8A]" />
            <span className="text-xs font-semibold text-[#F5F5F5]">Workout Reminders</span>
          </div>
          <span className="text-[11px] text-[#C7FF3D] font-medium">8:00 AM (Training Days)</span>
        </div>

        {/* Privacy */}
        <div className="flex items-center justify-between p-3 rounded-xl bg-[#121212] border border-[#222]">
          <div className="flex items-center gap-2.5">
            <Shield className="w-4 h-4 text-[#8A8A8A]" />
            <span className="text-xs font-semibold text-[#F5F5F5]">Data Privacy & Security</span>
          </div>
          <span className="text-[11px] text-[#8A8A8A]">Local Storage Encrypted</span>
        </div>
      </div>

      {/* V2 Possibilities Section (Prompt Sec 23: Visually show future possibilities) */}
      <div className="bg-[#141414] border border-[#262626] rounded-3xl p-5 mb-5 shadow-lg">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
            GYMBUDDY ROADMAP (V2 PREVIEW)
          </h3>
          <span className="text-[10px] text-[#A78BFA] font-bold bg-[#A78BFA]/10 border border-[#A78BFA]/20 px-2 py-0.5 rounded">
            COMING SOON
          </span>
        </div>
        <p className="text-xs text-[#8A8A8A] mb-3">
          Advanced modules being engineered for upcoming releases:
        </p>

        <div className="space-y-2 text-xs">
          <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#262626] flex items-center justify-between opacity-80">
            <div className="flex items-center gap-2.5">
              <Camera className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-[#F5F5F5] font-medium">Camera-Based Form Analysis</span>
            </div>
            <span className="text-[10px] text-[#8A8A8A]">AI Vision</span>
          </div>

          <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#262626] flex items-center justify-between opacity-80">
            <div className="flex items-center gap-2.5">
              <Smartphone className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-[#F5F5F5] font-medium">Smartwatch & Wearables Sync</span>
            </div>
            <span className="text-[10px] text-[#8A8A8A]">Heart Rate</span>
          </div>

          <div className="p-3 rounded-xl bg-[#1a1a1a] border border-[#262626] flex items-center justify-between opacity-80">
            <div className="flex items-center gap-2.5">
              <Activity className="w-4 h-4 text-[#A78BFA]" />
              <span className="text-[#F5F5F5] font-medium">Real-Time Voice Coaching</span>
            </div>
            <span className="text-[10px] text-[#8A8A8A]">Audio Guidance</span>
          </div>
        </div>
      </div>

      {/* Reset Progress Action */}
      <div className="pt-2">
        <button
          onClick={() => setShowResetConfirm(true)}
          className="w-full py-3.5 px-4 rounded-2xl bg-[#171717] hover:bg-[#202020] text-[#FF5C5C] font-semibold text-xs flex items-center justify-center gap-2 border border-[#FF5C5C]/20 transition-colors"
          id="reset-onboarding-flow-btn"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Progress & Re-take Onboarding</span>
        </button>
      </div>

      {/* Edit Profile Modal */}
      {isEditing && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-[#171717] border border-[#262626] rounded-3xl p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#F5F5F5]">Edit Profile</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="p-1.5 rounded-lg bg-[#222] text-[#8A8A8A]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs text-[#8A8A8A] block mb-1">Name</label>
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full bg-[#111] border border-[#262626] rounded-xl px-3.5 py-2.5 text-sm text-[#F5F5F5] outline-none focus:border-[#C7FF3D]"
                />
              </div>

              <div>
                <label className="text-xs text-[#8A8A8A] block mb-1">
                  Weight ({user.weightUnit})
                </label>
                <input
                  type="number"
                  value={weightInput}
                  onChange={(e) => setWeightInput(Number(e.target.value))}
                  className="w-full bg-[#111] border border-[#262626] rounded-xl px-3.5 py-2.5 text-sm text-[#F5F5F5] outline-none focus:border-[#C7FF3D]"
                />
              </div>
            </div>

            <div className="mt-6 flex gap-2">
              <button
                onClick={() => setIsEditing(false)}
                className="flex-1 py-2.5 rounded-xl bg-[#222] text-xs font-semibold text-[#8A8A8A]"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="flex-1 py-2.5 rounded-xl bg-[#C7FF3D] text-xs font-bold text-black"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-[#171717] border border-[#262626] rounded-2xl p-5 shadow-2xl text-center">
            <h3 className="text-lg font-bold text-[#F5F5F5]">Reset Progress?</h3>
            <p className="text-xs text-[#8A8A8A] mt-1.5">
              This will restart the onboarding flow and clear local workout history.
            </p>
            <div className="mt-5 space-y-2">
              <button
                onClick={() => {
                  setShowResetConfirm(false);
                  onResetOnboarding();
                }}
                className="w-full py-2.5 rounded-xl bg-[#FF5C5C] text-white font-bold text-sm"
              >
                Reset & Restart
              </button>
              <button
                onClick={() => setShowResetConfirm(false)}
                className="w-full py-2.5 rounded-xl bg-[#222] text-[#8A8A8A] font-semibold text-sm"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
