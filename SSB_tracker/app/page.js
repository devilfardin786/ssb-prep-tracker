'use client';

import React, { useState, useEffect } from 'react';
import { CheckCircle2, Circle, AlertCircle, RotateCcw, ShieldCheck, Flame, Calendar } from 'lucide-react';

const TOTAL_WEEKS = 12;

const WEEKLY_TEMPLATE = [
  { day: 'Mon', stage: 'Day 1: Screening', task: '30m OIR Practice + 30m PPDT Story Writing & 60s Narration', tag: 'Stage 1' },
  { day: 'Tue', stage: 'Day 2: Psychology', task: 'Rotating Psych Set (TAT / WAT / SRT / SDT timed sets & peer review)', tag: 'Psych' },
  { day: 'Wed', stage: 'Day 3: GTO Indoors', task: '25m Group Discussion + 35m Group Planning Exercise (GPE) Map Analysis', tag: 'GTO' },
  { day: 'Thu', stage: 'Day 4: GTO & Lecturette', task: '2x Lecturette Speaks (3 min each) + Command Task & PGT Logic Discussion', tag: 'GTO' },
  { day: 'Fri', stage: 'Day 5: PI & Defence', task: '30m CIQ Mock Interview (PIQ Form) + 30m Defense & Geopolitical News', tag: 'Interview' },
];

