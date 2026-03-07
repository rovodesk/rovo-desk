import { ComponentType, useEffect, useRef } from "react";
import { useModalContext, ModalOptions } from "../context/modal";

export function useModal<T extends string>(
  key: T,
  component: ComponentType<any>,
  title?: string,
  description?: string,
  options?: ModalOptions
) {
  const { register, open, close } = useModalContext();

  const openModal = () => {
    register(key, component, title, description, options);
    open(key);
  };

  return {
    openModal,
    closeModal: () => close(key),
  };
}