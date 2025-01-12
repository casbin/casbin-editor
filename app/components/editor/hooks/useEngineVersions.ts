import { useState, useEffect } from 'react';
import { createCasbinEngine } from '../CasbinEngine';

interface EngineVersions {
  javaVersion: string;
  goVersion: string;
  casbinVersion: string | undefined;
  engineGithubLinks: {
    node: string;
    java: string;
    go: string;
  };
}

export default function useEngineVersions(isEngineLoading: boolean): EngineVersions {
  const [javaVersion, setJavaVersion] = useState<string>('');
  const [goVersion, setGoVersion] = useState<string>('');
  const casbinVersion = process.env.CASBIN_VERSION;

  useEffect(() => {
    const getAllVersions = async () => {
      if (!isEngineLoading) {
        try {
          const javaEngine = createCasbinEngine('java');
          const goEngine = createCasbinEngine('go');

          const [jVersion, gVersion] = await Promise.all([
            javaEngine.getVersion(),
            goEngine.getVersion()
          ]);

          setJavaVersion(jVersion || 'unknown');
          setGoVersion(gVersion || 'unknown');
        } catch (error) {
          console.error('Error getting versions:', error);
          setJavaVersion('unknown');
          setGoVersion('unknown');
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
    java: getVersionedLink('https://github.com/casbin/jcasbin/releases/', javaVersion),
    go: getVersionedLink('https://github.com/casbin/casbin/releases/', goVersion),
  };

  return {
    javaVersion,
    goVersion,
    casbinVersion,
    engineGithubLinks,
  };
}
