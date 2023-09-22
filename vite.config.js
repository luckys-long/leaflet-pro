import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import ElementPlus from "unplugin-element-plus/vite";
import postCssPxToRem from "postcss-pxtorem";
import AutoImport from "unplugin-auto-import/vite";

// https://vitejs.dev/config/
export default defineConfig({
  base: "/web/",
  css: {
    preprocessorOptions: {
      scss: {
        charset: false,
        additionalData: `
          @use "@/assets/styles/_variable.scss" as *;
          @use "@/assets/styles/_mixins.scss" as *;
          @use "@/assets/styles/autoViewPort.scss" as *;
        `,
      },
    },
    postcss: {
      plugins: [
        {
          postcssPlugin: "internal:charset-removal",
          AtRule: {
            charset: (atRule) => {
              if (atRule.name === "charset") {
                atRule.remove();
              }
            },
          },
        },
        postCssPxToRem({
          // 自适应，px>rem转换
          rootValue: 16, // 1rem的大小
          propList: ["font-size"], // 需要转换的属性，这里选择全部都进行转换
        }),
      ],
    },
  },

  plugins: [
    vue(),
    vueJsx(),
    ElementPlus({
      useSource: true,
    }),
    AutoImport({
      imports: ["vue"],
      dts: "src/auto-import.d.ts",
    }),
  ],
  resolve: {
    extensions: [".js", ".vue", ".ts", ".tsx"],
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
    rollupOptions: {
      output: {
        chunkFileNames: "static/js/[name]-[hash].js",
        entryFileNames: "static/js/[name]-[hash].js",
        assetFileNames: "static/[ext]/[name]-[hash].[ext]",
        // 解决打包时Some chunks are larger警告
        // eslint-disable-next-line consistent-return
        manualChunks(id) {
          if (id.includes("node_modules")) {
            return id
              .toString()
              .split("node_modules/")[1]
              .split("/")[0]
              .toString();
          }
        },
      },
    },
  },
  esbuild: {
    treeShaking: true,
    drop: ["debugger", "console"],
  },
  server: {
    hmr: true,
    open: true,

    host: "0.0.0.0",
    // 设置 https 代理  4个端口
    proxy: {
      "/api": {
        target: 'http://integrate-background.shanyuan1.wise-insightapm.com/',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },

      // 带选项写法：http://localhost:5173/api/bar -> http://192.168.0.228/bar
      "/call": {
        target: "http://freeswitch-client.shanyuan1.shaanxidengrong.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/call/, ""),
      },
      "/sta": {
        target: "http://192.168.0.92:80",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sta/, ""),
      },
      "/sts": {
        target: "http://192.168.0.172:80",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/sts/, ""),
      },
      "/video": {
        target: "http://172.16.2.28:9980",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/video/, ""),
      },
      "/loc": {
        target: "http://124.193.134.55:8080",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/loc/, ""),
      },
      "/jinhe": {
        target: "http://172.16.100.95:8886/",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jinhe/, ""),
      },
    },
  },
  // build: {
  //   minify: 'esbuild',
  //   terserOptions: {
  //     // 生产环境移除console
  //     compress: {
  //       drop_console: true,
  //       drop_debugger: true,
  //     },
  //   },
  // },
});
