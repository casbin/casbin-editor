export interface EngineResult {
  result: string;
  timestamp: number;
}

export interface ResultsMap {
  [key: string]: EngineResult;
}

export function formatEngineResults(results: ResultsMap): string {
  const entries = Object.entries(results);

  if (entries.length === 1) {
    return entries[0][1].result;
  }

  return entries
    .sort((a, b) => {
      return b[1].timestamp - a[1].timestamp;
    })
    .map(([engine, { result, timestamp }], index) => {
      const time = new Date(timestamp).toLocaleTimeString();
      const isLatest = index === 0;
      return `// ${isLatest ? '🟢' : '⚪️'} ${engine} Engine Result
${result}
// ${isLatest ? '========================' : '----------------------------------------'}`;
    })
    .join('\n\n');
}
