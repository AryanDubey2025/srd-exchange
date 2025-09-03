import { NextRequest, NextResponse } from 'next/server'
import { getGasStation } from '@/lib/gasStation'

export async function POST(request: NextRequest) {
  try {
    const { userAddress, usdtAmount, inrAmount, orderType, chainId } = await request.json()
    
    // Force mainnet validation
    if (chainId !== 56) {
      console.error(`❌ Invalid chainId: ${chainId}. Only BSC Mainnet (56) is supported.`)
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
    
    console.log('🏗️ Gas Station sell order creation request (BSC Mainnet):', {
      userAddress,
      usdtAmount,
      inrAmount,
      orderType,
      chainId: 56 // Force mainnet
    })
    
    // Always use mainnet gas station
    const gasStation = getGasStation(56)
    
    // Check Gas Station status
    const status = await gasStation.checkGasStationStatus()
    if (!status.isReady) {
      console.error('❌ Gas Station not ready:', status.error)
      return NextResponse.json(
        { 
          success: false,
          error: `Gas Station not ready on BSC Mainnet: ${status.error || 'Insufficient BNB balance'}` 
        },
        { status: 503 }
      )
    }
    
    // Create sell order
    const txHash = await gasStation.createSellOrder(
      userAddress as `0x${string}`,
      usdtAmount,
      inrAmount,
      orderType
    )
    
    console.log('✅ Gas Station sell order creation successful (BSC Mainnet):', txHash)
    
    return NextResponse.json({
      success: true,
      txHash,
      chainId: 56,
      gasStationAddress: status.address,
      message: 'Sell order created via Gas Station on BSC Mainnet'
    })
    
  } catch (error) {
    console.error('❌ Gas Station sell order creation error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Sell order creation failed' 
      },
      { status: 500 }
    )
  }
}