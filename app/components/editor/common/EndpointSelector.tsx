import React from 'react';
import { clsx } from 'clsx';
import { Link } from 'lucide-react';
import { DEFAULT_ENDPOINT } from '@/app/components/hooks/useRemoteEnforcer';
import { useLang } from '@/app/context/LangContext';
import { useAutoCarousel } from '@/app/context/AutoCarouselContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

const ENDPOINTS = [DEFAULT_ENDPOINT, 'demo.casdoor.com'];

export const EndpointSelector: React.FC = () => {
  const { t } = useLang();
  const { disableAutoCarousel } = useAutoCarousel();
  const [isOpen, setIsOpen] = React.useState(false);
  const storedEndpoint = window.localStorage.getItem('casbinEndpoint') || DEFAULT_ENDPOINT;
  const [selectedEndpoint, setSelectedEndpoint] = React.useState(storedEndpoint);
  const [customEndpoint, setCustomEndpoint] = React.useState(ENDPOINTS.includes(storedEndpoint) ? '' : storedEndpoint);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      return document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      disableAutoCarousel();
    }
    setIsOpen(open);
  };

  const handleEndpointSelect = (value: string) => {
    setSelectedEndpoint(value);
    window.localStorage.setItem('casbinEndpoint', value);
    setIsOpen(false);
  };

  const handleCustomEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    disableAutoCarousel();
    const value = e.target.value;
    setCustomEndpoint(value);

    if (value) {
      setSelectedEndpoint(value);
      window.localStorage.setItem('casbinEndpoint', value);
    } else {
      setSelectedEndpoint(DEFAULT_ENDPOINT);
      window.localStorage.setItem('casbinEndpoint', DEFAULT_ENDPOINT);
    }
  };

  return (
    <div className="relative inline-block" ref={dropdownRef}>
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => {
                handleOpenChange(!isOpen);
              }}
              className="border border-[#e13c3c] rounded px-2 py-1 text-[#e13c3c] hover:bg-[#e13c3c] hover:text-white flex items-center gap-1"
            >
              <Link className="w-4 h-4" />
            </button>
          </TooltipTrigger>
          <TooltipContent 
            className={
              "bg-white dark:bg-gray-800 text-[#e13c3c] dark:text-[#ff6666] " +
              "border border-[#e13c3c] dark:border-[#ff6666]"
            }
          >
            <p>{t('Select Endpoint')}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      {isOpen && (
        <div
          className="fixed mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded shadow-lg z-[100]"
          style={{
            top: 'auto',
            left: 'auto',
            transform: 'translateY(2px)',
          }}
        >
          <div className="p-2 min-w-[200px]">
            {ENDPOINTS.map((endpoint) => {
              const isSelected = endpoint === selectedEndpoint;
              return (
                <label key={endpoint} className="flex items-center gap-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        return handleEndpointSelect(endpoint);
                      }}
                      className={
                        "form-checkbox h-4 w-4 text-[#e13c3c] rounded " +
                        "border-gray-300 dark:border-gray-600 focus:ring-[#e13c3c] accent-[#e13c3c]"
                      }
                    />
                  </div>
                  <span className="text-sm whitespace-nowrap dark:text-gray-200">{endpoint}</span>
                </label>
              );
            })}
            <div className="p-2 border-t dark:border-gray-700">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    checked={
                      !ENDPOINTS.some((e) => {
                        return e === selectedEndpoint;
                      })
                    }
                    onChange={() => {}}
                    className={
                      "form-checkbox h-4 w-4 text-[#e13c3c] rounded " +
                      "border-gray-300 dark:border-gray-600 focus:ring-[#e13c3c] accent-[#e13c3c]"
                    }
                  />
                </div>
                <input
                  type="text"
                  value={customEndpoint}
                  onChange={handleCustomEndpointChange}
                  placeholder={t('Enter custom endpoint')}
                  className={clsx(
                    'border border-gray-300 dark:border-gray-600 rounded',
                    'px-2 py-1',
                    'text-sm',
                    'flex-1',
                    'focus:outline-none focus:ring-2 focus:ring-[#e13c3c]',
                    'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100',
                    'placeholder:text-gray-500 dark:placeholder:text-gray-400'
                  )}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
