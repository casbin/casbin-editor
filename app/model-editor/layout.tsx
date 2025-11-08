'use client';
import React from 'react';
import { LangProvider } from '@/app/context/LangContext';

export default function ModelEditorLayout({ children }: { children: React.ReactNode }) {
  return <LangProvider>{children}</LangProvider>;
}
