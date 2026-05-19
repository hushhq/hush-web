import { z } from "zod"

import { recordClientDiagnostic } from "./clientDiagnostics"

function formatSchemaIssues(zodError) {
  if (!zodError || !Array.isArray(zodError.issues)) return []
  return zodError.issues.map((issue) => ({
    path: Array.isArray(issue?.path) ? issue.path.join(".") : "",
    code: typeof issue?.code === "string" ? issue.code : "",
  }))
}

const AuthUserSchema = z.object({
  id: z.string(),
}).passthrough()

const AuthResponseSchema = z.object({
  token: z.string().min(1),
  user: AuthUserSchema,
}).passthrough()

const AuthChallengeResponseSchema = z.object({
  nonce: z.string().min(1),
}).passthrough()

const FederatedAuthResponseSchema = z.object({
  token: z.string().min(1),
  federatedIdentity: z.object({}).passthrough(),
}).passthrough()

const GuestSessionResponseSchema = z.object({
  token: z.string().min(1),
  guestId: z.string().min(1),
  expiresAt: z.string().min(1),
}).passthrough()

const UsernameAvailabilityResponseSchema = z.object({
  available: z.boolean(),
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

const DeviceLinkResolvedClaimSchema = z.object({
  claimToken: z.string().min(1),
  requestId: z.string().min(1),
  deviceId: z.string().min(1),
  devicePublicKey: z.string().min(1),
  sessionPublicKey: z.string().min(1),
  label: z.string().nullish(),
  instanceUrl: z.string().nullish(),
  expiresAt: z.string().min(1),
}).passthrough()

const DeviceLinkPendingResultSchema = z.object({
  status: z.literal("pending"),
}).passthrough()

const DeviceLinkReadyResultSchema = z.object({
  relayCiphertext: z.string().min(1),
  relayIv: z.string().min(1),
  relayPublicKey: z.string().min(1),
  deviceId: z.string().min(1),
  instanceUrl: z.string().nullish(),
}).strict()

const DeviceLinkResultSchema = z.union([
  DeviceLinkPendingResultSchema,
  DeviceLinkReadyResultSchema,
])

function parsePayload(schema, data, operation) {
  const parsed = schema.safeParse(data)
  if (parsed.success) return parsed.data

  recordClientDiagnostic({
    category: "api",
    event: "invalid-response-schema",
    severity: "error",
    details: {
      operation,
      issues: formatSchemaIssues(parsed.error),
    },
  })

  const err = new Error(`${operation} returned an invalid response`)
  err.code = "invalid_response"
  err.cause = parsed.error
  throw err
}

export function parseAuthResponse(data, operation = "auth") {
  return parsePayload(AuthResponseSchema, data, operation)
}

export function parseAuthChallengeResponse(data) {
  return parsePayload(AuthChallengeResponseSchema, data, "requestChallenge")
}

export function parseFederatedAuthResponse(data) {
  return parsePayload(FederatedAuthResponseSchema, data, "federatedVerify")
}

export function parseGuestSessionResponse(data) {
  return parsePayload(GuestSessionResponseSchema, data, "requestGuestSession")
}

export function parseUsernameAvailabilityResponse(data) {
  return parsePayload(
    UsernameAvailabilityResponseSchema,
    data,
    "checkUsernameAvailable"
  )
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

export function parseDeviceLinkResolvedClaim(data) {
  return parsePayload(
    DeviceLinkResolvedClaimSchema,
    data,
    "resolveDeviceLinkRequest"
  )
}

export function parseDeviceLinkResult(data) {
  return parsePayload(DeviceLinkResultSchema, data, "consumeDeviceLinkResult")
}
