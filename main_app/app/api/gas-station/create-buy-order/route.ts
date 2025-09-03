import { NextRequest, NextResponse } from 'next/server'
import { getGasStation } from '@/lib/gasStation'

export async function POST(request: NextRequest) {
  try {
    const { userAddress, usdtAmount, inrAmount, orderType, chainId } = await request.json()
    
    // Force mainnet validation
    if (chainId !== 56) {
      return NextResponse.json(
        { 
          success: false,
          error: `Invalid network. Only BSC Mainnet (Chain ID 56) is supported. Received: ${chainId}` 
        },
        { status: 400 }
      )
    }
    
    if (!userAddress || !usdtAmount || !inrAmount || !orderType) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required parameters: userAddress, usdtAmount, inrAmount, orderType' 
        },
        { status: 400 }
      )
    }
    
    console.log('🏗️ Gas Station buy order creation request (BSC Mainnet):', {
      userAddress,
      usdtAmount,
      inrAmount,
      orderType,
      chainId: 56
    })
    
    const gasStation = getGasStation(56)
    
    // Check Gas Station status
    const status = await gasStation.checkGasStationStatus()
    if (!status.isReady) {
      return NextResponse.json(
        { 
          success: false,
          error: `Gas Station not ready on BSC Mainnet: ${status.error || 'Insufficient BNB balance'}` 
        },
        { status: 503 }
      )
    }
    
    // Create buy order
    const txHash = await gasStation.createBuyOrder(
      userAddress as `0x${string}`,
      usdtAmount,
      inrAmount,
      orderType
    )
    
    console.log('✅ Gas Station buy order creation successful (BSC Mainnet):', txHash)
    
    return NextResponse.json({
      success: true,
      txHash,
      chainId: 56,
      gasStationAddress: status.address,
      message: 'Buy order created via Gas Station on BSC Mainnet'
    })
    
  } catch (error) {
    console.error('❌ Gas Station buy order creation error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Buy order creation failed' 
      },
      { status: 500 }
    )
  }
}