import React, { useState, useRef, useEffect } from 'react';
import { useLang } from '@/app/context/LangContext';


interface EngineVersion {
  libVersion: string;
  engineVersion: string;
}

interface EngineConfig {
  id: string;
  name: string;
  version?: string | EngineVersion;
}

interface EngineSelectorProps {
  selectedEngine: string;
  comparisonEngines: string[];
  onEngineChange: (primary: string, comparison: string[]) => void;
  casbinVersion?: string;
  javaVersion?: EngineVersion;
  goVersion?: EngineVersion;
  engineGithubLinks: Record<string, string>;
}

const AVAILABLE_ENGINES = (casbinVersion?: string, javaVersion?: EngineVersion, goVersion?: EngineVersion): EngineConfig[] => {
  return [
    {
      id: 'node',
      name: 'Node-Casbin (NodeJs)',
      version: casbinVersion || '',
    },
    {
      id: 'java',
      name: 'jCasbin (Java)',
      version: javaVersion,
    },
    {
      id: 'go',
      name: 'Casbin (Go)',
      version: goVersion,
    },
  ];
};

export const EngineSelector: React.FC<EngineSelectorProps> = ({
  selectedEngine,
  comparisonEngines,
  onEngineChange,
  casbinVersion,
  javaVersion,
  goVersion,
  engineGithubLinks,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useLang();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const engines = AVAILABLE_ENGINES(casbinVersion, javaVersion, goVersion);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handlePrimaryEngineChange = (engineId: string) => {
    onEngineChange(engineId, []);
  };

  const handleComparisonToggle = (engineId: string) => {
    const newComparison = comparisonEngines.includes(engineId)
      ? comparisonEngines.filter((id) => {
          return id !== engineId;
        })
      : [...comparisonEngines, engineId];
    onEngineChange(selectedEngine, newComparison);
  };

  return (
    <div className="relative flex items-center gap-2" ref={dropdownRef}>
      <select
        className="bg-transparent border border-[#e13c3c] rounded px-2 py-1 text-[#e13c3c] focus:outline-none"
        value={selectedEngine}
        onChange={(e) => {return handlePrimaryEngineChange(e.target.value)}}
      >
        {engines.map((engine) => {return (
          <option key={engine.id} value={engine.id}>
            {engine.name} {!engine.version ? '' : 
              typeof engine.version === 'string' ? engine.version :
              `${engine.version.libVersion} | (CLI ${engine.version.engineVersion})`}
          </option>
        )})}
      </select>

      <button
        onClick={() => {
          return setIsOpen(!isOpen);
        }}
        className="border border-[#e13c3c] rounded px-2 py-1 text-[#e13c3c] hover:bg-[#e13c3c] hover:text-white"
      >
        {t('Compare')}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded shadow-lg z-50">
          <div className="p-2">
            {engines.map((engine) => {
              const isSelected = engine.id === selectedEngine;
              return (
                <label key={engine.id} className="flex items-center gap-2 p-2 hover:bg-gray-100">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected || comparisonEngines.includes(engine.id)}
                      onChange={() => {
                        return handleComparisonToggle(engine.id);
                      }}
                      disabled={isSelected}
                      className="form-checkbox h-4 w-4 text-[#e13c3c] rounded border-gray-300 focus:ring-[#e13c3c] accent-[#e13c3c]"
                    />
                  </div>
                  <span>{engine.name}</span>
                </label>
              );
            })}
          </div>
        </div>
      )}

      <a href={engineGithubLinks[selectedEngine]} target="_blank" rel="noopener noreferrer" className="text-[#e13c3c] hover:text-[#ff4d4d]">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
          {/* eslint-disable-next-line max-len */}
          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
        </svg>
      </a>
    </div>
  );
};
