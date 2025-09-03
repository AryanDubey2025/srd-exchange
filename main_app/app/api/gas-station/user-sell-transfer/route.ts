import { NextRequest, NextResponse } from 'next/server'
import { getGasStation } from '@/lib/gasStation'

export async function POST(request: NextRequest) {
  try {
    const { userAddress, adminAddress, usdtAmount, inrAmount, orderType, chainId } = await request.json()
    
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
    
    if (!userAddress || !adminAddress || !usdtAmount || !inrAmount || !orderType) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required parameters: userAddress, adminAddress, usdtAmount, inrAmount, orderType' 
        },
        { status: 400 }
      )
    }
    
    console.log('🔄 Gas Station user sell transfer request (BSC Mainnet):', {
      userAddress,
      adminAddress,
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
    
    // Execute user sell transfer via Gas Station
    const txHash = await gasStation.userSellOrderViaGasStation(
      userAddress as `0x${string}`,
      adminAddress as `0x${string}`,
      usdtAmount,
      inrAmount,
      orderType
    )
    
    console.log('✅ Gas Station user sell transfer successful (BSC Mainnet):', txHash)
    
    return NextResponse.json({
      success: true,
      txHash,
      chainId: 56,
      gasStationAddress: status.address,
      message: 'User sell transfer completed via Gas Station on BSC Mainnet'
    })
    
  } catch (error) {
    console.error('❌ Gas Station user sell transfer error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'User sell transfer failed' 
      },
      { status: 500 }
    )
  }
}