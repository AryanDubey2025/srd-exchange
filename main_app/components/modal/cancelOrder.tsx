'use client'

import { X } from 'lucide-react'

interface CancelOrderModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function CancelOrderModal({ isOpen, onClose, onConfirm }: CancelOrderModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
      <div className="bg-[#181818] rounded-lg p-8 max-w-md w-full mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-white text-3xl font-medium leading-relaxed">
            Do you really want to<br />
            Cancel this order?
          </h2>
        </div>

        {/* Buttons */}
        <div className="flex space-x-6 justify-center">
          <button
            onClick={onConfirm}
            className="bg-[#622DBF] hover:bg-purple-700 text-white px-8 py-2 rounded-md font-medium transition-all"
          >
            Yes
          </button>
          <button
            onClick={onClose}
            className="bg-[#4A4A4A] hover:bg-gray-600 text-white px-8 py-2 rounded-md font-medium transition-all"
          >
            No
          </button>
        </div>
      </div>
    </div>
  )
}