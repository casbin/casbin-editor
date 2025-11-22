import { clsx } from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'; 
import * as Switch from '@radix-ui/react-switch';
import { FileUploadButton } from '@/app/components/editor/common/FileUploadButton';
import { example } from '@/app/components/editor/casbin-mode/example';
import { useLang } from '@/app/context/LangContext';
import { useEffect, useMemo, useRef, useState } from 'react';

interface ModelSelectorProps {
  modelKind: string;
  setModelKind: (value: string) => void;
  setRequestResults: (value: {}) => void;
  setModelTextPersistent: (value: string) => void;
}

export const ModelToolbar = ({ modelKind, setModelKind, setRequestResults, setModelTextPersistent }: ModelSelectorProps) => {
  const { t } = useLang();
  const [autoCarouselEnabled, setAutoCarouselEnabled] = useState(() => {
    // Initialize from localStorage if available, otherwise default to true
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('autoCarouselEnabled');
        if (saved !== null) {
          return saved === 'true';
        }
      } catch (error) {
        // If localStorage access fails (e.g., private browsing), use default value
        console.warn('Failed to read from localStorage:', error);
      }
    }
    return true;
  });
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const modelKeys = useMemo(() => {
    return Object.keys(example);
  }, []);

  // Save auto carousel state to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('autoCarouselEnabled', String(autoCarouselEnabled));
      } catch (error) {
        // If localStorage is full or unavailable, log but don't crash
        console.warn('Failed to save to localStorage:', error);
      }
    }
  }, [autoCarouselEnabled]);

  // Auto carousel logic
  useEffect(() => {
    if (autoCarouselEnabled) {
      intervalRef.current = setInterval(() => {
        const currentIndex = modelKeys.indexOf(modelKind);
        // If current model is not found, start from the beginning
        const nextIndex = currentIndex === -1 ? 0 : (currentIndex + 1) % modelKeys.length;
        const nextModelKind = modelKeys[nextIndex];
        setModelKind(nextModelKind);
        setRequestResults({});
      }, 5000);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [autoCarouselEnabled, modelKind, modelKeys, setModelKind, setRequestResults]);

  return (
   <div className="flex-1 overflow-x-auto">    
      <div className="flex items-center gap-2 min-w-max">    
        {/* Radix UI Dropdown Menu with adjusted proportions */}    
        <DropdownMenu.Root>    
          <DropdownMenu.Trigger asChild>    
            {/* Longer and narrower button for better proportions */}    
            <button   
              className={clsx(
                "border-border border rounded-lg w-[300px] sm:w-[380px]",
                "h-9 px-3 py-2 text-left bg-white dark:bg-slate-700 hover:bg-secondary",
                "flex justify-between items-center shadow-sm hover:shadow transition-all duration-200",
                "text-gray-900 dark:text-gray-100",
              )}
            >    
              <span className="truncate text-sm">    
                {modelKind ? example[modelKind]?.name : t('Select your model')}    
              </span>    
              {/* Dropdown arrow icon */}    
              <svg className="w-3 h-3 flex-shrink-0 ml-2" fill="currentColor" viewBox="0 0 20 20">    
                <path   
                  fillRule="evenodd"   
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"   
                  clipRule="evenodd"   
                />    
              </svg>    
            </button>    
          </DropdownMenu.Trigger>    
              
          <DropdownMenu.Content     
            sideOffset={5}     
            className={  
              "bg-white dark:bg-slate-800 rounded-lg border border-border shadow-xl z-50 " +  
              "max-h-[90vh] overflow-y-auto min-w-[300px] sm:min-w-[380px]"  
            }  
          >    
            <div className="p-2">    
              {/* Model options */}    
              {Object.keys(example).map((n) => {  
                return (  
                  <DropdownMenu.Item    
                    key={n}    
                    onSelect={() => {    
                      setModelKind(n);    
                      setRequestResults({});    
                    }}    
                    className={
                      `px-3 py-2 hover:bg-primary/20 dark:hover:bg-primary/30 cursor-pointer ` +
                      `rounded outline-none text-sm transition-colors dark:text-gray-200 ${
                        modelKind === n ? 'bg-primary/10 text-primary font-medium' : ''
                      }`
                    }  
                  >    
                    {example[n]?.name || n}    
                  </DropdownMenu.Item>    
                );  
              })}    
            </div>    
          </DropdownMenu.Content>    
        </DropdownMenu.Root>    
    
        <button    
          className={clsx(    
            'rounded-lg',    
            'text-primary',    
            'px-3 py-1',    
            'border border-primary',    
            'bg-secondary',    
            'hover:bg-primary hover:text-primary-foreground',    
            'transition-all duration-200',
            'shadow-sm hover:shadow-md',
            'font-medium text-sm',
          )}    
          onClick={() => {    
            const ok = window.confirm('Confirm Reset?');    
            if (ok) {    
              window.location.reload();    
            }    
          }}    
        >    
          {t('RESET')} 
        </button>

        {/* Auto Carousel Switch */}
        <div className="flex items-center gap-2">
          <label
            htmlFor="auto-carousel-switch"
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {t('Auto')}
          </label>
          <Switch.Root
            id="auto-carousel-switch"
            checked={autoCarouselEnabled}
            onCheckedChange={setAutoCarouselEnabled}
            className={clsx(
              'w-[42px] h-[25px] rounded-full relative',
              'shadow-sm border',
              'transition-colors duration-200',
              'data-[state=checked]:bg-primary data-[state=unchecked]:bg-gray-300',
              'data-[state=checked]:border-primary data-[state=unchecked]:border-gray-400',
              'dark:data-[state=unchecked]:bg-gray-600 dark:data-[state=unchecked]:border-gray-500',
              'cursor-pointer',
            )}
          >
            <Switch.Thumb
              className={clsx(
                'block w-[21px] h-[21px] bg-white rounded-full',
                'shadow-lg transition-transform duration-200',
                'translate-x-0.5 data-[state=checked]:translate-x-[19px]',
              )}
            />
          </Switch.Root>
        </div>
      </div>    
    </div> 
  );
};
