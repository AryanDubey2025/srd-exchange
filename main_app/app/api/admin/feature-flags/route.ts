import { NextRequest, NextResponse } from 'next/server'
import { prisma, ensureConnection } from '@/lib/prisma'
import { verifyAdminAccess } from '@/lib/admin-middleware'

export const runtime = 'nodejs'

const QR_SCAN_PAY_FLAG_KEY = 'qr_scan_pay_enabled'

export async function GET(request: NextRequest) {
  try {
    await ensureConnection()

    const authResult = await verifyAdminAccess(request)
    if (authResult instanceof NextResponse) return authResult

    const featureFlag = await prisma.featureFlag.upsert({
      where: { key: QR_SCAN_PAY_FLAG_KEY },
      update: {},
      create: {
        key: QR_SCAN_PAY_FLAG_KEY,
        enabled: false,
      },
    })

    return NextResponse.json({
      success: true,
      featureFlag: {
        key: featureFlag.key,
        enabled: featureFlag.enabled,
        updatedAt: featureFlag.updatedAt,
      },
    })
  } catch (error) {
    console.error('Error fetching admin feature flag:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch feature flag' }, { status: 500 })
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await ensureConnection()

    const authResult = await verifyAdminAccess(request)
    if (authResult instanceof NextResponse) return authResult

    const body = await request.json()
    const { key, enabled } = body

    if (key !== QR_SCAN_PAY_FLAG_KEY || typeof enabled !== 'boolean') {
      return NextResponse.json({ success: false, error: 'Invalid feature flag payload' }, { status: 400 })
    }

    const featureFlag = await prisma.featureFlag.upsert({
      where: { key },
      update: { enabled },
      create: { key, enabled },
    })

    return NextResponse.json({
      success: true,
      featureFlag: {
        key: featureFlag.key,
        enabled: featureFlag.enabled,
        updatedAt: featureFlag.updatedAt,
      },
    })
  } catch (error) {
    console.error('Error updating admin feature flag:', error)
    return NextResponse.json({ success: false, error: 'Failed to update feature flag' }, { status: 500 })
  }
}
