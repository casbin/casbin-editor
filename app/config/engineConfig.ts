import { NodeCasbinEngine, RemoteCasbinEngine, createCasbinEngine } from '@/app/components/editor/core/CasbinEngine';
import type { ICasbinEngine } from '@/app/components/editor/core/CasbinEngine';

export interface EngineConfig {
  id: string;
  name: string;
  githubRepo: string;
  isRemote: boolean;
  order: number;
  createEngine: () => ICasbinEngine;
}

export const ENGINES = {
  node: {
    id: 'node',
    name: 'Node-Casbin (NodeJs)',
    githubRepo: 'casbin/node-casbin',
    isRemote: false,
    order: 1,
    createEngine: () => createCasbinEngine('node'),
  },
  java: {
    id: 'java',
    name: 'jCasbin (Java)',
    githubRepo: 'casbin/jcasbin',
    isRemote: true,
    order: 2,
    createEngine: () => new RemoteCasbinEngine('java'),
  },
  go: {
    id: 'go',
    name: 'Casbin (Go)',
    githubRepo: 'casbin/casbin',
    isRemote: true,
    order: 3,
    createEngine: () => new RemoteCasbinEngine('go'),
  },
  rust: {
    id: 'rust',
    name: 'Casbin-rs (Rust)',
    githubRepo: 'casbin/casbin-rs',
    isRemote: true,
    order: 4,
    createEngine: () => new RemoteCasbinEngine('rust'),
  },
} as const;

export type EngineType = keyof typeof ENGINES;

export function createEngine(type: EngineType) {
  const config = ENGINES[type];
  if (!config) throw new Error(`Unsupported engine type: ${type}`);

  if (!config.isRemote) {
    return new NodeCasbinEngine();
  }
  return new RemoteCasbinEngine(type as Exclude<EngineType, 'node'>);
}
