import jwt from "jsonwebtoken";

// Single source of truth for the JWT cookie's options. Both setting it
// (generateToken) and clearing it (logout) must use the exact same
// httpOnly/secure/sameSite/path values, or the browser treats the "clear"
// call as a different cookie and the original one never actually expires.
//
// sameSite must be "none" (with secure: true) whenever the frontend and
// backend are on different domains (e.g. a Vercel frontend calling a
// Render backend) — "strict"/"lax" cookies are not sent on those
// cross-origin requests at all, which breaks both login and logout.
const isProduction = process.env.NODE_ENV === "production";
export const jwtCookieOptions = {
  httpOnly: true,
  secure: isProduction, // must be true whenever sameSite is "none"
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

// Generates a signed JWT and sets it as an httpOnly cookie on the response.
const generateToken = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "30d",
  });

  res.cookie("jwt", token, {
    ...jwtCookieOptions,
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};

export default generateToken;