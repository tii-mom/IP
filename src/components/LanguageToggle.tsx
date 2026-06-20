import { useI18n } from '../i18n';

export default function LanguageToggle() {
  const { language, setLanguage } = useI18n();

  return (
    <button
      onClick={() => setLanguage(language === 'en' ? 'zh-CN' : 'en')}
      className="text-xs text-slate-405 hover:text-white font-mono transition py-1.5 px-3 border border-slate-800 bg-slate-900/60 hover:bg-slate-900 rounded-lg cursor-pointer flex items-center gap-1.5 select-none"
    >
      <span className={language === 'en' ? 'text-indigo-400 font-bold' : 'text-slate-400'}>EN</span>
      <span className="text-slate-700 font-sans">/</span>
      <span className={language === 'zh-CN' ? 'text-indigo-400 font-bold' : 'text-slate-400'}>中文</span>
    </button>
  );
}
