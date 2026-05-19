import { z } from "zod"

const ArchiveInitResponseSchema = z.object({
  archiveId: z.string().min(1),
  uploadToken: z.string().min(1),
  downloadToken: z.string().min(1),
  expiresAt: z.string().min(1),
  hardDeadlineAt: z.string().min(1),
}).passthrough()

const ArchiveWindowEntrySchema = z.object({
  url: z.string().min(1),
  method: z.string().optional(),
  headers: z.record(z.string(), z.string()).optional(),
  contentSha256Header: z.string().optional(),
}).passthrough()

const ArchiveWindowResponseSchema = z.object({
  entries: z.array(ArchiveWindowEntrySchema).optional(),
}).passthrough()

const ArchiveFinalizeMissingSchema = z.object({
  missing: z.array(z.number().int().nonnegative()),
}).passthrough()

const ArchiveManifestSchema = z.object({
  totalChunks: z.number().int().nonnegative(),
  chunkSize: z.number().int().positive(),
  totalBytes: z.number().int().nonnegative(),
  manifestHash: z.string().min(1),
  archiveSha256: z.string().min(1),
  chunkHashes: z.array(z.string().min(1)),
  expiresAt: z.string().min(1),
}).strict()

function parsePayload(schema, data, operation) {
  const parsed = schema.safeParse(data)
  if (parsed.success) return parsed.data

  const err = new Error(`${operation} returned an invalid response`)
  err.code = "invalid_response"
  err.cause = parsed.error
  throw err
}

export function parseArchiveInitResponse(data) {
  return parsePayload(ArchiveInitResponseSchema, data, "initArchive")
}

export function parseArchiveWindowResponse(data, operation) {
  return parsePayload(ArchiveWindowResponseSchema, data, operation)
}

export function parseArchiveFinalizeMissing(data) {
  return parsePayload(ArchiveFinalizeMissingSchema, data, "finalizeArchive")
}

export function parseArchiveManifest(data) {
  return parsePayload(ArchiveManifestSchema, data, "fetchManifest")
}
