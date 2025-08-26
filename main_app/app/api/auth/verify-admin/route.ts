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

    console.log('Admin verification request for:', walletAddress)

    // Check if user exists and is admin
    const user = await prisma.user.findUnique({
      where: {
        walletAddress: walletAddress.toLowerCase()
      }
    })

    console.log('Admin verification - User found:', user ? { id: user.id, role: user.role } : 'No user found')

    if (!user) {
      return NextResponse.json({
        isAdmin: false,
        error: 'User not found. Please register first.'
      })
    }

    if (user.role !== 'ADMIN') {
      return NextResponse.json({
        isAdmin: false,
        error: 'Access denied: Admin privileges required'
      })
    }

    // Update last login time for admin
    await prisma.user.update({
      where: { id: user.id },
      data: { lastLoginAt: new Date() }
    })

    console.log('Admin verification successful for:', user.walletAddress)

    return NextResponse.json({
      isAdmin: true,
      user: {
        id: user.id,
        walletAddress: user.walletAddress,
        role: user.role
      }
    })
  } catch (error) {
    console.error('Admin verification error:', error)
    return NextResponse.json(
      { error: 'Verification failed' },
      { status: 500 }
    )
  }
}