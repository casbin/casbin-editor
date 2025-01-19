import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { getError } from './errorManager';
import { ErrorType } from './errorHandler';

function createLinter(errorType: ErrorType) {
  return (view: EditorView): Diagnostic[] => {
    const diagnostics: Diagnostic[] = [];
    const error = getError();

    if (error && error.type === errorType) {
      if (error.line) {
        const line = view.state.doc.line(error.line);
        diagnostics.push({
          from: line.from,
          to: line.to,
          severity: 'error',
          message: error.message,
        });
      } else {
        diagnostics.push({
          from: 0,
          to: view.state.doc.length,
          severity: 'error',
          message: error.message,
        });
      }
    }

    return diagnostics;
  };
}

export const casbinLinter = createLinter(ErrorType.MODEL);
export const policyLinter = createLinter(ErrorType.POLICY);
export const requestLinter = createLinter(ErrorType.REQUEST);
