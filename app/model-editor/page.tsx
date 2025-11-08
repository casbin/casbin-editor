'use client';
import { ModelEditor } from '@/app/model-editor/ModelEditor';
import { clsx } from 'clsx';
import { useLang } from '@/app/context/LangContext';

export default function ModelEditorPage() {
  const { theme } = useLang();
  return (
    <main
      className={clsx(
        'flex flex-col h-screen',
        theme === 'dark' ? 'bg-customDark' : 'bg-gradient-to-br from-slate-50 to-slate-100',
      )}
    >
      <ModelEditor />
    </main>
  );
}
