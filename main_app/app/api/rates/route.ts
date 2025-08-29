import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // Disable caching for this endpoint
    const response = NextResponse.next()
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    const rates = await prisma.rate.findMany({
      where: {
        type: 'CURRENT'
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    console.log('Public rates API called, returning:', rates.length, 'rates');

    // If no rates exist, create default rates
    if (rates.length === 0) {
      const defaultRates = await Promise.all([
        prisma.rate.create({
          data: {
            type: 'CURRENT',
            currency: 'UPI',
            buyRate: 85.6,
            sellRate: 85.6,
            updatedBy: 'system'
          }
        }),
        prisma.rate.create({
          data: {
            type: 'CURRENT',
            currency: 'CDM',
            buyRate: 85.6,
            sellRate: 85.6,
            updatedBy: 'system'
          }
        })
      ])
      
      return NextResponse.json({ 
        rates: defaultRates.map(rate => ({
          buyRate: rate.buyRate,
          sellRate: rate.sellRate,
          currency: rate.currency,
          updatedAt: rate.updatedAt
        }))
      }, {
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        }
      })
    }

    return NextResponse.json({ 
      rates: rates.map(rate => ({
        buyRate: rate.buyRate,
        sellRate: rate.sellRate,
        currency: rate.currency,
        updatedAt: rate.updatedAt
      }))
    }, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
  } catch (error) {
    console.error('Error fetching rates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch rates' },
      { status: 500 }
    )
  }
}