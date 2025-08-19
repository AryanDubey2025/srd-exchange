import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()
    
    const user = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    })
    
    if (!user) {
      return NextResponse.json({ exists: false })
    }
    
    return NextResponse.json({ 
      exists: true, 
      role: user.role,
      userId: user.id 
    })
  } catch (error) {
    console.error('Error checking role:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
