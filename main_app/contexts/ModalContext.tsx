'use client'

import { createContext, useContext, useState, ReactNode } from 'react'

interface ModalContextType {
  isWalletModalOpen: boolean
  openWalletModal: () => void
  closeWalletModal: () => void
}

const ModalContext = createContext<ModalContextType | undefined>(undefined)

export function ModalProvider({ children }: { children: ReactNode }) {
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false)

  const openWalletModal = () => setIsWalletModalOpen(true)
  const closeWalletModal = () => setIsWalletModalOpen(false)

  return (
    <ModalContext.Provider value={{
      isWalletModalOpen,
      openWalletModal,
      closeWalletModal
    }}>
      {children}
    </ModalContext.Provider>
  )
}

export const useModal = () => {
  const context = useContext(ModalContext)
  if (context === undefined) {
    throw new Error('useModal must be used within a ModalProvider')
  }
  return context
}