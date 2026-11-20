import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { X } from "lucide-react"

// --- Types ---
export interface ImageData {
  id: string
  src: string
  alt?: string
}

interface GalleryContextType {
  selectedImage: ImageData | null
  setSelectedImage: (image: ImageData | null) => void
}

const GalleryContext = React.createContext<GalleryContextType | null>(null)

// --- Physics ---
const spring = {
  type: "spring",
  stiffness: 350,
  damping: 35,
  mass: 1,
}

// --- Components ---

/**
 * Root Gallery Provider
 * Manages the state of the expanded image and renders the Modal.
 */
export function Gallery({ children }: { children: React.ReactNode }) {
  const [selectedImage, setSelectedImage] = React.useState<ImageData | null>(null)

  // Lock body scroll when modal is open
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

/**
 * Responsive Masonry Grid
 */
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

/**
 * Individual Gallery Image Thumbnail
 */
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
  if (!context) throw new Error("GalleryImage must be used within a Gallery")

  return (
    <motion.button
      type="button"
      whileHover="hover"
      whileTap="tap"
      aria-label={`View image: ${alt || "Festival gallery image"}`}
      className={cn(
        "relative cursor-zoom-in rounded-xl overflow-hidden",
        className
      )}
      style={{ display: "block", width: "100%", padding: 0, border: 0, background: "transparent", textAlign: "left" }}
      onClick={() => context.setSelectedImage({ id, src, alt })}
    >
      <motion.img
        layoutId={`image-${id}`}
        src={src}
        alt={alt || "Gallery Image"}
        loading="lazy"
        decoding="async"
        className={cn("w-full h-auto object-cover rounded-xl", imgClassName)}
        variants={{
          hover: { scale: 0.985 },
          tap: { scale: 0.96 },
        }}
        transition={spring}
      />
      
      {/* Subtle hover overlay for premium feel */}
      <motion.div
        variants={{
          hover: { opacity: 1 },
          tap: { opacity: 1 },
        }}
        initial={{ opacity: 0 }}
        className="absolute inset-0 bg-black/10 pointer-events-none rounded-xl"
        transition={{ duration: 0.2 }}
      />
    </motion.button>
  )
}

/**
 * Expanded View Modal with Drag-to-Dismiss
 */
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
          {/* Frosted glass backdrop */}
          <motion.div
            aria-hidden="true"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-2xl"
            style={{ cursor: "pointer" }}
            onClick={() => setSelectedImage(null)}
          />

          {/* Interactive container for drag gesture */}
          <motion.div
            className="relative z-10 w-full h-full flex items-center justify-center cursor-zoom-out"
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.8}
            onDragEnd={(e, info) => {
              // Dismiss if dragged far enough or fast enough
              if (
                Math.abs(info.offset.y) > 100 ||
                Math.abs(info.velocity.y) > 300
              ) {
                setSelectedImage(null)
              }
            }}
          >
            {/* The Shared Element */}
            <motion.img
              layoutId={`image-${selectedImage.id}`}
              src={selectedImage.src}
              alt={selectedImage.alt || "Selected gallery image"}
              className="w-auto h-auto max-w-[95vw] max-h-[90vh] rounded-xl shadow-2xl object-contain will-change-transform"
              draggable={false} // Prevent native drag to allow framer-motion drag
              transition={spring}
            />
          </motion.div>

          {/* Close Button */}
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ delay: 0.1, duration: 0.2 }}
            className="absolute top-6 right-6 z-50 p-2.5 bg-white/10 text-white rounded-full backdrop-blur-md hover:bg-white/20 transition-colors"
            type="button"
            ref={closeButtonRef}
            aria-label="Close photo viewer"
            onClick={() => setSelectedImage(null)}
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>
      )}
    </AnimatePresence>
  )
}
