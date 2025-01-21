export interface EngineResult {
  result: string;
}

export interface ResultsMap {
  [key: string]: EngineResult;
}

const ENGINE_ORDER = ['node', 'java', 'go'];

export function formatEngineResults(results: ResultsMap, selectedEngine: string): string {
  const entries = Object.entries(results);
  if (entries.length === 1) return entries[0][1].result;

  return entries
    .sort((a, b) => 
      {return a[0] === selectedEngine ? -1 : 
      b[0] === selectedEngine ? 1 : 
      ENGINE_ORDER.indexOf(a[0]) - ENGINE_ORDER.indexOf(b[0])}
    )
    .map(([engine, { result }]) => {
      const isPrimary = engine === selectedEngine;
      return `// ${isPrimary ? '🟢' : '⚪️'} ${engine} Engine Result
${result}
// ${isPrimary ? '========================' : '----------------------------------------'}`;
    })
    .join('\n\n');
}
