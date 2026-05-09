/**
 * Click-to-zoom modal for image / video attachments.
 *
 * Builds on the project's shadcn `Dialog` primitive so the backdrop
 * (subtle dim + backdrop-blur) and entry animation match every other
 * modal in the app. The shadcn `DialogContent` default cap of
 * `sm:max-w-sm` is overridden via `className` so the dialog can grow
 * to fit the media; chrome (background, ring, padding) is stripped so
 * only the image / video itself sits inside the centred frame.
 *
 * The inline tile already decrypted the blob and produced an
 * `objectUrl`; we reuse it here — no refetch, no second decrypt — so
 * the open animation is instant and we never leak extra blob URLs
 * into the page lifecycle. Closing is handled by shadcn's built-in ✕
 * (top-right of `DialogContent`), Esc, or click on the backdrop.
 */
"use client"
import * as React from "react"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"

interface AttachmentLightboxProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  mimeType: string
  /** Decrypted blob URL produced by `useAttachmentDownloader`. */
  objectUrl: string
  /** Original filename — surfaced as alt text + accessible label. */
  name: string
}

export function AttachmentLightbox({
  open,
  onOpenChange,
  mimeType,
  objectUrl,
  name,
}: AttachmentLightboxProps) {
  const isVideo = mimeType.startsWith("video/")
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className={cn(
          // Override shadcn's `sm:max-w-sm` cap and strip the popover
          // chrome — the media is the surface.
          "w-auto max-w-[calc(100vw-2rem)] gap-0 border-0 bg-transparent p-0 ring-0 shadow-none sm:max-w-[calc(100vw-4rem)]"
        )}
      >
        <DialogTitle className="sr-only">{name}</DialogTitle>
        <DialogDescription className="sr-only">
          Decrypted attachment preview.
        </DialogDescription>
        {isVideo ? (
          <video
            src={objectUrl}
            controls
            autoPlay
            className="block max-h-[85vh] max-w-full rounded-md bg-black"
          />
        ) : (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={objectUrl}
            alt={name}
            className="block max-h-[85vh] max-w-full rounded-md object-contain"
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
