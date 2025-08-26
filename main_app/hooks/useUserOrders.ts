import { useState, useEffect } from 'react'
import { useAccount } from 'wagmi'

interface Order {
  id: string
  blockchainOrderId?: number
  amount: string
  orderType: 'BUY_UPI' | 'BUY_CDM' | 'SELL'
  status: 'PENDING' | 'ADMIN_APPROVED' | 'PAYMENT_SUBMITTED' | 'COMPLETED' | 'CANCELLED'
  paymentProof?: string
  adminUpiId?: string
  adminBankDetails?: string
  adminNotes?: string
  createdAt: string
  updatedAt: string
}

interface UseUserOrdersReturn {
  orders: Order[]
  ongoingOrders: Order[]
  completedOrders: Order[]
  isLoading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useUserOrders(): UseUserOrdersReturn {
  const { address, isConnected } = useAccount()
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = async () => {
    if (!address || !isConnected) return

    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch(`/api/orders?walletAddress=${address}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch orders')
      }
      
      const data = await response.json()
      setOrders(data.orders || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch orders')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (isConnected && address) {
      fetchOrders()
    } else {
      setOrders([])
    }
  }, [isConnected, address])

  // Separate ongoing and completed orders
  const ongoingOrders = orders.filter(order => 
    ['PENDING', 'ADMIN_APPROVED', 'PAYMENT_SUBMITTED'].includes(order.status)
  )
  
  const completedOrders = orders.filter(order => 
    ['COMPLETED', 'CANCELLED'].includes(order.status)
  )

  return {
    orders,
    ongoingOrders,
    completedOrders,
    isLoading,
    error,
    refetch: fetchOrders
  }
}