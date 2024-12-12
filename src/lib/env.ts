import { isServer } from "solid-js/web"
import { type SafeParseSuccess, z, type ZodFormattedError } from "zod"

export const PrivateEnvSchema = z.object({
  OPENAI_API_KEY: z.string(),
})

export const PublicEnvSchema = z.object({})

const formatErrors = (errors: ZodFormattedError<Map<string, string>, string>) =>
  Object.entries(errors)
    .map(([name, value]) =>
      value && "_errors" in value ? `${name}: ${value._errors.join(", ")}\n` : undefined
    )
    .filter(Boolean)

const parsedPrivateEnv = PrivateEnvSchema.safeParse(isServer ? process.env : {})

// Skip error checking on the client
if (isServer && parsedPrivateEnv.success === false) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(parsedPrivateEnv.error.format())
  )
  throw new Error("Invalid environment variables")
}

const privateEnv = (parsedPrivateEnv as SafeParseSuccess<z.infer<typeof PrivateEnvSchema>>).data

const parsedPublicEnv = PublicEnvSchema.safeParse(import.meta.env)

if (parsedPublicEnv.success === false) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(parsedPublicEnv.error.format())
  )
  throw new Error("Invalid environment variables")
}

const publicEnv = parsedPublicEnv.data

const env = {
  private: privateEnv,
  public: publicEnv,
}

export default env
