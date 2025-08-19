import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const { walletAddress } = await request.json()
    
    // Check if admin already exists
    const existingUser = await prisma.user.findUnique({
      where: { walletAddress: walletAddress.toLowerCase() }
    })
    
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 400 })
    }
    
    // Create admin user
    const admin = await prisma.user.create({
      data: {
        walletAddress: walletAddress.toLowerCase(),
        role: 'ADMIN'
      }
    })
    
    return NextResponse.json({ 
      success: true, 
      adminId: admin.id 
    })
  } catch (error) {
    console.error('Error creating admin:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
