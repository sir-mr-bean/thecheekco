const nextSafe = require("next-safe");

const isDev = process.env.NEXT_PUBLIC_VERCEL_ENV !== "production";

const withTM = require("next-transpile-modules")([
  "@square/web-sdk",
  "react-square-web-payments-sdk",
]);

const ContentSecurityPolicy = `default-src 'self' https://thecheekco.vercel.app;script-src 'self' https://www.google-analytics.com https://www.googletagmanager.com https://maps.googleapis.com;img-src data: 'self' https://www.google-analytics.com www.google-analytics.com https://stats.g.doubleclick.net images.ctfassets.net images.unsplash.com thecheekco.vercel.app;connect-src 'self' https://www.google-analytics.com www.google-analytics.com https://stats.g.doubleclick.net https://vitals.vercel-insights.com;font-src fonts.gstatic.com;style-src data: 'self' fonts.googleapis.com 'unsafe-inline'`;

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
        headers: nextSafe({
          ContentSecurityPolicy: {
            "default-src": "'self' https://thecheekco.vercel.app",
            "script-src":
              "'self' https://www.google-analytics.com https://www.googletagmanager.com https://maps.googleapis.com",
            "img-src":
              "data: 'self' https://www.google-analytics.com www.google-analytics.com https://stats.g.doubleclick.net images.ctfassets.net images.unsplash.com thecheekco.vercel.app",
            "connect-src":
              "'self' https://www.google-analytics.com www.google-analytics.com https://stats.g.doubleclick.net https://vitals.vercel-insights.com",
            "font-src": "fonts.gstatic.com",
            "style-src": "data: 'self' fonts.googleapis.com 'unsafe-inline'",
          },

          contentTypeOptions: "nosniff",
          frameOptions: "DENY",
          permissionsPolicy: {},
          permissionsPolicyDirectiveSupport: ["proposed", "standard"],
          isDev: isDev,
          referrerPolicy: "no-referrer",
          xssProtection: "1; mode=block",
        }),
      },
    ];
  },
});
