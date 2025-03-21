import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";
import dts from "vite-plugin-dts";
import { readdirSync } from "fs";
import { delay, filter, map } from "lodash-es";
import shell from "shelljs";
import hooks from "./hooksPlugin";

import terser from "@rollup/plugin-terser";
const TRY_MOVE_STYLES_DELAY = 800 as const;

//定义三个环境
const isProd = process.env.NODE_ENV === "production";
const isDev = process.env.NODE_ENV === "development";
const isTest = process.env.NODE_ENV === "test";

function moveStyle() {
  try {
    readdirSync("./dist/es/theme");
    shell.cp("./dist/es/theme", "./dist");
  } catch (_) {
    delay(moveStyle, TRY_MOVE_STYLES_DELAY);
  }
}

function getDirecToriesSync(basePath: string) {
  const entries = readdirSync(basePath, { withFileTypes: true });
  return map(
    filter(entries, (entry) => entry.isDirectory()),
    (entry) => entry.name
  );
}
export default defineConfig({
  plugins: [
    vue(),
    dts({
      tsconfigPath: "../../tsconfig.build.json",
      outDir: "dist/types",
    }),
    hooks({
      rmFiles: ["./dist/es", "./dist/types", "./dist/theme"],
      afterBuild: moveStyle,
    }),
    terser({
      compress: {
        sequences: isProd,
        arguments: isProd,
        drop_console: isProd && ["log"],
        drop_debugger: isProd,
        passes: isProd ? 4 : 1,
        global_defs: {
          "@DEV": JSON.stringify(isDev),
          "@PROD": JSON.stringify(isProd),
          "@TEST": JSON.stringify(isTest),
        },
      },
      format: {
        semicolons: false,
        shorthand: isProd,
        braces: !isProd,
        beautify: !isProd,
        comments: !isProd,
      },
      mangle: {
        toplevel: isProd,
        eval: isProd,
        keep_classnames: isDev,
        keep_fnames: isDev,
      },
    }),
  ],
  build: {
    outDir: "dist/es",
    minify: false,
    cssCodeSplit: true,
    lib: {
      entry: resolve(__dirname, "./index.ts"),
      name: "yaqueElement",
      fileName: "index",
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "vue",
        "@fortawesome/free-solid-svg-icons",
        "@fortawesome/fontawesome-svg-core",
        "@fortawesome/vue-fontawesome",
        "popperjs/core",
        "async-validator",
      ],
      output: {
        assetFileNames: (assetInfo) => {
          if (assetInfo.name === "style.css") return "index.css";
          if (
            assetInfo.type === "asset" &&
            /\.(css)$/i.test(assetInfo.name as string)
          ) {
            return "theme/[name].[ext]";
          }
          return assetInfo.name as string;
        },
        // 拆包
        manualChunks(id) {
          console.log("====================================");
          console.log(id);
          console.log("====================================");
          if (id.includes("node_modules")) {
            return "vendor";
          }
          if (id.includes("/packages/hooks")) {
            return "hooks";
          }
          if (
            id.includes("/packages/utils") ||
            id.includes("plugin-vue:export-helper")
          ) {
            return "utils";
          }
          for (const item of getDirecToriesSync("../components")) {
            if (id.includes(`/packages/components/${item}`)) {
              return item;
            }
          }
        },
      },
    },
  },
});
