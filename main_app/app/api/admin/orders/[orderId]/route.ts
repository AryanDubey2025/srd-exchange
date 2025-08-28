import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function verifyAdminAccess(request: NextRequest) {
  try {
    const walletAddress = request.headers.get('x-wallet-address')
    
    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address required' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    })

    if (!user || user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Admin access required' },
        { status: 403 }
      )
    }

    return { user }
  } catch (error) {
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}

interface RouteParams {
  params: Promise<{ orderId: string }>
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
) {
  try {

    const adminCheck = await verifyAdminAccess(request)
    if (adminCheck instanceof NextResponse) {
      return adminCheck 
    }

    const { orderId } = await params
    const { status, adminNotes, adminUpiId, adminBankDetails } = await request.json()
    
    console.log('Updating order:', orderId, 'with status:', status);
    
    const updatedOrder = await prisma.order.update({
      where: {
        id: orderId
      },
      data: {
        status,
        adminNotes,
        adminUpiId,
        adminBankDetails,
        updatedAt: new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            walletAddress: true,
            upiId: true,
            bankDetails: true
          }
        }
      }
    })

    console.log('Order updated successfully:', updatedOrder.id);

    return NextResponse.json({
      success: true,
      order: updatedOrder
    })

  } catch (error) {
    console.error('Error updating order:', error)
    return NextResponse.json(
      { error: 'Failed to update order', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}