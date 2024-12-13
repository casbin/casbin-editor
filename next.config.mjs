import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const casbinVersion = require('./node_modules/casbin/package.json').version;

/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: false,
  /**
   * Enable static exports for the App Router.
   *
   * @see https://nextjs.org/docs/app/building-your-application/deploying/static-exports
   */
  output: "export",

  /**
   * Set base path. This is usually the slug of your repository.
   *
   * @see https://nextjs.org/docs/app/api-reference/next-config-js/basePath
   */
  basePath: "",

  /**
   * Disable server-based image optimization. Next.js does not support
   * dynamic features with static exports.
   *
   * @see https://nextjs.org/docs/pages/api-reference/components/image#unoptimized
   */
  images: {
    unoptimized: true,
  },

  // Static files will be loaded using relative paths.
  assetPrefix: './',
  
  // for casbin browser
  webpack: (config, { isServer,webpack }) => {
    if (!isServer) {
      config.resolve.fallback = { fs: false, ...config.resolve.fallback };
    }

    config.plugins.push(
      new webpack.ProvidePlugin({
        Buffer: ['buffer', 'Buffer'],
      })
    );

    return config;
  },

  env: {
    CASBIN_VERSION: casbinVersion
  }
};

export default nextConfig;