export default function SSBTracker() {
  const [selectedWeek, setSelectedWeek] = useState(1);
  const [completedTasks, setCompletedTasks] = useState({});
  const [bufferTasks, setBufferTasks] = useState({});
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedCompleted = localStorage.getItem('ssb_completed_tasks');
    const savedBuffer = localStorage.getItem('ssb_buffer_tasks');
    if (savedCompleted) setCompletedTasks(JSON.parse(savedCompleted));
    if (savedBuffer) setBufferTasks(JSON.parse(savedBuffer));
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('ssb_completed_tasks', JSON.stringify(completedTasks));
      localStorage.setItem('ssb_buffer_tasks', JSON.stringify(bufferTasks));
    }
  }, [completedTasks, bufferTasks, mounted]);

  if (!mounted) return null;

  const toggleTask = (week, dayIndex) => {
    const key = `w${week}_d${dayIndex}`;
    setCompletedTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleBuffer = (week, dayIndex) => {
    const key = `w${week}_d${dayIndex}`;
    setBufferTasks((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const resetAll = () => {
    if (confirm('Are you sure you want to reset all progress for Fardin & Mukul?')) {
      setCompletedTasks({});
      setBufferTasks({});
    }
  };

  // Progress Computations
  const totalPossible = TOTAL_WEEKS * 5;
  const totalCompleted = Object.values(completedTasks).filter(Boolean).length;
  const overallPercentage = Math.round((totalCompleted / totalPossible) * 100);

  const currentWeekCompleted = [0, 1, 2, 3, 4].filter((d) => completedTasks[`w${selectedWeek}_d${d}`]).length;
  const weekPercentage = Math.round((currentWeekCompleted / 5) * 100);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-8">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-8 h-8 text-emerald-400" />
            <h1 className="text-2xl font-bold tracking-tight text-white">SSB 90-Day Command Center</h1>
          </div>
          <p className="text-slate-400 text-sm mt-1">Targeting Recommendation | Fardin & Mukul (9:00 PM - 10:00 PM)</p>
        </div>
        <button
          onClick={resetAll}
          className="flex items-center gap-2 text-xs text-rose-400 hover:text-rose-300 border border-rose-900/50 hover:bg-rose-950/30 px-3 py-2 rounded-lg transition"
        >
          <RotateCcw className="w-4 h-4" /> Reset Tracker
        </button>
      </header>

      {/* Progress Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>OVERALL COURSE PROGRESS</span>
            <span className="text-emerald-400 font-bold">{overallPercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${overallPercentage}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-2">{totalCompleted} of {totalPossible} Hours Completed</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl">
          <div className="flex justify-between text-xs text-slate-400 mb-2 font-medium">
            <span>WEEK {selectedWeek} PROGRESS</span>
            <span className="text-cyan-400 font-bold">{weekPercentage}%</span>
          </div>
          <div className="w-full bg-slate-800 h-3 rounded-full overflow-hidden">
            <div className="bg-cyan-500 h-full transition-all duration-300" style={{ width: `${weekPercentage}%` }} />
          </div>
          <p className="text-xs text-slate-500 mt-2">{currentWeekCompleted} of 5 Sessions Done</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-5 rounded-xl flex items-center gap-4">
          <div className="p-3 bg-amber-500/10 rounded-lg text-amber-400">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-200">2-Day Buffer System</h4>
            <p className="text-xs text-slate-400">Sat/Sun are reserved for missed weekday sessions. Keeps schedule stress-free.</p>
          </div>
        </div>
      </div>

      {/* Week Selector */}
      <div className="space-y-3">
        <label className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
          <Calendar className="w-4 h-4" /> Select Week (1 to 12)
        </label>
        <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
          {Array.from({ length: TOTAL_WEEKS }).map((_, i) => {
            const wNum = i + 1;
            const isSelected = selectedWeek === wNum;
            const wCompleted = [0, 1, 2, 3, 4].filter((d) => completedTasks[`w${wNum}_d${d}`]).length === 5;
            return (
              <button
                key={wNum}
                onClick={() => setSelectedWeek(wNum)}
                className={`py-2 text-xs font-semibold rounded-lg border transition ${
                  isSelected
                    ? 'bg-emerald-600 border-emerald-500 text-white'
                    : wCompleted
                    ? 'bg-slate-900 border-emerald-900 text-emerald-400'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                W{wNum}
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Tasks List */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center">
          <h3 className="font-semibold text-slate-200">Week {selectedWeek} Action Plan</h3>
          <span className="text-xs text-slate-400">Cyclic 5-Stage Rotation</span>
        </div>

        <div className="divide-y divide-slate-800">
          {WEEKLY_TEMPLATE.map((item, index) => {
            const taskKey = `w${selectedWeek}_d${index}`;
            const isDone = !!completedTasks[taskKey];
            const isBufferUsed = !!bufferTasks[taskKey];

            return (
              <div key={item.day} className={`p-4 sm:p-6 transition ${isDone ? 'bg-emerald-950/10' : 'hover:bg-slate-800/30'}`}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-start gap-4">
                    <button
                      onClick={() => toggleTask(selectedWeek, index)}
                      className="mt-1 text-slate-400 hover:text-emerald-400 transition"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                      ) : (
                        <Circle className="w-6 h-6 text-slate-600" />
                      )}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-slate-300">{item.day}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-slate-800 border border-slate-700 text-slate-300">
                          {item.stage}
                        </span>
                        {isBufferUsed && (
                          <span className="text-xs px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-400">
                            Cleared via Weekend Buffer
                          </span>
                        )}
                      </div>
                      <p className={`text-sm mt-1 ${isDone ? 'line-through text-slate-500' : 'text-slate-300'}`}>
                        {item.task}
                      </p>
                    </div>
                  </div>

                  {/* Buffer Action */}
                  {!isDone && (
                    <button
                      onClick={() => toggleBuffer(selectedWeek, index)}
                      className={`text-xs px-3 py-1.5 rounded-lg border transition flex items-center gap-1 self-start sm:self-center ${
                        isBufferUsed
                          ? 'bg-amber-950/40 border-amber-800 text-amber-300'
                          : 'border-slate-800 text-slate-500 hover:text-slate-400 hover:border-slate-700'
                      }`}
                    >
                      <AlertCircle className="w-3.5 h-3.5" />
                      {isBufferUsed ? 'Shifted to Weekend' : 'Mark Missed (Shift to Weekend)'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}