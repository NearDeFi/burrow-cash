/** @type {import('next').NextConfig} */
module.exports = {
  reactStrictMode: true,
  trailingSlash: true,
  webpack(config, { isServer, webpack, buildId }) {
    config.plugins.push(
      new webpack.DefinePlugin({
        "process.env.CONFIG_BUILD_ID": JSON.stringify(buildId),
      }),
    );

    config.module.rules.push({
      test: /\.svg$/i,
      issuer: /\.[jt]sx?$/,
      use: ["@svgr/webpack"],
    });

    if (!isServer) {
      config.resolve.fallback.fs = false;
    }

    return config;
  },
  async redirects() {
    return [
      {
        source: "/",
        destination: "/deposit",
        permanent: true,
      },
    ];
  },
};
