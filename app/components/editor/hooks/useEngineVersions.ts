import { useState, useEffect } from 'react';
import { createCasbinEngine } from '../CasbinEngine';
import { VersionInfo } from '../hooks/useRemoteEnforcer';

interface EngineVersions {
  javaVersion: {
    engine: string;
    lib: string;
  };
  goVersion: {
    engine: string;
    lib: string;
  };
  casbinVersion: string | undefined;
  engineGithubLinks: {
    node: string;
    java: string;
    go: string;
  };
}

export default function useEngineVersions(isEngineLoading: boolean): EngineVersions {
  const [javaVersion, setJavaVersion] = useState<{ engine: string; lib: string }>({ engine: '', lib: '' });
  const [goVersion, setGoVersion] = useState<{ engine: string; lib: string }>({ engine: '', lib: '' });
  const casbinVersion = process.env.CASBIN_VERSION;

  useEffect(() => {
    const getAllVersions = async () => {
      if (!isEngineLoading) {
        try {
          const javaEngine = createCasbinEngine('java');
          const goEngine = createCasbinEngine('go');

          const [jVersion, gVersion] = (await Promise.all([javaEngine.getVersion?.(), goEngine.getVersion?.()])) as [
            VersionInfo | undefined,
            VersionInfo | undefined,
          ];

          if (jVersion) {
            setJavaVersion({
              engine: jVersion.engineVersion,
              lib: jVersion.libVersion,
            });
          }

          if (gVersion) {
            setGoVersion({
              engine: gVersion.engineVersion,
              lib: gVersion.libVersion,
            });
          }
        } catch (error) {
          console.error('Error getting versions:', error);
          setJavaVersion({ engine: 'unknown', lib: 'unknown' });
          setGoVersion({ engine: 'unknown', lib: 'unknown' });
        }
      }
    };
    getAllVersions();
  }, [isEngineLoading]);

  const getVersionedLink = (base: string, version: string | undefined | null) => {
    if (!version || version === 'unknown') {
      return base;
    }
    return `${base}tag/v${version}`;
  };

  const engineGithubLinks = {
    node: getVersionedLink('https://github.com/casbin/node-casbin/releases/', casbinVersion),
    java: getVersionedLink('https://github.com/casbin/jcasbin/releases/', javaVersion.lib),
    go: getVersionedLink('https://github.com/casbin/casbin/releases/', goVersion.lib),
  };

  return {
    javaVersion,
    goVersion,
    casbinVersion,
    engineGithubLinks,
  };
}
