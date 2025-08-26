'use client'

import { useAdminAPI } from '@/hooks/useAdminAPI'
import { useEffect, useState } from 'react'

export default function AdminOrderList() {
  const { makeAdminRequest, loading, error } = useAdminAPI()
  const [orders, setOrders] = useState([])

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    try {
      const data = await makeAdminRequest('/api/admin/orders')
      setOrders(data.orders)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    }
  }

  const approveOrder = async (orderId: string) => {
    try {
      await makeAdminRequest('/api/admin/orders', {
        method: 'POST',
        body: JSON.stringify({ action: 'approve', orderId })
      })
      fetchOrders() // Refresh the list
    } catch (err) {
      console.error('Failed to approve order:', err)
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div>
      {orders.map((order: any) => (
        <div key={order.id} className="border p-4 mb-2">
          <p>Order ID: {order.id}</p>
          <button onClick={() => approveOrder(order.id)}>
            Approve Order
          </button>
        </div>
      ))}
    </div>
  )
}