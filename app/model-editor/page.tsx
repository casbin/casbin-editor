'use client';
import { ModelEditorPanel } from '@/app/components/editor/panels/ModelEditorPanel';
import { clsx } from 'clsx';
import { useLang } from '@/app/context/LangContext';

export default function ModelEditorPage() {
  const { theme } = useLang();
  
  return (
    <main 
      className={clsx(
        'w-full h-screen p-4',
        theme === 'dark' ? 'bg-customDark' : 'bg-gradient-to-br from-slate-50 to-slate-100',
      )}
    >
      <ModelEditorPanel isIframeMode={true} />
    </main>
  );
}
