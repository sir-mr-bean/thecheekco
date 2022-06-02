const withTM = require("next-transpile-modules")([
  "@square/web-sdk",
  "react-square-web-payments-sdk",
]);

/**
 * @type {import('next').NextConfig}
 **/

module.exports = withTM({
  reactStrictMode: true,
  images: {
    domains: [
      "thecheekcomedia.s3.ap-southeast-2.amazonaws.com",
      "items-images-production.s3.us-west-2.amazonaws.com",
    ],
  },
  experimental: {
    esmExternals: "loose",
  },
});
