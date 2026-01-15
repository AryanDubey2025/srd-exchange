
import { PrismaClient, RateType, CurrencyType } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Checking database connection...')
    try {
        const adminAddress = "0xA4c9991e1bA3F4aeB0D360186Ba6f8f7c66cC2BF".toLowerCase()

        // 1. Check Admin User
        const admin = await prisma.user.findUnique({
            where: { walletAddress: adminAddress }
        })

        console.log('Admin user found:', admin)

        if (!admin || admin.role !== 'ADMIN') {
            console.error('User is not admin!')
        } else {
            console.log('User is confirmed as ADMIN')
        }

        // 2. Try to upsert a rate (Simulation of the API route logic)
        console.log('Attempting to upsert rate for UPI...')
        const currency = 'UPI'
        const buyRateNum = 88.88
        const sellRateNum = 87.77

        const updatedRate = await prisma.rate.upsert({
            where: {
                type_currency: {
                    type: RateType.CURRENT,
                    currency: currency as CurrencyType
                }
            },
            update: {
                buyRate: buyRateNum,
                sellRate: sellRateNum,
                updatedBy: adminAddress
            },
            create: {
                type: RateType.CURRENT,
                currency: currency as CurrencyType,
                buyRate: buyRateNum,
                sellRate: sellRateNum,
                updatedBy: adminAddress
            }
        })

        console.log('Rate upsert successful:', updatedRate)

    } catch (error) {
        console.error('Test failed:', error)
    } finally {
        await prisma.$disconnect()
    }
}

main()
