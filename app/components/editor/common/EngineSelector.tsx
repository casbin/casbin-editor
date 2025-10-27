import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '@/app/context/LangContext';
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'; 
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';
import { EngineType, ENGINES } from '@/app/config/engineConfig';
import type { VersionInfo } from '@/app/components/hooks/useRemoteEnforcer';

interface EngineSelectorProps {
  selectedEngine: EngineType;
  comparisonEngines: EngineType[];
  onEngineChange: (primary: EngineType, comparison: EngineType[]) => void;
  versions: Record<EngineType, VersionInfo>;
  engineGithubLinks: Record<EngineType, string>;
}

export const EngineSelector: React.FC<EngineSelectorProps> = ({ selectedEngine, comparisonEngines, onEngineChange, versions, engineGithubLinks }) => {
  const { t } = useLang();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [isComparisonOpen, setIsComparisonOpen] = useState(false);
  const engines = Object.entries(ENGINES).map(([id, config]) => {
    return {
      id,
      name: config.name,
      version: id === 'node' ? process.env.CASBIN_VERSION : versions[id as EngineType],
    };
  });

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
      <DropdownMenu.Root open={isOpen} onOpenChange={setIsOpen}>          
        <DropdownMenu.Trigger asChild>          
          <button           
            className={          
              "bg-transparent border border-[#e13c3c] rounded px-2 py-1 " +          
              "text-[#e13c3c] focus:outline-none hover:bg-[#e13c3c] hover:text-white " +          
              "w-[200px] sm:w-[360px] text-left flex justify-between items-center"          
            }          
          >          
            <span className="truncate text-sm">          
              {displayText}          
            </span>          
            <svg           
              className={`w-3 h-3 flex-shrink-0 ml-2 transition-transform ${isOpen ? 'rotate-180' : ''}`}           
              fill="currentColor"           
              viewBox="0 0 20 20"          
            >          
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
                    `px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer ` +
                    `rounded outline-none text-sm text-left dark:text-gray-200 ${          
                      selectedEngine === engine.id 
                        ? 'bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-400' 
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
         
      <DropdownMenu.Root open={isComparisonOpen} onOpenChange={setIsComparisonOpen}>        
        <TooltipProvider>          
          <Tooltip>          
            <TooltipTrigger asChild>          
              <DropdownMenu.Trigger asChild>        
                <button          
                  className={          
                    "border border-[#e13c3c] rounded px-2 py-1 text-[#e13c3c] " +          
                    "hover:bg-[#e13c3c] hover:text-white"          
                  }          
                >          
                  <svg className="w-4 h-4" viewBox="0 0 1024 1024" fill="currentColor">          
                    <path d={      
                      "M116.364 837.818h279.272v93.091H23.273V93.091h372.363v93.09H116.364v651.637z " +      
                      "m512 0h93.09v93.091h-93.09v-93.09z m139.636 0h93.09v93.091H768v-93.09z " +      
                      "m139.636 93.091v-93.09h93.091v93.09h-93.09z m0-325.818V512h93.091v93.09h-93.09z " +      
                      "m0 139.636v-93.09h93.091v93.09h-93.09z m0-279.272v-93.091h93.091v93.09h-93.09z " +      
                      "m0-139.637v-93.09h93.091v93.09h-93.09z m0-139.636V93.09h93.091v93.09h-93.09z " +      
                      "m-46.545 0H768V93.09h93.09v93.09z m-139.636 0h-93.091V93.09h93.09v93.09z " +      
                      "M488.727 0h93.091v1024h-93.09V0z"      
                    } />          
                  </svg>          
                </button>          
              </DropdownMenu.Trigger>        
            </TooltipTrigger>          
            <TooltipContent 
              className={
                "bg-white dark:bg-gray-800 text-[#e13c3c] dark:text-[#ff6666] " +
                "border border-[#e13c3c] dark:border-[#ff6666]"
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
                    "px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer rounded outline-none " +    
                    "flex items-center gap-2 dark:text-gray-200"    
                  }        
                >        
                  <input        
                    type="checkbox"        
                    checked={isChecked}        
                    disabled={isSelected}        
                    readOnly        
                    className={      
                      "form-checkbox h-4 w-4 text-[#e13c3c] rounded " +      
                      "border-gray-300 dark:border-gray-600 focus:ring-[#e13c3c] accent-[#e13c3c]"      
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
              className="text-[#e13c3c] hover:text-[#ff4d4d]"          
            >          
              <svg     
                xmlns="http://www.w3.org/2000/svg"     
                width="20"     
                height="20"     
                viewBox="0 0 24 24"     
                fill="currentColor"    
              >          
                <path d={      
                  "M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 " + 
                  "8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416 " +     
                  "-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 " +      
                  "1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 " +      
                  "0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 " +  
                  "1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.30.653 1.653 " +  
                  ".242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 " +  
                  "1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"      
                } />   
              </svg>          
            </a>          
          </TooltipTrigger>          
          <TooltipContent 
            className={
              "bg-white dark:bg-gray-800 text-[#e13c3c] dark:text-[#ff6666] " +
              "border border-[#e13c3c] dark:border-[#ff6666]"
            }
          >          
            <p>{t('View Source Code')}</p>          
          </TooltipContent>          
        </Tooltip>          
      </TooltipProvider>        
    </div>   
  );
};
