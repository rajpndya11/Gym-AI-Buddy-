import React from 'react';
import { MOCK_STRENGTH_PROGRESS, MOCK_WORKOUT_LOGS } from '../data/mockData';
import { TrendingUp, Award, Calendar, CheckCircle2, Dumbbell, ArrowUpRight } from 'lucide-react';

export const ProgressScreen: React.FC = () => {
  // Weekly / Monthly workouts completion chart data
  const monthlyData = [
    { week: 'W1', count: 3, target: 4, height: '75%' },
    { week: 'W2', count: 4, target: 4, height: '100%' },
    { week: 'W3', count: 3, target: 4, height: '75%' },
    { week: 'W4', count: 4, target: 4, height: '100%' },
  ];

  return (
    <div className="pb-24 pt-4 px-4 max-w-md mx-auto" id="progress-screen-root">
      {/* Header */}
      <div className="mb-6">
        <span className="text-xs uppercase font-extrabold tracking-widest text-[#8A8A8A]">
          CONSISTENCY & METRICS
        </span>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-[#F5F5F5] mt-1">
          YOUR PROGRESS
        </h1>
        <p className="text-xs text-[#8A8A8A] mt-1">
          Beginner milestones built one workout at a time.
        </p>
      </div>

      {/* Large Main Metric: 08 Workouts Completed */}
      <div className="bg-[#171717] border border-[#262626] rounded-3xl p-6 mb-5 shadow-xl">
        <div className="flex items-baseline gap-3">
          <span className="text-5xl sm:text-6xl font-black text-[#F5F5F5] tracking-tight">
            08
          </span>
          <div>
            <span className="text-sm font-bold text-[#C7FF3D] block uppercase tracking-wider">
              Workouts
            </span>
            <span className="text-xs text-[#8A8A8A]">completed this cycle</span>
          </div>
        </div>

        {/* Consistency Bar */}
        <div className="mt-6 pt-5 border-t border-[#262626]">
          <div className="flex items-center justify-between text-xs mb-2">
            <span className="font-semibold text-[#8A8A8A] uppercase tracking-wider">
              CONSISTENCY
            </span>
            <span className="font-extrabold text-[#C7FF3D] text-sm">82%</span>
          </div>
          <div className="w-full h-2.5 bg-[#101010] rounded-full overflow-hidden p-0.5 border border-[#262626]">
            <div
              className="h-full bg-[#C7FF3D] rounded-full transition-all duration-500"
              style={{ width: '82%' }}
            />
          </div>
          <p className="text-[11px] text-[#8A8A8A] mt-2">
            Higher consistency than 78% of beginner gym-goers this month.
          </p>
        </div>
      </div>

      {/* WORKOUTS THIS MONTH Chart */}
      <div className="bg-[#171717] border border-[#262626] rounded-3xl p-5 mb-5 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
            WORKOUTS THIS MONTH
          </h3>
          <span className="text-xs font-semibold text-[#F5F5F5]">14 sessions total</span>
        </div>

        {/* Minimal Bar Chart */}
        <div className="flex items-end justify-between h-36 pt-4 pb-2 px-3 bg-[#111] rounded-2xl border border-[#222]">
          {monthlyData.map((item, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2 flex-1">
              <span className="text-[10px] font-bold text-[#C7FF3D]">{item.count}/4</span>
              <div className="w-9 bg-[#1a1a1a] rounded-t-lg h-24 flex items-end overflow-hidden p-1">
                <div
                  className="w-full bg-[#C7FF3D] rounded-t-md transition-all duration-500"
                  style={{ height: item.height }}
                />
              </div>
              <span className="text-[11px] font-semibold text-[#8A8A8A]">{item.week}</span>
            </div>
          ))}
        </div>
      </div>

      {/* STRENGTH PROGRESS */}
      <div className="bg-[#171717] border border-[#262626] rounded-3xl p-5 mb-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
            STRENGTH PROGRESS
          </h3>
          <span className="text-xs text-[#C7FF3D] font-bold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% Overall</span>
          </span>
        </div>

        <div className="space-y-3">
          {MOCK_STRENGTH_PROGRESS.map((lift) => (
            <div
              key={lift.exerciseName}
              className="p-3.5 rounded-2xl bg-[#121212] border border-[#222222] flex items-center justify-between"
            >
              <div>
                <h4 className="text-sm font-bold text-[#F5F5F5]">{lift.exerciseName}</h4>
                <div className="flex items-center gap-2 mt-0.5 text-xs">
                  <span className="text-[#8A8A8A]">{lift.initialWeight} {lift.unit}</span>
                  <span className="text-[#8A8A8A]">→</span>
                  <span className="text-[#F5F5F5] font-bold">{lift.currentWeight} {lift.unit}</span>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-[#C7FF3D] bg-[#1a2e0a] border border-[#C7FF3D]/30 px-2.5 py-1 rounded-lg inline-flex items-center gap-0.5">
                  <ArrowUpRight className="w-3 h-3" />
                  {lift.trend}
                </span>
                <span className="text-[10px] text-[#8A8A8A] block mt-1">
                  Next target: {lift.targetWeight} {lift.unit}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PERSONAL BESTS & Log history */}
      <div className="bg-[#171717] border border-[#262626] rounded-3xl p-5 shadow-lg">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-[#8A8A8A]">
            RECENT WORKOUT WINS
          </h3>
          <Award className="w-4 h-4 text-[#C7FF3D]" />
        </div>

        <div className="space-y-2.5">
          {MOCK_WORKOUT_LOGS.map((log) => (
            <div
              key={log.id}
              className="p-3 rounded-xl bg-[#121212] border border-[#222222] flex items-center justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h5 className="text-xs font-semibold text-[#F5F5F5]">{log.title}</h5>
                  <span className="text-[10px] text-[#8A8A8A] bg-[#1a1a1a] px-1.5 py-0.5 rounded">
                    {log.date}
                  </span>
                </div>
                <span className="text-[11px] text-[#C7FF3D] font-medium block mt-0.5">
                  ★ {log.highlightWin}
                </span>
              </div>
              <div className="text-right text-[11px] text-[#8A8A8A]">
                {log.durationMin}m · {log.setsCompleted} sets
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
