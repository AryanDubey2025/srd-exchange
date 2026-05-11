const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ADMIN_WALLET = '0xa78f80ac6b2dbe44a098557824ffae8b961148ca';

async function main() {
  try {
    const user = await prisma.user.upsert({
      where: { walletAddress: ADMIN_WALLET },
      update: { role: 'ADMIN' },
      create: {
        walletAddress: ADMIN_WALLET,
        role: 'ADMIN',
        profileCompleted: true,
      },
    });

    console.log('✅ Admin wallet added/updated successfully:');
    console.log(user);
  } catch (error) {
    console.error('❌ Error adding admin wallet:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
