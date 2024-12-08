import { defineConfig } from "@solidjs/start/config"
import Autoprefixer from "autoprefixer"
import Tailwind from "tailwindcss"
import Nesting from "tailwindcss/nesting/index.js"
import Icons from "unplugin-icons/vite"
import InlineCssModules from "vite-plugin-inline-css-modules"

export default defineConfig({
  vite: () => ({
    envPrefix: "PUBLIC_",
    plugins: [Icons({ compiler: "solid" }), InlineCssModules()],
    css: {
      postcss: {
        plugins: [Nesting(), Tailwind(), Autoprefixer()],
      },
    },
  }),
})
