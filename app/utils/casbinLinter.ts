import { Diagnostic } from '@codemirror/lint';
import { EditorView } from '@codemirror/view';
import { Config } from 'casbin';

export const casbinLinter = (view: EditorView, requiresRoleDefinition: boolean): Diagnostic[] => {
  const diagnostics: Diagnostic[] = [];
  const content = view.state.doc.toString();

  try {
    Config.newConfigFromText(content);
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

  const requiredSections = ['request_definition', 'policy_definition', 'policy_effect', 'matchers'];
  const missingSections = requiredSections.filter((section) => {
    return !content.includes(section);
  });

  if (missingSections.length > 0) {
    diagnostics.push({
      from: 0,
      to: view.state.doc.length,
      severity: 'error',
      message: `Missing required sections: ${missingSections.join(', ')}`,
    });
  }

  if (requiresRoleDefinition && !content.includes('[role_definition]')) {
    diagnostics.push({
      from: 0,
      to: view.state.doc.length,
      severity: 'error',
      message: 'Missing [role_definition] section. matcher result should only be of type boolean, number, or string',
    });
  }

  return diagnostics;
};
