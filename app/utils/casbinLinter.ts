import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { getError } from '@/app/utils/errorManager';
import { ErrorType } from '@/app/utils/errorHandler';
import { validatePolicy } from '@/app/utils/policyValidator';

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

/**
 * Creates a policy linter that validates policy lines against model definitions
 * @param modelText - The model text to validate against
 * @returns A linter function for CodeMirror
 */
export function createPolicyLinter(modelText: string) {
  return (view: EditorView): Diagnostic[] => {
    const diagnostics: Diagnostic[] = [];
    
    // First, check for enforcement errors from the error manager
    const error = getError();
    if (error && error.type === ErrorType.POLICY) {
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

    // Then, perform policy validation
    const policyText = view.state.doc.toString();
    const validationErrors = validatePolicy(policyText, modelText);
    
    for (const validationError of validationErrors) {
      try {
        const line = view.state.doc.line(validationError.line);
        diagnostics.push({
          from: line.from,
          to: line.to,
          severity: 'error',
          message: validationError.message,
        });
      } catch (e) {
        // Line number might be out of range, skip this error
      }
    }

    return diagnostics;
  };
}

export const casbinLinter = createLinter(ErrorType.MODEL);
export const policyLinter = createLinter(ErrorType.POLICY);
export const requestLinter = createLinter(ErrorType.REQUEST);
