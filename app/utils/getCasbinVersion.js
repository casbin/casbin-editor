import packageJson from '../../package.json';

export const getCasbinVersion = async () => {
  const version = packageJson.dependencies.casbin;
  return version.replace('^', '');
};
