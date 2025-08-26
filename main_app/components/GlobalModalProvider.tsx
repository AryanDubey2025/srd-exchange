'use client'

import { useModal } from '@/contexts/ModalContext'
import WalletConnectModal from './auth/WalletConnectModal'

export default function GlobalModalProvider() {
  const { isWalletModalOpen, closeWalletModal } = useModal()

  return (
    <WalletConnectModal
      isOpen={isWalletModalOpen}
      onClose={closeWalletModal}
      onSuccess={closeWalletModal}
    />
  )
}