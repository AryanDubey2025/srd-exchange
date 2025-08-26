import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    const user = await prisma.user.findUnique({
      where: {
        walletAddress: walletAddress.toLowerCase()
      },
      include: {
        bankDetails: true
      }
    })

    if (!user) {
      return NextResponse.json({
        isValid: false,
        error: 'User not found'
      })
    }

    return NextResponse.json({
      isValid: true,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        role: user.role,
        hasBankDetails: !!user.bankDetails,
        createdAt: user.createdAt
      }
    })
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}