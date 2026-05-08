import { draftMode } from 'next/headers'

/**
 * Renders a small floating banner at the bottom of every page when Draft
 * Mode is enabled, so the editor doesn't forget they're seeing drafts (and
 * can exit with a single tap on mobile).
 *
 * Server component: relies on `draftMode()` from next/headers, so it can
 * be safely embedded in the root layout without any client JS.
 */
export async function DraftModeBanner() {
  const isEnabled = (await draftMode()).isEnabled
  if (!isEnabled) return null

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 rounded-full border border-border bg-foreground text-background px-4 py-2 text-xs font-semibold shadow-lg backdrop-blur">
      <span className="flex items-center gap-2">
        <span className="inline-block h-2 w-2 rounded-full bg-orange-400 animate-pulse" />
        Preview mode — viewing unpublished drafts
      </span>
      <a
        href="/api/disable-draft"
        className="underline underline-offset-4 hover:opacity-80"
      >
        Exit
      </a>
    </div>
  )
}
