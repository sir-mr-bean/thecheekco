const withTM = require("next-transpile-modules")([
  "@square/web-sdk",
  "react-square-web-payments-sdk",
]);

const ContentSecurityPolicy = `
default-src 'self';script-src 'self' https://www.google-analytics.com';img-src 'self' https://www.google-analytics.com www.google-analytics.com https://stats.g.doubleclick.net images.ctfassets.net images.unsplash.com thecheekco.vercel.app data: ;connect-src https://www.google-analytics.com www.google-analytics.com https://stats.g.doubleclick.net;font-src fonts.gstatic.com;style-src 'self' fonts.googleapis.com
`;
const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: ContentSecurityPolicy.replace(/\s{2,}/g, " ").trim(),
  },
  {
    key: "X-XSS-Protection",
    value: "1; mode=block",
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Referrer-Policy",
    value: "origin-when-cross-origin",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
];

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
  async headers() {
    return [
      {
        // Apply these headers to all routes in your application.
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
});
