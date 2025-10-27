import React from 'react';
import { clsx } from 'clsx';
import { DEFAULT_ENDPOINT } from '@/app/components/hooks/useRemoteEnforcer';
import { useLang } from '@/app/context/LangContext';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/app/components/ui/tooltip';

const ENDPOINTS = [DEFAULT_ENDPOINT, 'demo.casdoor.com'];

export const EndpointSelector: React.FC = () => {
  const { t } = useLang();
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

  const handleEndpointSelect = (value: string) => {
    setSelectedEndpoint(value);
    window.localStorage.setItem('casbinEndpoint', value);
    setIsOpen(false);
  };

  const handleCustomEndpointChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
                return setIsOpen(!isOpen);
              }}
              className="border border-[#e13c3c] rounded px-2 py-1 text-[#e13c3c] hover:bg-[#e13c3c] hover:text-white flex items-center gap-1"
            >
              <svg className="w-4 h-4" viewBox="0 0 1024 1024" fill="currentColor">
                {/* eslint-disable-next-line max-len */}
                <path d="M607.934444 417.856853c-6.179746-6.1777-12.766768-11.746532-19.554358-16.910135l-0.01228 0.011256c-6.986111-6.719028-16.47216-10.857279-26.930349-10.857279-21.464871 0-38.864146 17.400299-38.864146 38.864146 0 9.497305 3.411703 18.196431 9.071609 24.947182l-0.001023 0c0.001023 0.001023 0.00307 0.00307 0.005117 0.004093 2.718925 3.242857 5.953595 6.03853 9.585309 8.251941 3.664459 3.021823 7.261381 5.997598 10.624988 9.361205l3.203972 3.204995c40.279379 40.229237 28.254507 109.539812-12.024871 149.820214L371.157763 796.383956c-40.278355 40.229237-105.761766 40.229237-146.042167 0l-3.229554-3.231601c-40.281425-40.278355-40.281425-105.809861 0-145.991002l75.93546-75.909877c9.742898-7.733125 15.997346-19.668968 15.997346-33.072233 0-23.312962-18.898419-42.211381-42.211381-42.211381-8.797363 0-16.963347 2.693342-23.725354 7.297197-0.021489-0.045025-0.044002-0.088004-0.066515-0.134053l-0.809435 0.757247c-2.989077 2.148943-5.691629 4.669346-8.025791 7.510044l-78.913281 73.841775c-74.178443 74.229608-74.178443 195.632609 0 269.758863l3.203972 3.202948c74.178443 74.127278 195.529255 74.127278 269.707698 0l171.829484-171.880649c74.076112-74.17435 80.357166-191.184297 6.282077-265.311575L607.934444 417.856853z" />
                {/* eslint-disable-next-line max-len */}
                <path d="M855.61957 165.804257l-3.203972-3.203972c-74.17742-74.178443-195.528232-74.178443-269.706675 0L410.87944 334.479911c-74.178443 74.178443-78.263481 181.296089-4.085038 255.522628l3.152806 3.104711c3.368724 3.367701 6.865361 6.54302 10.434653 9.588379 2.583848 2.885723 5.618974 5.355985 8.992815 7.309476 0.025583 0.020466 0.052189 0.041956 0.077771 0.062422l0.011256-0.010233c5.377474 3.092431 11.608386 4.870938 18.257829 4.870938 20.263509 0 36.68962-16.428158 36.68962-36.68962 0-5.719258-1.309832-11.132548-3.645017-15.95846l0 0c-4.850471-10.891048-13.930267-17.521049-20.210297-23.802102l-3.15383-3.102664c-40.278355-40.278355-24.982998-98.79612 15.295358-139.074476l171.930791-171.830507c40.179095-40.280402 105.685018-40.280402 145.965419 0l3.206018 3.152806c40.279379 40.281425 40.279379 105.838513 0 146.06775l-75.686796 75.737962c-10.296507 7.628748-16.97358 19.865443-16.97358 33.662681 0 23.12365 18.745946 41.87062 41.87062 41.87062 8.048303 0 15.563464-2.275833 21.944801-6.211469 0.048095 0.081864 0.093121 0.157589 0.141216 0.240477l1.173732-1.083681c3.616364-2.421142 6.828522-5.393847 9.529027-8.792247l79.766718-73.603345C929.798013 361.334535 929.798013 239.981676 855.61957 165.804257z" />
              </svg>
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
