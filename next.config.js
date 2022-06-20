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
      "images.ctfassets.net",
      "tailwindui.com",
    ],
  },
  experimental: {
    esmExternals: "loose",
  },
  serverRuntimeConfig: {
    // Will only be available on the server side
    squareAPIURL: process.env.SQUARE_API_URL, // Pass through env variables
    squareAccessToken: process.env.SQUARE_ACCESS_TOKEN, // Pass through env variables
  },
  basePath: "",
  paths: {
    "@/components/*": ["components/*"],
    "@pages/*": ["src/pages/*"],
    "@/utils/*": ["utils/*"],
    "@/styles/*": ["styles/*"],
    "@/context/*": ["context/*"],
    "@/types/*": ["@types/*"],
    "@/backend/*": ["src/backend/*"],
  },
});
