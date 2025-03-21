// This file is only needed for Cloudflare deployments
// For Vercel deployments, we can use a simplified version

const config = {
  default: {
    override: {
      wrapper: "default",
      converter: "edge",
      incrementalCache: async () => ({}),
      tagCache: "dummy",
      queue: "dummy",
    },
  },

  middleware: {
    external: true,
    override: {
      wrapper: "default",
      converter: "edge",
      proxyExternalRequest: "fetch",
    },
  },

  dangerous: {
    enableCacheInterception: false,
  },
};

export default config;
