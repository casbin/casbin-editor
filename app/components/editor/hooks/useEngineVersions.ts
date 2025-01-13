import { useState, useEffect } from 'react';
import { createCasbinEngine } from '../CasbinEngine';

type EngineType = 'java' | 'go' | 'node';

interface VersionInfo {
  engine: string;
  lib: string;
}

const ENGINE_CONFIGS: Record<
  EngineType,
  {
    githubRepo: string;
    createEngine: () => ReturnType<typeof createCasbinEngine>;
  }
> = {
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
    return Object.keys(ENGINE_CONFIGS).reduce(
      (acc, key) => {
        return {
          ...acc,
          [key]: { engine: '', lib: '' },
        };
      },
      {} as Record<EngineType, VersionInfo>,
    );
  });

  const casbinVersion = process.env.CASBIN_VERSION;

  useEffect(() => {
    const getAllVersions = async () => {
      if (isEngineLoading) return;

      try {
        const versionPromises = Object.entries(ENGINE_CONFIGS).map(async ([type, config]) => {
          const engine = config.createEngine();
          const version = await engine.getVersion?.();
          return [type, version] as const;
        });

        const results = await Promise.all(versionPromises);

        const newVersions = results.reduce(
          (acc, [type, version]) => {
            return {
              ...acc,
              [type]: version ? { engine: version.engineVersion, lib: version.libVersion } : { engine: 'unknown', lib: 'unknown' },
            };
          },
          {} as Record<EngineType, VersionInfo>,
        );

        setVersions(newVersions);
      } catch (error) {
        console.error('Error getting versions:', error);
        const defaultVersions = Object.keys(ENGINE_CONFIGS).reduce(
          (acc, key) => {
            return {
              ...acc,
              [key]: { engine: 'unknown', lib: 'unknown' },
            };
          },
          {} as Record<EngineType, VersionInfo>,
        );

        setVersions(defaultVersions);
      }
    };

    getAllVersions();
  }, [isEngineLoading]);

  const getVersionedLink = (base: string, version?: string | null) => {
    if (!version || version === 'unknown') {
      return base;
    }

    const versionNumber = version.startsWith('v') ? version.substring(1) : version;
    return `${base}tag/v${versionNumber}`;
  };

  const engineGithubLinks = Object.entries(ENGINE_CONFIGS).reduce(
    (acc, [type, config]) => {
      return {
        ...acc,
        [type]:
          type === 'node'
            ? getVersionedLink(`https://github.com/${config.githubRepo}/releases/`, casbinVersion)
            : getVersionedLink(`https://github.com/${config.githubRepo}/releases/`, versions[type as EngineType]?.lib),
      };
    },
    {} as Record<string, string>,
  );

  return {
    javaVersion: versions.java,
    goVersion: versions.go,
    casbinVersion,
    engineGithubLinks,
  };
}
export interface EngineVersionsReturn {
  javaVersion: VersionInfo;
  goVersion: VersionInfo;
  casbinVersion: string | undefined;
  engineGithubLinks: Record<string, string>;
}
