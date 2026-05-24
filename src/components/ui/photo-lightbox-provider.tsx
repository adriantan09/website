'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from 'react'
import Lightbox, { type SlideImage } from 'yet-another-react-lightbox'
import 'yet-another-react-lightbox/styles.css'

/**
 * A single shared lightbox for all PhotoGroups inside a body. Each group
 * registers its slides with the provider on mount; clicking any photo
 * opens the global lightbox at the corresponding global index, so the
 * carousel can scroll through every photo on the page in one continuous
 * flow rather than being trapped within a single group.
 */

interface RegisteredGroup {
  id: string
  slides: SlideImage[]
}

interface PhotoLightboxContextValue {
  /** Register / refresh a group's slides. Stable identity. */
  register: (id: string, slides: SlideImage[]) => void
  /** Remove a group on unmount. Stable identity. */
  unregister: (id: string) => void
  /** Look up the current starting global index for a group. */
  getStartIndex: (id: string) => number
  /** Open the lightbox at a specific global slide index. */
  open: (globalIndex: number) => void
}

const PhotoLightboxContext = createContext<PhotoLightboxContextValue | null>(
  null,
)

export function PhotoLightboxProvider({ children }: { children: React.ReactNode }) {
  // Order matters: groups appear in the order they're registered, which
  // for a typical body render mirrors document order.
  const groupsRef = useRef<RegisteredGroup[]>([])
  // A version number lets us schedule re-renders when groups change without
  // making the context value itself depend on the groups (which would
  // cascade into every consumer's effect deps and cause a register loop).
  const [version, setVersion] = useState(0)
  const [openIndex, setOpenIndex] = useState<number>(-1)

  // Lightbox accesses `window` during render so only mount it after hydration.
  const [mounted, setMounted] = useState(false)
  useEffect(() => setMounted(true), [])

  // While the lightbox is open we want to:
  //  1. Stop the page from scrolling underneath the modal.
  //  2. Keep the page's visible content at exactly the same horizontal
  //     position so the user doesn't see a sideways jump on open/close.
  //
  // We use `overflow: hidden` on <html> to lock scrolling. The global
  // `scrollbar-gutter: stable` rule on <html> stays in effect — that means
  // even though scrolling is locked, the browser keeps the gutter reserved
  // and the layout width remains exactly the same as before opening.
  useEffect(() => {
    if (openIndex < 0) return
    if (typeof document === 'undefined') return

    const html = document.documentElement
    const previousOverflow = html.style.overflow

    html.style.overflow = 'hidden'

    return () => {
      html.style.overflow = previousOverflow
    }
  }, [openIndex])

  const register = useCallback((id: string, slides: SlideImage[]) => {
    const groups = groupsRef.current
    const existing = groups.findIndex((g) => g.id === id)
    if (existing >= 0) {
      // If the slides array has the same shape, do nothing — avoids
      // unnecessary re-renders when a group re-renders without changes.
      const prev = groups[existing].slides
      if (prev.length === slides.length && prev.every((s, i) => s.src === slides[i].src)) {
        return
      }
      groupsRef.current = [...groups]
      groupsRef.current[existing] = { id, slides }
    } else {
      groupsRef.current = [...groups, { id, slides }]
    }
    setVersion((v) => v + 1)
  }, [])

  const unregister = useCallback((id: string) => {
    groupsRef.current = groupsRef.current.filter((g) => g.id !== id)
    setVersion((v) => v + 1)
  }, [])

  const getStartIndex = useCallback((id: string) => {
    let start = 0
    for (const g of groupsRef.current) {
      if (g.id === id) return start
      start += g.slides.length
    }
    return -1
  }, [])

  const open = useCallback((globalIndex: number) => {
    setOpenIndex(globalIndex)
  }, [])

  // Stable context value: every method's identity is fixed for the lifetime
  // of the provider. Consumers' effects can safely depend on it without
  // re-running.
  const value = useMemo<PhotoLightboxContextValue>(
    () => ({ register, unregister, getStartIndex, open }),
    [register, unregister, getStartIndex, open],
  )

  // Recompute slides when a registration changes; depends on `version`
  // so React re-runs when the ref content has been updated.
  const allSlides = useMemo(
    () => groupsRef.current.flatMap((g) => g.slides),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version],
  )

  return (
    <PhotoLightboxContext.Provider value={value}>
      {children}
      {mounted && allSlides.length > 0 && (
        <Lightbox
          open={openIndex >= 0}
          index={openIndex}
          close={() => setOpenIndex(-1)}
          slides={allSlides}
          controller={{ closeOnBackdropClick: true }}
          // Opt out of the library's own body scroll lock — its padding
          // compensation interacts badly with our global
          // `scrollbar-gutter: stable` rule and causes the page width to
          // shift on open/close. We manage the lock ourselves via the
          // effect above.
          noScroll={{ disabled: true }}
          styles={{
            container: {
              backgroundColor: 'rgba(15, 15, 15, 0.85)',
              backdropFilter: 'blur(8px)',
            },
          }}
        />
      )}
    </PhotoLightboxContext.Provider>
  )
}

/**
 * Hook a PhotoGroup uses to participate in the page-wide lightbox.
 * Registers the group's slides on mount; returns an `openLocal` helper
 * that converts a local index to the corresponding global index and
 * opens the shared carousel there.
 */
export function useGroupLightbox(slides: SlideImage[]) {
  const ctx = useContext(PhotoLightboxContext)
  const id = useId()
  const slidesRef = useRef(slides)
  slidesRef.current = slides

  // Register on mount and whenever the slides reference changes; the ctx
  // methods are stable so we can list them safely.
  useEffect(() => {
    if (!ctx) return
    ctx.register(id, slides)
    return () => ctx.unregister(id)
  }, [ctx, id, slides])

  return useMemo(() => {
    if (!ctx) {
      return { openLocal: () => {} }
    }
    return {
      openLocal: (localIndex: number) => {
        const start = ctx.getStartIndex(id)
        if (start < 0) return
        ctx.open(start + localIndex)
      },
    }
  }, [ctx, id])
}
