import { EngineType, ENGINES } from '@/app/config/engineConfig';

interface EngineResultData {
  result: string;
  reason?: string[];
}

export interface ResultsMap {
  [key: string]: EngineResultData;
}

export function formatEngineResults(results: ResultsMap, selectedEngine: EngineType): string {
  const entries = Object.entries(results);
  if (entries.length === 1) return entries[0][1].result;

  return entries
    .sort((a, b) => {
      if (a[0] === selectedEngine) return -1;
      if (b[0] === selectedEngine) return 1;
      return ENGINES[a[0] as EngineType].order - ENGINES[b[0] as EngineType].order;
    })
    .map(([engine, data]) => formatSingleResult(engine, data, engine === selectedEngine))
    .join('\n\n');
}

function formatSingleResult(engine: string, data: EngineResultData, isPrimary: boolean): string {
  return [
    `// ${isPrimary ? '🟢' : '⚪️'} ${engine} Engine Result`,
    data.result,
    `// ${isPrimary ? '========================' : '----------------------------------------'}`,
  ].join('\n');
}

export function formatResults(results: any[]): string {
  return results
    .map((res) => {
      if (typeof res === 'object') {
        const reasonString = Array.isArray(res.reason) && res.reason.length > 0 ? ` Reason: ${JSON.stringify(res.reason)}` : '';
        return `${res.okEx}${reasonString}`;
      }
      return res;
    })
    .join('\n');
}

export function createResultsMap(results: Array<{ engine: string; result: string }>): ResultsMap {
  return results.reduce((acc, { engine, result }) => {
    acc[engine] = { result };
    return acc;
  }, {} as ResultsMap);
}
