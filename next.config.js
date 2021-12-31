const path = require("path");

const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

module.exports = {
  reactStrictMode: true,
  productionBrowserSourceMaps: true,
  ...withBundleAnalyzer(),
  sassOptions: {
    includePaths: [path.join(__dirname, "styles")],
  },
  webpack: (config, { buildId, dev, isServer, defaultLoaders }) => {
    config.module.rules.push(
      {
        // 将图片文件复制到另一个目录
        test: /\.(png|svg|jpg|gif)$/,
        loader: "file-loader",
        options: {
          name: "[name]-[contenthash:8].[ext]",
          outputPath: "images",
          esModule: false,
        },
      },
      {
        // 将小于10kb的图片编码成base64
        test: /\.(png|svg|jpg|gif)$/,
        use: {
          loader: "url-loader", 
          options: {
            name: "[name]-[contenthash:8].[ext]",
            outputPath: "images",
            limit: 10 * 1024,
            esModule: false,
          },
        },
      },
    );
    return config;
  },
  serverRuntimeConfig: {
    rootDir: path.join(__dirname, './'),
    PORT: process.env.NODE_ENV !== 'production' ? 8080 : (process.env.PORT || 8080)
  },
  publicRuntimeConfig: {
    isDev: process.env.NODE_ENV !== 'production'
  },
};
