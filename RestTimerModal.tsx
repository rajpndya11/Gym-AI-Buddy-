import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipForward, Plus, Sparkles } from 'lucide-react';

interface RestTimerModalProps {
  initialSeconds?: number;
  onFinish: () => void;
  onSkip: () => void;
  nextUpText?: string;
}

export const RestTimerModal: React.FC<RestTimerModalProps> = ({
  initialSeconds = 45,
  onFinish,
  onSkip,
  nextUpText,
}) => {
  const [secondsRemaining, setSecondsRemaining] = useState<number>(initialSeconds);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const totalSeconds = initialSeconds;

  useEffect(() => {
    if (isPaused) return;

    if (secondsRemaining <= 0) {
      onFinish();
      return;
    }

    const timer = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          onFinish();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [secondsRemaining, isPaused, onFinish]);

  const addTime = (secs: number) => {
    setSecondsRemaining((prev) => prev + secs);
  };

  const progressPercent = Math.max(0, Math.min(100, (secondsRemaining / totalSeconds) * 100));

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-end sm:items-center justify-center p-4 transition-all">
      <div
        className="w-full max-w-sm bg-[#171717] border border-[#262626] rounded-3xl p-6 shadow-2xl flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom duration-200"
        id="rest-timer-modal"
      >
        <span className="text-xs uppercase font-bold tracking-widest text-[#C7FF3D] mb-1">
          Recovery Window
        </span>
        <h3 className="text-xl font-bold text-[#F5F5F5]">Rest Period</h3>
        <p className="text-xs text-[#8A8A8A] mt-0.5">Let your ATP restore for maximum effort next set.</p>

        {/* Circular Countdown Ring */}
        <div className="relative w-44 h-44 my-6 flex items-center justify-center">
          <svg className="w-full h-full -rotate-90" viewBox="0 0 120 120">
            {/* Background track */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#222222"
              strokeWidth="6"
            />
            {/* Animated progress ring */}
            <circle
              cx="60"
              cy="60"
              r="52"
              fill="none"
              stroke="#C7FF3D"
              strokeWidth="6"
              strokeDasharray={326.7}
              strokeDashoffset={326.7 - (326.7 * progressPercent) / 100}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-linear"
            />
          </svg>

          <div className="absolute flex flex-col items-center">
            <span className="text-5xl font-black tracking-tight text-[#F5F5F5]">
              {secondsRemaining}
            </span>
            <span className="text-xs text-[#8A8A8A] font-medium tracking-wide">SEC LEFT</span>
          </div>
        </div>

        {/* Next up indicator */}
        {nextUpText && (
          <div className="w-full p-2.5 rounded-xl bg-[#111111] border border-[#262626] mb-5 text-left flex items-center justify-between">
            <span className="text-[11px] text-[#8A8A8A]">Next up:</span>
            <span className="text-xs font-semibold text-[#F5F5F5]">{nextUpText}</span>
          </div>
        )}

        {/* Micro advice from Buddy */}
        <div className="w-full p-3 rounded-xl bg-[#121212] border border-[#262626] mb-5 flex items-center gap-2.5 text-left">
          <Sparkles className="w-4 h-4 text-[#A78BFA] shrink-0" />
          <p className="text-[11px] text-[#8A8A8A] leading-tight">
            <span className="text-[#F5F5F5] font-semibold">Buddy Tip:</span> Slow exhales lower your heart rate 15% faster before your next push.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-3 w-full">
          <button
            onClick={() => addTime(15)}
            className="flex-1 py-3 px-3 rounded-xl bg-[#222222] hover:bg-[#2a2a2a] text-[#F5F5F5] text-xs font-semibold flex items-center justify-center gap-1.5 border border-[#333] transition-colors"
          >
            <Plus className="w-3.5 h-3.5 text-[#C7FF3D]" />
            <span>+15s</span>
          </button>

          <button
            onClick={() => setIsPaused(!isPaused)}
            className="w-12 h-12 rounded-xl bg-[#222222] hover:bg-[#2a2a2a] text-[#F5F5F5] flex items-center justify-center border border-[#333] transition-colors"
          >
            {isPaused ? <Play className="w-5 h-5 text-[#C7FF3D]" /> : <Pause className="w-5 h-5" />}
          </button>

          <button
            onClick={onSkip}
            className="flex-1 py-3 px-3 rounded-xl bg-[#C7FF3D] hover:bg-[#bbf335] text-black text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-md shadow-[#C7FF3D]/10"
          >
            <span>Skip Rest</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
