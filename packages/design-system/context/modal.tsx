"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../components/ui/dialog";

export type ModalOptions = {
  shouldAllowBackdropClick?: boolean;
  modalBoxClassName?: string;
  onModalClose?: () => void;
};

type ModalRegistry = Record<
  string,
  {
    open: boolean;
    component: React.ComponentType<any>;
    title?: string;
    description?: string;
    options?: ModalOptions;
  }
>;

type ModalContextType = {
  register: (
    key: string,
    component: React.ComponentType<any>,
    title?: string,
    description?: string,
    options?: ModalOptions
  ) => void;
  open: (key: string) => void;
  close: (key: string) => void;
  modals: ModalRegistry;
};

const ModalContext = createContext<ModalContextType | null>(null);

export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [modals, setModals] = useState<ModalRegistry>({});

  const register = (key: string, component: React.ComponentType<any>, title?: string, description?: string, options?: ModalOptions) => {
    setModals((prev) => {
      if (prev[key]) return prev;
      return {
        ...prev,
        [key]: { open: false, component, title, description, options },
      }
    });
  };

  const open = (key: string) => {
    setModals((prev) => {
      const existing = prev[key];
      if (!existing) return prev;
      return {
        ...prev,
        [key]: { ...existing, open: true },
      };
    });
  };

  const close = (key: string) => {
    setModals((prev) => {
      const existing = prev[key];
      if (!existing) return prev;
      if (existing.open) existing.options?.onModalClose?.();
      return { ...prev, [key]: { ...existing, open: false } };
    });
  };

  return (
    <ModalContext.Provider value={{ register, open, close, modals }}>
      {children}
      {Object.entries(modals).map(([key, modal]) => {
        const Component = modal.component;
        return (
          <Dialog key={key} open={modal.open} onOpenChange={(isOpen) => !isOpen && close(key)}>
            <DialogContent className={modal.options?.modalBoxClassName}>
              {(modal.title || modal.description) && (
                <DialogHeader>
                  {modal.title && <DialogTitle>{modal.title}</DialogTitle>}
                  {modal.description && <DialogDescription>{modal.description}</DialogDescription>}
                </DialogHeader>
              )}
              <Component />
            </DialogContent>
          </Dialog>
        );
      })}
    </ModalContext.Provider>
  );
};

export const useModalContext = () => {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModalContext must be inside ModalProvider");
  return ctx;
};