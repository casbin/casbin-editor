import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { getError } from './errorManager';

export const casbinLinter = (view: EditorView): Diagnostic[] => {
  const diagnostics: Diagnostic[] = [];

  const runTestError = getError();
  if (runTestError) {
    diagnostics.push({
      from: 0,
      to: view.state.doc.length,
      severity: 'error',
      message: `${runTestError}`,
    });
  }

  return diagnostics;
};
