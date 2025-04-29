import { HttpStatusCode } from "@solidjs/start"
import AppTitle from "~/components/app-title"

const NotFoundPage = () => {
  return (
    <div class="flex flex-col items-center text-center py-16">
      <AppTitle>Page not found</AppTitle>
      <HttpStatusCode code={404} />
      <h1 class="max-6-xs text-2xl text-sky-700 uppercase mb-16">Not Found</h1>
      <p class="mt-8">
        Visit{" "}
        <a href="https://solidjs.com" target="_blank" class="text-sky-600 hover:underline">
          solidjs.com
        </a>{" "}
        to learn how to build Solid apps.
      </p>
    </div>
  )
}

export default NotFoundPage
