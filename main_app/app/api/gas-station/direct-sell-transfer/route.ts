import { NextRequest, NextResponse } from 'next/server'
import { getGasStation } from '@/lib/gasStation'

export async function POST(request: NextRequest) {
  try {
    const { userAddress, usdtAmount, inrAmount, orderType, adminWallet, chainId } = await request.json()
    
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
    
    if (!userAddress || !usdtAmount || !inrAmount || !orderType || !adminWallet) {
      return NextResponse.json(
        { 
          success: false,
          error: 'Missing required parameters: userAddress, usdtAmount, inrAmount, orderType, adminWallet' 
        },
        { status: 400 }
      )
    }
    
    console.log('🔄 Gas Station direct sell transfer request (BSC Mainnet):', {
      userAddress,
      usdtAmount,
      inrAmount,
      orderType,
      adminWallet,
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
    
    // Execute direct sell transfer
    const txHash = await gasStation.directSellTransfer(
      userAddress as `0x${string}`,
      usdtAmount,
      inrAmount,
      orderType,
      adminWallet as `0x${string}`
    )
    
    console.log('✅ Gas Station direct sell transfer successful (BSC Mainnet):', txHash)
    
    return NextResponse.json({
      success: true,
      txHash,
      chainId: 56,
      gasStationAddress: status.address,
      message: 'Direct sell transfer completed via Gas Station on BSC Mainnet'
    })
    
  } catch (error) {
    console.error('❌ Gas Station direct sell transfer error:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error instanceof Error ? error.message : 'Direct sell transfer failed' 
      },
      { status: 500 }
    )
  }
}