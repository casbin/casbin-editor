import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { X } from 'lucide-react';
import { extractPageContent } from '@/app/utils/contentExtractor';
import { useLang } from '@/app/context/LangContext';
import { clsx } from 'clsx';

const SidePanelChat = forwardRef<any, { onOpenChange?: (open: boolean) => void; customConfig?: string }>((props, ref) => {
  const { onOpenChange, customConfig } = props;
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [pageContent, setPageContent] = useState('');
  const [boxType, setBoxType] = useState('');
  const { t, lang } = useLang();

  const toggleDrawer = () => {
    const newIsOpen = !isOpen;
    setIsOpen(newIsOpen);
    onOpenChange?.(newIsOpen);
  };

  const openDrawer = (message: string, boxType?: string) => {
    setMessage(message);
    setBoxType(boxType || '');
    setIsOpen(true);
    onOpenChange?.(true);
  };

  useImperativeHandle(ref, () => {
    return {
      openDrawer,
    };
  });

  useEffect(() => {
    if (isOpen && boxType) {
      const { extractedContent, message } = extractPageContent(boxType, t, lang, customConfig);
      setPageContent(extractedContent);
      setMessage(message);
    }
  }, [isOpen, boxType, t, lang, customConfig]);

  return (
    <div
      className={clsx(
        'h-full bg-white shadow-lg',
        'transition-all duration-300',
        isOpen ? 'fixed sm:relative top-0 left-0 w-full sm:w-[500px] z-50' : 'w-0',
      )}
    >
      <div className={isOpen ? 'block h-full' : 'hidden'}>
        <div className="flex items-center justify-between p-4 border-b">
          <a href="https://casdoor.com" target="_blank" rel="noreferrer" className="inline-flex items-center">
            <img src="https://casbin.org/img/casbin.svg" alt="help" className="h-5 w-5 mr-2" />
            <div>AI Assistant</div>
          </a>
          <button onClick={toggleDrawer} className="text-gray-500 hover:text-gray-700">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="flex-1 h-[calc(100%-60px)]">
          <iframe
            id="iframeHelper"
            title="iframeHelper"
            src={`https://ai.casbin.com/?isRaw=1&newMessage=${encodeURIComponent(message)}`}
            className="w-full h-full"
            scrolling="no"
            frameBorder="0"
          />
        </div>
      </div>
    </div>
  );
});

SidePanelChat.displayName = 'SidePanelChat';

export default SidePanelChat;
