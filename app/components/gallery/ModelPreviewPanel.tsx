// Copyright 2024 The casbin Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use client';
import React from 'react';
import { useRouter } from 'next/navigation';
import { clsx } from 'clsx';
import { ExternalLink } from 'lucide-react';
import { useLang } from '@/app/context/LangContext';
import { example } from '@/app/components/editor/casbin-mode/example';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/app/components/ui/sheet';

interface ModelPreviewPanelProps {
  modelKey: string | null;
  modelName: string;
  modelDescription: string;
  modelCategory: string;
  isOpen: boolean;
  onClose: () => void;
}

export const ModelPreviewPanel: React.FC<ModelPreviewPanelProps> = ({
  modelKey,
  modelName,
  modelDescription,
  modelCategory,
  isOpen,
  onClose,
}) => {
  const { theme, t } = useLang();
  const router = useRouter();

  const modelData = modelKey ? example[modelKey] : null;

  const handleOpenInEditor = () => {
    if (modelKey) {
      router.push(`/?model=${modelKey}`);
      onClose();
    }
  };

  const textClass = clsx(theme === 'dark' ? 'text-gray-200' : 'text-gray-800');
  const bgClass = clsx(theme === 'dark' ? 'bg-slate-900' : 'bg-white');
  const sectionBgClass = clsx(theme === 'dark' ? 'bg-slate-800' : 'bg-slate-50');
  const borderClass = clsx(theme === 'dark' ? 'border-slate-700' : 'border-slate-200');

  return (
    <Sheet
      open={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          onClose();
        }
      }}
    >
      <SheetContent side="right" className={clsx('overflow-y-auto', bgClass, textClass)}>
        <SheetHeader className="mb-6">
          <div className="flex items-center justify-between gap-4">
            <SheetTitle className={clsx('text-2xl', textClass)}>{t(modelName)}</SheetTitle>
            <span
              className={clsx(
                'px-3 py-1 text-sm font-medium rounded-lg',
                'bg-primary/10 text-primary whitespace-nowrap',
              )}
            >
              {t(modelCategory)}
            </span>
          </div>
          <SheetDescription className={clsx('text-base', textClass, 'opacity-70')}>
            {t(modelDescription)}
          </SheetDescription>
        </SheetHeader>

        {modelData && (
          <div className="space-y-6 pb-20">
            {/* Model Configuration */}
            <section>
              <h3 className={clsx('text-lg font-semibold mb-3', textClass)}>
                {t('Model Configuration')}
              </h3>
              <div className={clsx('rounded-lg border p-4', borderClass, sectionBgClass)}>
                <pre
                  className={clsx(
                    'text-sm whitespace-pre-wrap break-words font-mono',
                    textClass,
                  )}
                >
                  {modelData.model}
                </pre>
              </div>
            </section>

            {/* Example Policies */}
            {modelData.policy && (
              <section>
                <h3 className={clsx('text-lg font-semibold mb-3', textClass)}>
                  {t('Example Policies')}
                </h3>
                <div className={clsx('rounded-lg border p-4', borderClass, sectionBgClass)}>
                  <pre
                    className={clsx(
                      'text-sm whitespace-pre-wrap break-words font-mono',
                      textClass,
                    )}
                  >
                    {modelData.policy}
                  </pre>
                </div>
              </section>
            )}

            {/* Example Request */}
            {modelData.request && (
              <section>
                <h3 className={clsx('text-lg font-semibold mb-3', textClass)}>
                  {t('Example Request')}
                </h3>
                <div className={clsx('rounded-lg border p-4', borderClass, sectionBgClass)}>
                  <pre
                    className={clsx(
                      'text-sm whitespace-pre-wrap break-words font-mono',
                      textClass,
                    )}
                  >
                    {modelData.request}
                  </pre>
                </div>
              </section>
            )}

            {/* Custom Configuration */}
            {modelData.customConfig && (
              <section>
                <h3 className={clsx('text-lg font-semibold mb-3', textClass)}>
                  {t('Custom Configuration')}
                </h3>
                <div className={clsx('rounded-lg border p-4', borderClass, sectionBgClass)}>
                  <pre
                    className={clsx(
                      'text-sm whitespace-pre-wrap break-words font-mono',
                      textClass,
                    )}
                  >
                    {modelData.customConfig}
                  </pre>
                </div>
              </section>
            )}
          </div>
        )}

        {/* Footer with Open in Editor button */}
        <SheetFooter
          className={clsx(
            'fixed bottom-0 right-0 left-0 p-6 border-t',
            bgClass,
            borderClass,
          )}
        >
          <button
            onClick={handleOpenInEditor}
            className={clsx(
              'w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-lg',
              'text-base font-semibold transition-all duration-200',
              'bg-primary text-primary-foreground',
              'hover:bg-primary/90 hover:shadow-lg',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2',
            )}
          >
            <ExternalLink className="w-5 h-5" />
            {t('Open in Editor')}
          </button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};
