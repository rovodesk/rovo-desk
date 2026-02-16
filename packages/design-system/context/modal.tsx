import React, { createContext, useContext, useState, ReactNode } from "react"

type ModalRegistry = Record<
  string,
  {
    open: boolean
        content: ReactNode  

    title?: string
    description?: string
    options?: {
      shouldAllowBackdropClick?: boolean
      modalBoxClassName?: string
      onModalClose?: () => void
    }
  }
>

type ModalContextType = {
  register: (key: string, content: ReactNode, title?: string, description?: string, options?: any) => void
  open: (key: string) => void
  close: (key: string) => void
  modals: ModalRegistry
}

const ModalContext = createContext<ModalContextType | null>(null)

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<ModalRegistry>({})

  const register = (key: string, content: ReactNode, title?: string, description?: string, options?: any) => {
    setModals((prev) => ({
      ...prev,
      [key]: {
        open: false,
        content,
        title,
        description,
        options,
      },
    }))
  }

 const open = (key: string) => {
  setModals((prev) => {
    const existing = prev[key]
    if (!existing) return prev

    return {
      ...prev,
      [key]: {
        ...existing,
        open: true,
      },
    }
  })
}


const close = (key: string) => {
  setModals((prev) => {
    const existing = prev[key]
    if (!existing) return prev

    existing.options?.onModalClose?.()

    return {
      ...prev,
      [key]: {
        ...existing,
        open: false,
      },
    }
  })
}


  return (
    <ModalContext.Provider value={{ register, open, close, modals }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModalContext = () => {
  const ctx = useContext(ModalContext)
  if (!ctx) throw new Error("useModalContext must be inside ModalProvider")
  return ctx
}
