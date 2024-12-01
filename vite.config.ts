import { vitePlugin as remix } from "@remix-run/dev";
import { sentryVitePlugin } from "@sentry/vite-plugin";
import { vercelPreset } from "@vercel/remix/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";

declare module "@remix-run/node" {
  interface Future {
    v3_singleFetch: true;
  }
}

export default defineConfig({
  plugins: [
    remix({
      buildDirectory: "build",
      serverBuildFile: "index.js",
      ignoredRouteFiles: ["**/__*.*", "**/*.test.{js,jsx,ts,tsx}"],
      future: {
        v3_fetcherPersist: true,
        v3_relativeSplatPath: true,
        v3_throwAbortReason: true,
        v3_singleFetch: true,
        v3_lazyRouteDiscovery: true,
      },
      presets: [vercelPreset()],
    }),
    tsconfigPaths(),
    sentryVitePlugin({
      org: "vukaborder",
      project: "javascript-remix",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    }),
  ],

  build: {
    sourcemap: true,
  },
});
