import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { getError } from './errorManager';

export const casbinLinter = (view: EditorView): Diagnostic[] => {
  const diagnostics: Diagnostic[] = [];

  const runTestError = getError();
  if (runTestError) {
    const lineMatch = runTestError.match(/line (\d+)/);
    if (lineMatch) {
      const errorLine = parseInt(lineMatch[1], 10);
      const line = view.state.doc.line(errorLine);
      diagnostics.push({
        from: line.from,
        to: line.to,
        severity: 'error',
        message: runTestError,
      });
    } else {
      diagnostics.push({
        from: 0,
        to: view.state.doc.length,
        severity: 'error',
        message: runTestError,
      });
    }
  }

  return diagnostics;
};
