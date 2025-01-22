import { useState, useEffect } from 'react';
import { createCasbinEngine } from '@/app/components/editor/core/CasbinEngine';
import { VersionInfo } from '@/app/components/hooks/useRemoteEnforcer';

type EngineType = 'java' | 'go' | 'node';

export interface EngineVersionsReturn {
  javaVersion: VersionInfo;
  goVersion: VersionInfo;
  casbinVersion: string | undefined;
  engineGithubLinks: Record<EngineType, string>;
}

interface EngineConfig {
  githubRepo: string;
  createEngine: () => ReturnType<typeof createCasbinEngine>;
}

const ENGINE_CONFIGS: Record<EngineType, EngineConfig> = {
  java: {
    githubRepo: 'casbin/jcasbin',
    createEngine: () => {
      return createCasbinEngine('java');
    },
  },
  go: {
    githubRepo: 'casbin/casbin',
    createEngine: () => {
      return createCasbinEngine('go');
    },
  },
  node: {
    githubRepo: 'casbin/node-casbin',
    createEngine: () => {
      return createCasbinEngine('node');
    },
  },
};

export default function useEngineVersions(isEngineLoading: boolean): EngineVersionsReturn {
  const [versions, setVersions] = useState<Record<EngineType, VersionInfo>>(() => {
    return Object.fromEntries(
      Object.keys(ENGINE_CONFIGS).map((key) => {
        return [key, { engineVersion: '', libVersion: '' }];
      }),
    ) as Record<EngineType, VersionInfo>;
  });

  const casbinVersion = process.env.CASBIN_VERSION;

  useEffect(() => {
    const fetchVersions = async () => {
      if (isEngineLoading) return;

      try {
        const versionEntries = await Promise.all(
          Object.entries(ENGINE_CONFIGS).map(async ([type, config]) => {
            const engine = config.createEngine();
            const version = await engine.getVersion?.();
            return [type, version || { engineVersion: 'unknown', libVersion: 'unknown' }] as const;
          }),
        );

        setVersions(Object.fromEntries(versionEntries) as Record<EngineType, VersionInfo>);
      } catch (error) {
        const defaultVersions = Object.fromEntries(
          Object.keys(ENGINE_CONFIGS).map((key) => {
            return [key, { engineVersion: 'unknown', libVersion: 'unknown' }];
          }),
        );
        setVersions(defaultVersions as Record<EngineType, VersionInfo>);
      }
    };

    fetchVersions();
  }, [isEngineLoading]);

  const getVersionedLink = (repo: string, version?: string | null) => {
    return version && version !== 'unknown'
      ? `https://github.com/${repo}/releases/tag/v${version.startsWith('v') ? version.slice(1) : version}`
      : `https://github.com/${repo}/releases/`;
  };

  const engineGithubLinks = Object.fromEntries(
    Object.entries(ENGINE_CONFIGS).map(([type, config]) => {
      return [type, getVersionedLink(config.githubRepo, type === 'node' ? casbinVersion : versions[type as EngineType]?.libVersion)];
    }),
  ) as Record<EngineType, string>;

  return {
    javaVersion: versions.java,
    goVersion: versions.go,
    casbinVersion,
    engineGithubLinks,
  };
}
