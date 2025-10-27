import { useCallback, useState } from 'react';
import { formatResults, createResultsMap, ResultsMap } from '@/app/utils/resultFormatter';
import { isValidElement } from 'react';
import { toast } from 'react-hot-toast';

interface EnforceCallParams {
  modelKind: string;
  model: string;
  policy: string;
  customConfig: any;
  request: string;
  enforceContextData: any;
  selectedEngine: string;
  comparisonEngines?: string[];
  showSuccessToast?: boolean;
}

export function useEnforceCall(
  enforcer: any,
  setEcho: (v: React.ReactNode) => void,
  setRequestResult: (v: string) => void,
  setRequestResults: (v: ResultsMap) => void,
  t: (key: string) => string,
) {
  const [isLoading, setIsLoading] = useState(false);

  const handleEnforcerCall = useCallback(
    async (params: EnforceCallParams) => {
      setRequestResult('');
      setEcho(null);
      setIsLoading(true);
      setRequestResults({});

      const allEngines = [params.selectedEngine, ...(params.comparisonEngines || [])];
      let lastEcho: React.ReactNode = null;

      const results = await Promise.all(
        allEngines.map((engine) => {
          return new Promise<{ engine: string; result: string }>((resolve) => {
            enforcer({
              ...params,
              selectedEngine: engine,
              t,
              onResponse: (v: any) => {
                if (isValidElement(v)) {
                  lastEcho = v;
                } else if (Array.isArray(v)) {
                  const result = formatResults(v);
                  resolve({ engine, result });
                }
              },
            });
          });
        }),
      );

      const newResults = createResultsMap(results);
      setRequestResults(newResults);

      const primaryResult =
        results.find((r) => {
          return r.engine === params.selectedEngine;
        })?.result || '';
      setRequestResult(primaryResult);

      setEcho(lastEcho);

      if (params.showSuccessToast && primaryResult && !primaryResult.includes('error')) {
        toast.success(t('Test completed successfully'));
      }

      setIsLoading(false);
    },
    [enforcer, setEcho, setRequestResult, setRequestResults, t],
  );

  return { handleEnforcerCall, isLoading };
}
