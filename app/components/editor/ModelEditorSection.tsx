'use client';
import React, { useRef } from 'react';
import { clsx } from 'clsx';
import CodeMirror from '@uiw/react-codemirror';
import { monokai } from '@uiw/codemirror-theme-monokai';
import { basicSetup } from 'codemirror';
import { indentUnit } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { linter, lintGutter } from '@codemirror/lint';
import { CasbinConfSupport } from '@/app/components/editor/casbin-mode/casbin-conf';
import SidePanelChat from '@/app/components/editor/panels/SidePanelChat';
import { ModelToolbar } from '@/app/components/editor/panels/ModelToolbar';
import { buttonPlugin } from '@/app/components/editor/plugins/ButtonPlugin';
import { extractPageContent } from '@/app/utils/contentExtractor';
import { casbinLinter } from '@/app/utils/casbinLinter';
import { useLang } from '@/app/context/LangContext';

interface ModelEditorSectionProps {
  modelText: string;
  modelKind: string;
  setModelKind: (value: string) => void;
  onModelTextChange: (value: string) => void;
  setRequestResults?: (value: {}) => void;
  showHeader?: boolean;
  showSidePanel?: boolean;
  className?: string;
}

export const ModelEditorSection = ({
  modelText,
  modelKind,
  setModelKind,
  onModelTextChange,
  setRequestResults,
  showHeader = false,
  showSidePanel = true,
  className,
}: ModelEditorSectionProps) => {
  const sidePanelChatRef = useRef<{ openDrawer: (message: string) => void } | null>(null);
  const { t, lang, theme } = useLang();
  const textClass = clsx(theme === 'dark' ? 'text-gray-200' : 'text-gray-800');

  const openDrawerWithMessage = (message: string) => {
    if (sidePanelChatRef.current) {
      sidePanelChatRef.current.openDrawer(message);
    }
  };

  const extractContent = (boxType: string) => {
    const { message } = extractPageContent(boxType, t, lang);
    return message;
  };

  return (
    <div className={clsx('flex flex-col h-full overflow-hidden', className)}>
      {showHeader && (
        <div
          className={clsx(
            'flex items-center gap-3 px-4 py-2 border-b border-border',
            theme === 'dark' ? 'bg-slate-900' : 'bg-white',
          )}
        >
          <img
            src="https://cdn.casbin.org/img/casbin_logo_1024x256.png"
            alt="Casbin Logo"
            className="h-8 w-auto"
          />
          <span className={clsx('text-xl font-semibold', textClass)}>{t('Model Editor')}</span>
        </div>
      )}
      <div className={clsx('flex flex-col h-full overflow-hidden', showHeader ? 'p-4' : '')}>
        <div className={clsx('h-10 pl-2', 'flex items-center justify-start gap-2')}>
          <div className={clsx(textClass, 'font-bold text-lg')}>{t('Model')}</div>
          <ModelToolbar
            modelKind={modelKind}
            setModelKind={setModelKind}
            setRequestResults={setRequestResults || (() => {})}
            setModelTextPersistent={onModelTextChange}
          />
        </div>
        <div className="flex-grow overflow-auto h-full rounded-lg border border-border shadow-sm bg-white dark:bg-slate-800 mt-2">
          <div className="flex flex-col h-full">
            <CodeMirror
              height="100%"
              theme={monokai}
              onChange={onModelTextChange}
              basicSetup={{
                lineNumbers: true,
                highlightActiveLine: true,
                bracketMatching: true,
                indentOnInput: true,
              }}
              extensions={[
                basicSetup,
                CasbinConfSupport(),
                indentUnit.of('    '),
                EditorView.lineWrapping,
                buttonPlugin(openDrawerWithMessage, extractContent, 'model'),
                linter(casbinLinter),
                lintGutter(),
              ]}
              className={'function flex-grow h-[300px]'}
              value={modelText}
            />
          </div>
        </div>
      </div>
      {showSidePanel && <SidePanelChat ref={sidePanelChatRef} />}
    </div>
  );
};
