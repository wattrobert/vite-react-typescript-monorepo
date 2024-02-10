import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { name, version } from "./package.json";
import path from "path";
import dts from 'vite-plugin-dts'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    lib: {      
      entry: path.resolve(__dirname, "src/index.ts"),
      fileName: "index",
      name: "coreui",
    },
    outDir: "./lib",
    rollupOptions: {
      // Externalize deps that shouldn't be bundled
      external: ["react", "react-dom", "react-router-dom", "ordercloud-javascript-sdk", "@chakra-ui/react", "@chakra-ui/icons", "@tanstack/react-query", "@tanstack/react-table"],
      output: {
        // Global vars to use in UMD build for externalized deps
        globals: {
          react: "React",
          "react-dom": "ReactDOM",
          "react-router-dom": "ReactRouterDOM",
          "@chakra-ui/react": "chakra",
          "@chakra-ui/icons": "chakra-icons",
          "@tanstack/react-query": "ReactQuery",
          "@tanstack/react-table": "ReactTable",
          "ordercloud-javascript-sdk":"ordercloud-javascript-sdk"
        },
      },
    },
  },
  define: {
    pkgJson: { name, version },
  },
  plugins: [react(), dts({ rollupTypes: true })],
});
