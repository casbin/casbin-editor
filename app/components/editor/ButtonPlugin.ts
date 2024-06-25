import { WidgetType, EditorView, Decoration } from '@codemirror/view';
import { RangeSetBuilder } from '@codemirror/state';

type OpenDrawerCallback = (message: string) => void;

class ButtonWidget extends WidgetType {
  openDrawerCallback: OpenDrawerCallback;
  extractContentCallback: (boxType: string) => string;
  boxType: string;

  constructor(openDrawerCallback: OpenDrawerCallback, extractContentCallback: (boxType: string) => string, boxType: string) {
    super();
    this.openDrawerCallback = openDrawerCallback;
    this.extractContentCallback = extractContentCallback;
    this.boxType = boxType;
  }

  toDOM() {
    const button = document.createElement('button');
    button.className = `flex items-center rounded text-[#453d7d] px-1 border border-[#453d7d] 
      bg-[#efefef] hover:bg-[#453d7d] hover:text-white transition-colors duration-500 
      font-medium whitespace-nowrap overflow-hidden`;
    button.innerHTML = '<img src="/openai.svg" alt="" class="w-4 h-4 mr-1" /> Ask AI';
    button.style.position = 'absolute';
    button.style.right = '1px';
    button.style.top = '1px';

    button.addEventListener('click', () => {
      if (this.openDrawerCallback) {
        const extractedContent = this.extractContentCallback(this.boxType);
        this.openDrawerCallback(extractedContent);
      }
    });

    return button;
  }
}

export function buttonPlugin(openDrawerCallback: OpenDrawerCallback, extractContentCallback: (boxType: string) => string, boxType: string) {
  return EditorView.decorations.compute([], (state) => {
    const builder = new RangeSetBuilder<Decoration>();
    builder.add(0, 0, Decoration.widget({ widget: new ButtonWidget(openDrawerCallback, extractContentCallback, boxType) }));
    return builder.finish();
  });
}
