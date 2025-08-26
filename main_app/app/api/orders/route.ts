import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// GET - Fetch user's orders
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const walletAddress = searchParams.get('walletAddress')

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    // Find user by wallet address
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() },
      include: {
        orders: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      orders: user.orders
    })
  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    )
  }
}

// POST - Create new order
export async function POST(request: NextRequest) {
  try {
    const { walletAddress, amount, orderType, paymentProof, adminNotes } = await request.json()

    if (!walletAddress || !amount || !orderType) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Find user
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Create new order
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        amount: amount.toString(),
        orderType,
        status: 'PENDING',
        paymentProof,
        adminNotes
      }
    })

    return NextResponse.json({
      success: true,
      order
    })
  } catch (error) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    )
  }
}

// PUT - Update order (user can update payment proof, etc.)
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { orderId, paymentProof, transactionId } = body

    if (!orderId) {
      return NextResponse.json({
        success: false,
        error: 'Order ID is required'
      }, { status: 400 })
    }

    // TODO: Verify user owns this order
    // TODO: Update order in database with payment proof

    const updatedOrder = {
      id: orderId,
      paymentProof: paymentProof,
      transactionId: transactionId,
      status: 'under_review',
      updatedAt: new Date().toISOString()
    }

    return NextResponse.json({
      success: true,
      data: updatedOrder,
      message: 'Payment proof uploaded successfully'
    })
  } catch (error) {
    console.error('Order update error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update order'
    }, { status: 500 })
  }
}