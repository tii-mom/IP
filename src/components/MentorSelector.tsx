import { Zap, BookOpen, Users } from 'lucide-react';
import { useI18n } from '../i18n';

export interface Mentor {
  id: string;
}

export const MENTOR_IDS = [
  'elon_musk',
  'steve_jobs',
  'naval_ravikant',
  'mark_zuckerberg',
  'jeff_bezos',
  'larry_ellison'
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
  const { t, language } = useI18n();

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
          {t.mentorSelector.title}
        </h3>
        <p className="text-[10px] text-slate-500">
          {t.mentorSelector.subtitle}
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
          <span className="text-xs font-bold font-mono uppercase block">{t.mentorSelector.quickScan}</span>
          <span className="text-[9px] font-mono text-indigo-300 mt-1 block">3 {language === 'zh-CN' ? '积分' : 'Credits'}</span>
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
          <span className="text-xs font-bold font-mono uppercase block">{t.mentorSelector.singleMentor}</span>
          <span className="text-[9px] font-mono text-cyan-300 mt-1 block">5 {language === 'zh-CN' ? '积分' : 'Credits'}</span>
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
          <span className="text-xs font-bold font-mono uppercase block">{t.mentorSelector.mentorBoard}</span>
          <span className="text-[9px] font-mono text-emerald-300 mt-1 block">12 {language === 'zh-CN' ? '积分' : 'Credits'}</span>
        </button>
      </div>

      {/* Mentor Board Lenses Selection Area */}
      {analysisMode !== 'quick_scan' && (
        <div className="space-y-4 pt-4 border-t border-slate-950">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-slate-400 font-mono uppercase font-bold tracking-wider">
              {analysisMode === 'single_mentor' ? t.mentorSelector.chooseOne : t.mentorSelector.chooseUpToThree}
            </span>
            <span className="text-[9px] text-slate-500 font-mono">
              {language === 'zh-CN' ? '已选择' : 'Selected'}: {selectedMentors.length}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {MENTOR_IDS.map((mentorId) => {
              const active = selectedMentors.includes(mentorId);
              const mInfo = t.mentorSelector.mentors[mentorId] || { name: mentorId, lens: mentorId, focus: '' };
              return (
                <button
                  key={mentorId}
                  type="button"
                  onClick={() => toggleMentor(mentorId)}
                  className={`p-3.5 rounded-xl border text-left transition flex flex-col justify-between h-24 cursor-pointer ${
                    active
                      ? 'bg-indigo-600/10 border-indigo-500 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-450 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <div>
                    <span className="text-xs font-bold font-mono block">{mInfo.name}</span>
                    <span className="text-[9px] text-slate-500 font-mono block leading-none mt-1">{mInfo.lens}</span>
                  </div>
                  <span className="text-[9px] text-slate-400 font-sans leading-tight mt-2 block truncate w-full">
                    {mInfo.focus}
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
