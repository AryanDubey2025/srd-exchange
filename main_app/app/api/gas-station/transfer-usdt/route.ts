import { NextRequest, NextResponse } from 'next/server'
import { getGasStation } from '@/lib/gasStation'
import { parseUnits, formatUnits, Address } from 'viem'

const ADMIN_WALLET = '0xa78f80ac6b2dbe44a098557824ffae8b961148ca'
const USDT_DECIMALS = 18

export async function POST(request: NextRequest) {
  try {
    const { userAddress, usdtAmount } = await request.json()

    if (!userAddress || !usdtAmount || isNaN(parseFloat(usdtAmount)) || parseFloat(usdtAmount) <= 0) {
      return NextResponse.json(
        { success: false, error: 'Missing or invalid parameters: userAddress, usdtAmount' },
        { status: 400 }
      )
    }

    console.log('🏗️ Gas Station USDT transfer request:', { userAddress, usdtAmount })

    const gasStation = getGasStation(56)
    const gasStationAddress = gasStation.getAddress?.() || 'unknown'
    console.log('🔧 Gas Station address:', gasStationAddress)

    if (!gasStation.isReady()) {
      console.error('❌ Gas Station not ready. GAS_STATION_PRIVATE_KEY may be missing or invalid.')
      return NextResponse.json(
        { success: false, error: 'Gas Station not ready. Please try again later.' },
        { status: 503 }
      )
    }

    // Log gas station BNB balance before proceeding
    try {
      const balCheck = await gasStation.checkGasStationBalance()
      console.log('💰 Gas Station BNB balance check:', balCheck)
    } catch (balErr) {
      console.error('❌ Failed to check Gas Station balance:', balErr)
    }

    const result = await gasStation.handleCompletelyGaslessFlow(
      userAddress as Address,
      ADMIN_WALLET as Address,
      usdtAmount,
      0,
      'SELL_UPI'
    )

    console.log('✅ Gas Station result:', JSON.stringify(result, null, 2))

    return NextResponse.json({
      success: true,
      ...result,
      gasStationAddress,
      usdtAmount,
    })
  } catch (error) {
    console.error('❌ Gas Station transfer error:', error)
    const message = error instanceof Error ? error.message : 'Transfer failed'
    return NextResponse.json({ success: false, error: message }, { status: 500 })
  }
}
