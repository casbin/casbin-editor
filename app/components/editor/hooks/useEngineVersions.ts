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

          const [jVersion, gVersion] = await Promise.all([javaEngine.getVersion(), goEngine.getVersion()]);

          setJavaVersion(jVersion);
          setGoVersion(gVersion);
        } catch (error) {
          console.error('Error getting versions:', error);
        }
      }
    };
    getAllVersions();
  }, [isEngineLoading]);

  const engineGithubLinks = {
    node: `https://github.com/casbin/node-casbin/releases/tag/v${casbinVersion || 'latest'}`,
    java: `https://github.com/casbin/jcasbin/releases/tag/v${javaVersion || 'latest'}`,
    go: `https://github.com/casbin/casbin/releases/tag/v${goVersion || 'latest'}`,
  };

  return {
    javaVersion,
    goVersion,
    casbinVersion,
    engineGithubLinks,
  };
}
