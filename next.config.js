/** @type {import('next').NextConfig} */
module.exports = {
  // Lets verification builds use a separate folder so they never clobber a running `next dev`.
  distDir: process.env.NEXT_DIST_DIR || ".next",
  experimental: { serverActions: { bodySizeLimit: "40mb" } },
};
