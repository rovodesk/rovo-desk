import { motion, AnimatePresence } from "motion/react"
import { cn } from "../lib/utils"
import { useEffect } from "react"

type LoaderProps = {
  loading?: boolean
  fullScreen?: boolean
  children?: React.ReactNode
  message?: string
  variant?: "default" | "branding"
}

export const Loader = ({
  loading = true,
  fullScreen = false,
  children,
  message = "Loading ...",
  variant = "default"
}: LoaderProps) => {
  
  useEffect(() => {
    if (loading && fullScreen) {
      document.body.style.overflow = "hidden"
      return () => { document.body.style.overflow = "" }
    }
  }, [loading, fullScreen])

  return (
    <>
      <AnimatePresence>
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={cn(
              "z-50 flex flex-col items-center justify-center transition-all",
              fullScreen ? "fixed inset-0 bg-dark backdrop-blur-md" : "w-full py-12"
            )}
          >
            <div className="relative flex items-center justify-center">
              {/* Outer Orbit Ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                className="h-12 w-12 rounded-full border-t-2 border-primary border-r-2 border-r-transparent border-l-2 border-l-transparent"
              />
              
              {/* Inner Pulsing Core */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: [0.8, 1.1, 0.8], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center"
              >
                <div className="h-2 w-2 rounded-full bg-primary" />
              </motion.div>
            </div>

            {message && (
              <motion.p
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 text-xs font-medium tracking-widest uppercase text-muted-foreground"
              >
                {message}
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {!fullScreen && !loading && children}
    </>
  )
}