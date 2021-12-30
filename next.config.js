const path = require('path')

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  ...withBundleAnalyzer(),
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};
