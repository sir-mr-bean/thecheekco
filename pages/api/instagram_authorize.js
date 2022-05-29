import { Instagram } from "social-oauth-client";

const instagram = new Instagram({
  CLIENT_ID: process.env.INSTAGRAM_APP_ID,
  CLIENT_SECRET: process.env.INSTAGRAM_APP_SECRET,
  REDIRECT_URL: "http://localhost:3000/api/instagram_callback",
});

export default async function handler(req, res) {
  var url = instagram.getAuthorizeUrl();
  res.redirect(url);
}
