import { Zap, BookOpen, Users } from 'lucide-react';

export interface Mentor {
  id: string;
  name: string;
  lens: string;
  focus: string;
}

export const MENTORS: Mentor[] = [
  { id: 'elon_musk', name: 'Elon Musk', lens: 'Musk-style Scale Lens', focus: '10x scaling, automation leverage, mission depth' },
  { id: 'steve_jobs', name: 'Steve Jobs', lens: 'Jobs-style Positioning Lens', focus: 'Clarity, product soul, category sharpness' },
  { id: 'naval_ravikant', name: 'Naval Ravikant', lens: 'Naval-style Solo Leverage Lens', focus: 'Solo founder fit, code & content leverage moats' },
  { id: 'mark_zuckerberg', name: 'Mark Zuckerberg', lens: 'Zuckerberg-style Growth Lens', focus: 'Viral loops, retention hook, network effects' },
  { id: 'jeff_bezos', name: 'Jeff Bezos', lens: 'Bezos-style Flywheel Lens', focus: 'Customer obsession, data moats, scale flywheels' },
  { id: 'larry_ellison', name: 'Larry Ellison', lens: 'Ellison-style Enterprise Lens', focus: 'Enterprise readiness, raw corporate pricing power' }
];

interface MentorSelectorProps {
  analysisMode: 'quick_scan' | 'single_mentor' | 'mentor_board';
  setAnalysisMode: (mode: 'quick_scan' | 'single_mentor' | 'mentor_board') => void;
  selectedMentors: string[];
  setSelectedMentors: (mentors: string[]) => void;
}

export default function MentorSelector({
  analysisMode,
  setAnalysisMode,
  selectedMentors,
  setSelectedMentors,
}: MentorSelectorProps) {

  const toggleMentor = (id: string) => {
    if (analysisMode === 'single_mentor') {
      setSelectedMentors([id]);
    } else if (analysisMode === 'mentor_board') {
      if (selectedMentors.includes(id)) {
        setSelectedMentors(selectedMentors.filter(m => m !== id));
      } else {
        // Limit board to 3 mentors maximum
        if (selectedMentors.length < 3) {
          setSelectedMentors([...selectedMentors, id]);
        }
      }
    }
  };

  const handleModeChange = (mode: 'quick_scan' | 'single_mentor' | 'mentor_board') => {
    setAnalysisMode(mode);
    if (mode === 'quick_scan') {
      setSelectedMentors(['naval_ravikant']);
    } else if (mode === 'single_mentor') {
      setSelectedMentors(['steve_jobs']);
    } else if (mode === 'mentor_board') {
      setSelectedMentors(['elon_musk', 'steve_jobs', 'naval_ravikant']);
    }
  };

  return (
    <div className="space-y-6 bg-slate-900/60 border border-slate-800 p-5 sm:p-6 rounded-2xl">
      <div className="space-y-1">
        <h3 className="text-xs font-bold font-mono text-slate-400 uppercase tracking-wider">
          1. Select Assessment Mode
        </h3>
        <p className="text-[10px] text-slate-500">
          Costs vary depending on depth of analysis and mentor count.
        </p>
      </div>

      {/* Mode Select Buttons */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <button
          type="button"
          onClick={() => handleModeChange('quick_scan')}
          className={`p-4 rounded-xl border flex flex-col items-center justify-between text-center transition cursor-pointer ${
            analysisMode === 'quick_scan'
              ? 'bg-indigo-600/10 border-indigo-500 text-white'
              : 'bg-slate-950 border-slate-800 text-slate-450 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Zap className="h-5 w-5 mb-2 text-indigo-400" />
          <span className="text-xs font-bold font-mono uppercase block">Quick Scan</span>
          <span className="text-[9px] font-mono text-indigo-300 mt-1 block">3 Credits</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('single_mentor')}
          className={`p-4 rounded-xl border flex flex-col items-center justify-between text-center transition cursor-pointer ${
            analysisMode === 'single_mentor'
              ? 'bg-indigo-600/10 border-indigo-500 text-white'
              : 'bg-slate-950 border-slate-800 text-slate-450 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <BookOpen className="h-5 w-5 mb-2 text-cyan-400" />
          <span className="text-xs font-bold font-mono uppercase block">Single Mentor</span>
          <span className="text-[9px] font-mono text-cyan-300 mt-1 block">5 Credits</span>
        </button>

        <button
          type="button"
          onClick={() => handleModeChange('mentor_board')}
          className={`p-4 rounded-xl border flex flex-col items-center justify-between text-center transition cursor-pointer ${
            analysisMode === 'mentor_board'
              ? 'bg-indigo-600/10 border-indigo-500 text-white'
              : 'bg-slate-950 border-slate-800 text-slate-450 hover:bg-slate-800 hover:text-white'
          }`}
        >
          <Users className="h-5 w-5 mb-2 text-emerald-400" />
          <span className="text-xs font-bold font-mono uppercase block">Mentor Board</span>
          <span className="text-[9px] font-mono text-emerald-300 mt-1 block">12 Credits</span>
        </button>
      </div>

      {/* Mentor Board Lenses Selection Area */}
      {analysisMode !== 'quick_scan' && (
        <div className="space-y-4 pt-4 border-t border-slate-950">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">
              {analysisMode === 'single_mentor' ? 'Choose 1 Business Mentor Lens:' : 'Select up to 3 Board Mentors Lenses:'}
            </span>
            <span className="text-[9px] text-slate-500 font-mono">
              Selected: {selectedMentors.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {MENTORS.map((m) => {
              const active = selectedMentors.includes(m.id);
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => toggleMentor(m.id)}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between h-24 cursor-pointer ${
                    active
                      ? 'bg-indigo-600/10 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-450 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold font-mono block">{m.name}</span>
                    <span className="text-[9px] text-slate-500 font-mono block leading-none mt-1">{m.lens}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-sans leading-tight mt-2 block truncate w-full">
                    {m.focus}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
