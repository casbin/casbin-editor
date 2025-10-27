import { clsx } from 'clsx';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'; 
import { FileUploadButton } from '@/app/components/editor/common/FileUploadButton';
import { example } from '@/app/components/editor/casbin-mode/example';
import { useLang } from '@/app/context/LangContext';

interface ModelSelectorProps {
  modelKind: string;
  setModelKind: (value: string) => void;
  setRequestResults: (value: {}) => void;
  setModelTextPersistent: (value: string) => void;
}

export const ModelToolbar = ({ modelKind, setModelKind, setRequestResults, setModelTextPersistent }: ModelSelectorProps) => {
  const { t } = useLang();

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
              {/* Default option */}    
              <DropdownMenu.Item    
                onSelect={() => {    
                  setModelKind('');    
                  setRequestResults({});    
                }}    
                className={  
                  "px-3 py-2 hover:bg-secondary cursor-pointer rounded " +  
                  "text-muted-foreground outline-none text-sm transition-colors dark:text-gray-300"  
                }  
              >    
                {t('Select your model')}    
              </DropdownMenu.Item>    
                  
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
                      `px-3 py-2 hover:bg-secondary cursor-pointer rounded outline-none text-sm transition-colors dark:text-gray-200 ${    
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
      </div>    
    </div> 
  );
};
