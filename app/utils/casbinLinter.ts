import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { Config } from 'casbin';

export const casbinLinter = (view: EditorView): Diagnostic[] => {
  const diagnostics: Diagnostic[] = [];
  try {
    Config.newConfigFromText(view.state.doc.toString());
  } catch (e) {
    const error = e as Error;
    const lineMatch = error.message.match(/line (\d+)/);
    if (lineMatch) {
      const errorLine = parseInt(lineMatch[1], 10);
      const line = view.state.doc.line(errorLine);
      diagnostics.push({
        from: line.from,
        to: line.to,
        severity: 'error',
        message: error.message,
      });
    }
  }
  return diagnostics;
};
