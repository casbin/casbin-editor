import React, { useState, useRef } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLang } from '@/app/context/LangContext';
import { useAutoCarousel } from '@/app/context/AutoCarouselContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';
import { EngineType, ENGINES } from '@/app/config/engineConfig';
import type { VersionInfo } from '@/app/components/hooks/useRemoteEnforcer';
import { clsx } from 'clsx';

interface EngineSelectorProps {
  selectedEngine: EngineType;
  comparisonEngines: EngineType[];
  onEngineChange: (primary: EngineType, comparison: EngineType[]) => void;
  versions: Record<EngineType, VersionInfo>;
  engineGithubLinks: Record<EngineType, string>;
  compactMode?: boolean;
}

export const EngineSelector: React.FC<EngineSelectorProps> = ({
  selectedEngine,
  comparisonEngines,
  onEngineChange,
  versions,
  engineGithubLinks,
  compactMode = false,
}) => {
  const { t, theme } = useLang();
  const iconFilterClass = theme === 'dark' ? 'filter invert' : '';
  const { disableAutoCarousel } = useAutoCarousel();
  const [isOpen, setIsOpen] = useState(false);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const engines = Object.entries(ENGINES).map(([id, config]) => {
    return {
      id,
      name: config.name,
      version: id === 'node' ? process.env.CASBIN_VERSION : versions[id as EngineType],
    };
  });

  const handleOpenChange = (open: boolean) => {
    if (open) {
      disableAutoCarousel();
    }
    setIsOpen(open);
  };

  const handleComparisonOpenChange = (open: boolean) => {
    if (open) {
      disableAutoCarousel();
    }
    setIsComparisonOpen(open);
  };

  const handlePrimaryEngineChange = (engineId: string) => {
    onEngineChange(engineId as EngineType, []);
    setIsOpen(false);
  };

  const handleComparisonToggle = (engineId: string) => {
    const newComparison = comparisonEngines.includes(engineId as EngineType)
      ? comparisonEngines.filter((id) => {
          return id !== engineId;
        })
      : [...comparisonEngines, engineId as EngineType];
    onEngineChange(selectedEngine, newComparison);
  };
  const selectedEngineData = engines.find((engine) => {    
    return engine.id === selectedEngine;    
  });          
  const displayText = selectedEngineData           
    ? `${selectedEngineData.name} ${          
        !selectedEngineData.version          
          ? ''          
          : typeof selectedEngineData.version === 'string'          
            ? selectedEngineData.version          
            : `${selectedEngineData.version.libVersion} | (CLI ${selectedEngineData.version.engineVersion})`          
      }`          
    : selectedEngine;    

  return (
    <div className="relative flex items-center gap-2">
      <DropdownMenu.Root open={isOpen} onOpenChange={handleOpenChange}>
        <DropdownMenu.Trigger asChild>
          <button
            className={
              'bg-secondary border border-primary rounded-lg px-2 py-1 ' +
              'text-primary focus:outline-none hover:bg-primary hover:text-primary-foreground ' +
              (compactMode ? 'w-[150px]' : 'w-[200px] sm:w-[360px]') +
              ' text-left flex justify-between items-center transition-all duration-200'
            }
          >
            <span className="truncate text-sm">{displayText}</span>
            <ChevronDown
              className={`w-3 h-3 flex-shrink-0 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}
            />
          </button>
        </DropdownMenu.Trigger>          
                  
        <DropdownMenu.Content           
          sideOffset={5}           
          className={          
            "bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50 " +          
            "max-h-[40vh] overflow-y-auto min-w-[200px] sm:min-w-[360px]"          
          }          
        >          
          <div className="p-2">          
            {engines.map((engine) => {          
              return (          
                <DropdownMenu.Item          
                  key={engine.id}          
                  onSelect={() => {          
                    return handlePrimaryEngineChange(engine.id);          
                  }}          
                  className={          
                    `px-3 py-2 hover:bg-primary/20 dark:hover:bg-primary/30 cursor-pointer ` +
                    `rounded outline-none text-sm text-left dark:text-gray-200 ${          
                      selectedEngine === engine.id 
                        ? 'bg-primary/10 text-primary font-medium' 
                        : ''          
                    }`          
                  }          
                >          
                  {engine.name}{' '}          
                  {!engine.version          
                    ? ''          
                    : typeof engine.version === 'string'          
                      ? engine.version          
                      : `${engine.version.libVersion} | (CLI ${engine.version.engineVersion})`}          
                </DropdownMenu.Item>          
              );          
            })}          
          </div>          
        </DropdownMenu.Content>          
      </DropdownMenu.Root>          
         
      <DropdownMenu.Root open={isComparisonOpen} onOpenChange={handleComparisonOpenChange}>        
        <TooltipProvider>          
          <Tooltip>          
            <TooltipTrigger asChild>          
              <DropdownMenu.Trigger asChild>        
                <button          
                  className={          
                    "border border-primary rounded-lg px-2 py-1 text-primary bg-secondary " +          
                    "hover:bg-primary hover:text-primary-foreground transition-all duration-200 " +
                    "flex items-center justify-center"          
                  }          
                >
                  <span
                    className={clsx('w-4 h-4 inline-flex items-center justify-center')}
                    style={{
                      maskImage: "url('/compareEngines.svg')",
                      maskRepeat: 'no-repeat',
                      maskSize: 'contain',
                      maskPosition: 'center center',
                      backgroundColor: 'currentColor',
                      transition: 'opacity 0.2s, filter 0.5s',
                    }}
                  />
                </button>          
              </DropdownMenu.Trigger>        
            </TooltipTrigger>          
            <TooltipContent 
              className={
                "bg-white dark:bg-gray-800 text-primary " +
                "border border-primary"
              }
            >          
              <p>{t('Compare Engines')}</p>          
            </TooltipContent>          
          </Tooltip>          
        </TooltipProvider>        
        
        <DropdownMenu.Content         
          sideOffset={5}         
          align="end"        
          className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-lg z-50 min-w-[200px]"        
        >        
          <div className="p-2">        
            {engines.map((engine) => {        
              const isSelected = engine.id === selectedEngine;        
              const isChecked = isSelected || comparisonEngines.includes(engine.id as EngineType);        
                      
              return (        
                <DropdownMenu.Item        
                  key={engine.id}        
                  onSelect={(event) => {        
                    event.preventDefault();         
                    return handleComparisonToggle(engine.id);        
                  }}        
                  className={    
                    "px-3 py-2 hover:bg-primary/20 dark:hover:bg-primary/30 cursor-pointer rounded outline-none " +    
                    "flex items-center gap-2 dark:text-gray-200"    
                  }        
                >        
                  <input        
                    type="checkbox"        
                    checked={isChecked}        
                    disabled={isSelected}        
                    readOnly        
                    className={      
                      "form-checkbox h-4 w-4 text-primary rounded " +      
                      "border-gray-300 dark:border-gray-600 focus:ring-primary accent-primary"      
                    }      
                  />        
                  <span className={isSelected ? 'text-gray-500 dark:text-gray-400' : ''}>{engine.name}</span>        
                </DropdownMenu.Item>        
              );        
            })}        
          </div>        
        </DropdownMenu.Content>        
      </DropdownMenu.Root>        
        
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <a
              href={engineGithubLinks[selectedEngine]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 transition-colors group"
            >
              <span
                className={clsx('w-5 h-5 inline-flex items-center justify-center transition-opacity duration-200 group-hover:opacity-80')}
                style={{
                  maskImage: "url('/github.svg')",
                  maskRepeat: 'no-repeat',
                  maskSize: 'contain',
                  maskPosition: 'center center',
                  backgroundColor: 'currentColor',
                  transition: 'opacity 0.2s, filter 0.5s',
                  verticalAlign: 'middle',
                }}
              />
            </a>
          </TooltipTrigger>
          <TooltipContent 
            className={
              "bg-white dark:bg-gray-800 text-primary " +
              "border border-primary"
            }
          >          
            <p>{t('View Source Code')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
};
