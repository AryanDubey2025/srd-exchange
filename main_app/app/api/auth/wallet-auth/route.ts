import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, walletData, action } = await request.json()

    if (!walletAddress) {
      return NextResponse.json(
        { error: 'Wallet address is required' },
        { status: 400 }
      )
    }

    const normalizedAddress = walletAddress.toLowerCase()

    if (action === 'login') {
      // Check if user exists
      const user = await prisma.user.findUnique({
        where: { walletAddress: normalizedAddress },
        include: { bankDetails: true }
      })

      if (!user) {
        return NextResponse.json({
          exists: false,
          requiresRegistration: true
        })
      }

      // Update last login time
      await prisma.user.update({
        where: { id: user.id },
        data: {
          lastLoginAt: new Date()
        }
      })

      return NextResponse.json({
        exists: true,
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          role: user.role,
          profileCompleted: user.profileCompleted || false,
          upiId: user.upiId,
          hasBankDetails: !!user.bankDetails,
          createdAt: user.createdAt,
          lastLoginAt: new Date()
        }
      })
    }

    if (action === 'register') {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { walletAddress: normalizedAddress }
      })

      if (existingUser) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        )
      }

      // Determine role
      const role = determineUserRole(normalizedAddress)

      // Create new user
      const user = await prisma.user.create({
        data: {
          walletAddress: normalizedAddress,
          role,
          profileCompleted: false, // New users need to complete profile
          lastLoginAt: new Date()
        }
      })

      console.log('New user registered:', {
        id: user.id,
        address: user.walletAddress,
        role: user.role
      })

      return NextResponse.json({
        success: true,
        user: {
          id: user.id,
          walletAddress: user.walletAddress,
          role: user.role,
          profileCompleted: user.profileCompleted,
          createdAt: user.createdAt,
          isNewUser: true
        }
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('Wallet auth error:', error)
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
}

// Helper function to determine user role
function determineUserRole(walletAddress: string): 'USER' | 'ADMIN' {
  // Define admin wallet addresses
  const adminWallets = [
    '0x742d35cc6635c0532925a3b8d20ae4e3d56fb427',
    // Add your admin wallet addresses here
  ]

  return adminWallets.includes(walletAddress.toLowerCase()) ? 'ADMIN' : 'USER'
}