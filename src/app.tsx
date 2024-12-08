// @refresh reload
import { MetaProvider } from "@solidjs/meta"
import { Router } from "@solidjs/router"
import { FileRoutes } from "@solidjs/start/router"
import { Suspense } from "solid-js"
import Footer from "~/components/footer"
import Header from "~/components/header"
import { NProgress } from "~/components/nprogress"
import { SpeechProvider } from "~/lib/speech"

import "~/app.css"

const App = () => {
  return (
    <Router
      root={(props) => (
        <MetaProvider>
          <SpeechProvider>
            <Suspense>
              <NProgress />
              <Header />
              <main class="grow flex flex-col px-6">{props.children}</main>
              <Footer />
            </Suspense>
          </SpeechProvider>
        </MetaProvider>
      )}
    >
      <FileRoutes />
    </Router>
  )
}

export default App
