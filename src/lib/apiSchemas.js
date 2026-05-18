import { z } from "zod"

const AuthUserSchema = z.object({
  id: z.string(),
}).passthrough()

const AuthResponseSchema = z.object({
  token: z.string().min(1),
  user: AuthUserSchema,
}).passthrough()

const DeviceKeySchema = z.object({
  id: z.string(),
  deviceId: z.string(),
  label: z.string().nullish(),
  certifiedAt: z.string(),
  lastSeen: z.string().nullish(),
}).passthrough()

const DeviceLinkRequestResponseSchema = z.object({
  requestId: z.string(),
  secret: z.string(),
  code: z.string(),
  expiresAt: z.string(),
}).passthrough()

function parsePayload(schema, data, operation) {
  const parsed = schema.safeParse(data)
  if (parsed.success) return parsed.data

  const err = new Error(`${operation} returned an invalid response`)
  err.code = "invalid_response"
  err.cause = parsed.error
  throw err
}

export function parseAuthResponse(data, operation = "auth") {
  return parsePayload(AuthResponseSchema, data, operation)
}

export function parseDeviceKeys(data) {
  return parsePayload(z.array(DeviceKeySchema), data, "listDeviceKeys")
}

export function parseDeviceLinkRequestResponse(data) {
  return parsePayload(
    DeviceLinkRequestResponseSchema,
    data,
    "createDeviceLinkRequest"
  )
}
