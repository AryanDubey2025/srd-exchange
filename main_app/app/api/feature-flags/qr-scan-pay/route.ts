import { NextResponse } from 'next/server'
import { prisma, ensureConnection } from '@/lib/prisma'

export const runtime = 'nodejs'

const QR_SCAN_PAY_FLAG_KEY = 'qr_scan_pay_enabled'

export async function GET() {
  try {
    await ensureConnection()

    const featureFlag = await prisma.featureFlag.upsert({
      where: { key: QR_SCAN_PAY_FLAG_KEY },
      update: {},
      create: {
        key: QR_SCAN_PAY_FLAG_KEY,
        enabled: false,
      },
    })

    return NextResponse.json(
      {
        success: true,
        enabled: featureFlag.enabled,
        key: featureFlag.key,
        updatedAt: featureFlag.updatedAt,
      },
      {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          Pragma: 'no-cache',
          Expires: '0',
        },
      }
    )
  } catch (error) {
    console.error('Error fetching public QR feature flag:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch QR feature flag' }, { status: 500 })
  }
}
