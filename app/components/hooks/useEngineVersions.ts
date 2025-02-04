import { useState, useEffect } from 'react';
import { ENGINES, type EngineType } from '@/app/config/engineConfig';
import type { VersionInfo } from '@/app/components/hooks/useRemoteEnforcer';

export interface EngineVersionsReturn {
  versions: Record<EngineType, VersionInfo>;
  casbinVersion: string | undefined;
  engineGithubLinks: Record<EngineType, string>;
}

export default function useEngineVersions(isEngineLoading: boolean): EngineVersionsReturn {
  const [versions, setVersions] = useState<Record<EngineType, VersionInfo>>(() => {
    return Object.fromEntries(Object.keys(ENGINES).map((key) => [key, { engineVersion: '', libVersion: '' }])) as Record<EngineType, VersionInfo>;
  });

  const casbinVersion = process.env.CASBIN_VERSION;

  useEffect(() => {
    const fetchVersions = async () => {
      if (isEngineLoading) return;

      try {
        const versionEntries = await Promise.all(
          Object.entries(ENGINES).map(async ([type, config]) => {
            const engine = config.createEngine();
            const version = await engine.getVersion?.();
            return [type, version || { engineVersion: 'unknown', libVersion: 'unknown' }] as const;
          }),
        );

        setVersions(Object.fromEntries(versionEntries) as Record<EngineType, VersionInfo>);
      } catch (error) {
        const defaultVersions = Object.fromEntries(
          Object.keys(ENGINES).map((key) => {
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
    Object.entries(ENGINES).map(([type, config]) => {
      return [type, getVersionedLink(config.githubRepo, type === 'node' ? casbinVersion : versions[type as EngineType]?.libVersion)];
    }),
  ) as Record<EngineType, string>;

  return {
    versions,
    casbinVersion,
    engineGithubLinks,
  };
}
