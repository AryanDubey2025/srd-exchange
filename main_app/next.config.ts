/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config: any, { isServer }: { isServer: boolean }) => {
  
    config.watchOptions = {
      ignored: ['../contracts/**', '../artifacts/**', '../cache/**']
    };
    
 
    if (!isServer) {
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        crypto: false,
      };
    }
    
    return config;
  },
};

module.exports = nextConfig;
