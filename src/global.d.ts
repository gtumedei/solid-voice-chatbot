/// <reference types="vinxi/types/client" />
/// <reference types="vite/client" />
/// <reference types="@solidjs/start/env" />
/// <reference types="unplugin-icons/types/solid" />

import "solid-js"

declare module "solid-js" {
  namespace JSX {
    interface Directives {
      form: boolean
    }
  }
}
