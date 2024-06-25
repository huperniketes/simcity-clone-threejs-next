/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
await import("./src/env.js");

/** @type {import("next").NextConfig} */
const config = {
    eslint: {
        ignoreDuringBuilds:  true,      // Reports rule violations (warnings and errors) enabled in .eslintrc when false
    },
    typescript: {
        ignoreBuildErrors:  true,       // Fails on first error when false
    },
};

export default config;
