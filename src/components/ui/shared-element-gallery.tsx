import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

export interface ImageData {
  id: string
  src: string
  alt?: string
  width?: number
  height?: number
}

interface GalleryContextType {
  selectedImage: ImageData | null
  setSelectedImage: (image: ImageData | null) => void
}

const GalleryContext = React.createContext<GalleryContextType | null>(null)

export function Gallery({ children }: { children: React.ReactNode }) {
  const [selectedImage, setSelectedImage] = React.useState<ImageData | null>(null)

  React.useEffect(() => {
    if (selectedImage) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "auto"
    }
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [selectedImage])

  return (
    <GalleryContext.Provider value={{ selectedImage, setSelectedImage }}>
      {children}
      <GalleryModal />
    </GalleryContext.Provider>
  )
}

export function GalleryGrid({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <div
      className={cn(
        "columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-4",
        className
      )}
    >
      {children}
    </div>
  )
}

export function GalleryImage({
  src,
  alt,
  id,
  className,
  imgClassName,
}: {
  src: string
  alt?: string
  id: string
  className?: string
  imgClassName?: string
}) {
  const context = React.useContext(GalleryContext)
  const [isPortrait, setIsPortrait] = React.useState(false)
  if (!context) throw new Error("GalleryImage must be used within a Gallery")
  return (
    <button
      type="button"
      data-orientation={isPortrait ? "portrait" : "landscape"}
      aria-label={`View image: ${alt || "Festival gallery image"}`}
      className={cn(
        "relative cursor-zoom-in rounded-xl overflow-hidden",
        className
      )}
      style={{ display: "block", width: "100%", padding: 0, border: 0, textAlign: "left" }}
      onClick={() => context.setSelectedImage({
        id,
        src,
        alt,
      })}
    >
      <img
        src={src}
        alt={alt || "Gallery Image"}
        loading="lazy"
        decoding="async"
        onLoad={(event) => {
          const img = event.currentTarget
          if (img.naturalHeight > img.naturalWidth) {
            setIsPortrait(true)
          }
        }}
        className={cn("w-full h-full rounded-xl", isPortrait ? "object-contain" : "object-cover", imgClassName)}
      />
    </button>
  )
}

function GalleryModal() {
  const context = React.useContext(GalleryContext)
  if (!context) return null

  const { selectedImage, setSelectedImage } = context
  const closeButtonRef = React.useRef<HTMLButtonElement>(null)
  const previousFocusRef = React.useRef<HTMLElement | null>(null)

  React.useEffect(() => {
    if (!selectedImage) return

    previousFocusRef.current = document.activeElement instanceof HTMLElement
      ? document.activeElement
      : null
    closeButtonRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setSelectedImage(null)
      if (event.key === "Tab") {
        event.preventDefault()
        closeButtonRef.current?.focus()
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      previousFocusRef.current?.focus()
      previousFocusRef.current = null
    }
  }, [selectedImage, setSelectedImage])

  return (
    <AnimatePresence>
      {selectedImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label="Festival photo viewer"
        >
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedImage(null)}
          />

          <motion.div
            className="relative z-10 w-full h-full flex items-center justify-center cursor-zoom-out"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.22 }}
            onClick={() => setSelectedImage(null)}
          >
            <img
              src={selectedImage.src}
              alt={selectedImage.alt || "Selected gallery image"}
              width={selectedImage.width}
              height={selectedImage.height}
              className="w-auto h-auto max-w-[95vw] max-h-[90vh] rounded-xl shadow-2xl object-contain"
              draggable={false}
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>

          <button
            className="absolute top-6 right-6 z-50 p-2.5 bg-white/10 text-white rounded-full backdrop-blur-md hover:bg-white/20 transition-colors"
            type="button"
            ref={closeButtonRef}
            aria-label="Close photo viewer"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}
    </AnimatePresence>
  )
}
