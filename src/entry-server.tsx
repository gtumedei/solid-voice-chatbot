import { StartServer, createHandler } from "@solidjs/start/server"

export default createHandler(
  () => (
    <StartServer
      document={({ assets, children, scripts }) => (
        <html lang="en" class="min-h-full flex text-gray-700">
          <head>
            <meta charset="utf-8" />
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <link rel="icon" href="/favicon.ico" />
            {assets}
          </head>
          <body class="grow flex">
            <div id="app" class="grow flex flex-col">
              {children}
            </div>
            {scripts}
          </body>
        </html>
      )}
    />
  ),
  {
    mode: "async",
  }
)
