import { StateField, StateEffect, Extension } from '@codemirror/state';
import { Decoration, DecorationSet, EditorView } from '@codemirror/view';

// Define an effect to update highlighted lines
export const setHighlightedLinesEffect = StateEffect.define<number[]>();

// Define the decoration for highlighted lines
const highlightedLineMark = Decoration.line({
  attributes: { class: 'cm-highlighted-line' },
});

// Create a state field to track highlighted lines
const highlightedLinesField = StateField.define<DecorationSet>({
  create() {
    return Decoration.none;
  },
  update(decorations, transaction) {
    // Check if there's an effect to update highlighted lines
    for (const effect of transaction.effects) {
      if (effect.is(setHighlightedLinesEffect)) {
        const lines = effect.value;
        if (lines.length === 0) {
          return Decoration.none;
        }

        const newDecorations: any[] = [];
        const doc = transaction.state.doc;

        lines.forEach((lineNum) => {
          // Line numbers are 1-indexed, but doc.line() expects 1-indexed too
          if (lineNum > 0 && lineNum <= doc.lines) {
            const line = doc.line(lineNum);
            newDecorations.push(highlightedLineMark.range(line.from));
          }
        });

        return Decoration.set(newDecorations);
      }
    }

    // Map existing decorations through document changes
    return decorations.map(transaction.changes);
  },
  provide: (field) => {
    return EditorView.decorations.from(field);
  },
});

// Theme for highlighted lines
const highlightTheme = EditorView.baseTheme({
  '.cm-highlighted-line': {
    backgroundColor: 'rgba(255, 215, 0, 0.3)',
    borderLeft: '3px solid #FFD700',
  },
});

// Export the extension
export function policyHighlightExtension(): Extension {
  return [highlightedLinesField, highlightTheme];
}
