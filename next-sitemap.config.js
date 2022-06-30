/** @type {import('next-sitemap').IConfig} */
const config = {
  siteUrl: process.env.NEXTAUTH_URL || "https://thecheekco.vercel.app",
  generateRobotsTxt: true, // (optional)
  // ...other options
};

module.exports = config;
