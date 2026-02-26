import { ReactNode, useEffect, useRef } from "react"
import { useModalContext } from "../context/modal"

type ModalOptions = {
    shouldAllowBackdropClick?: boolean
    modalBoxClassName?: string
    onModalClose?: () => void
}

export function useModal<T extends string>(
    key: T,
    content?: ReactNode,
    title?: string,
    description?: string,
    options?: ModalOptions
) {
    const { register, open, close } = useModalContext()

    const hasRegistered = useRef(false)

    useEffect(() => {
        if (hasRegistered.current) return

        register(key, content, title, description, options)
        hasRegistered.current = true
    }, [key])

    return {
        openModal: () => open(key),
        closeModal: () => close(key),
    }
}
