import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { walletAddress, upiId, bankDetails } = await request.json();

    // Validate required fields
    if (!walletAddress || !upiId) {
      return NextResponse.json(
        { error: "Wallet address and UPI ID are required" },
        { status: 400 }
      );
    }

    // Check if user exists
    let user = await prisma.user.findUnique({
      where: { walletAddress },
      include: { bankDetails: true }
    });

    if (!user) {
      // Create new user if doesn't exist
      user = await prisma.user.create({
        data: {
          walletAddress,
          upiId,
          profileCompleted: true,
          lastLoginAt: new Date(),
        },
        include: { bankDetails: true }
      });
    } else {
      // Update existing user
      user = await prisma.user.update({
        where: { walletAddress },
        data: {
          upiId,
          profileCompleted: true,
          lastLoginAt: new Date(),
        },
        include: { bankDetails: true }
      });
    }

    // Handle bank details if provided
    if (bankDetails && bankDetails.accountNumber && bankDetails.ifscCode && bankDetails.branchName && bankDetails.accountHolderName) {
      // Check if bank details already exist for this user
      const existingBankDetails = await prisma.bankDetails.findUnique({
        where: { userId: user.id }
      });

      if (existingBankDetails) {
        // Update existing bank details
        await prisma.bankDetails.update({
          where: { userId: user.id },
          data: {
            accountNumber: bankDetails.accountNumber,
            ifscCode: bankDetails.ifscCode,
            branchName: bankDetails.branchName,
            accountHolderName: bankDetails.accountHolderName,
          }
        });
      } else {
        // Create new bank details
        await prisma.bankDetails.create({
          data: {
            userId: user.id,
            accountNumber: bankDetails.accountNumber,
            ifscCode: bankDetails.ifscCode,
            branchName: bankDetails.branchName,
            accountHolderName: bankDetails.accountHolderName,
          }
        });
      }
    }

    // Fetch updated user with bank details
    const updatedUser = await prisma.user.findUnique({
      where: { walletAddress },
      include: { bankDetails: true }
    });

    return NextResponse.json({
      success: true,
      message: "Profile completed successfully",
      user: {
        id: updatedUser?.id,
        walletAddress: updatedUser?.walletAddress,
        role: updatedUser?.role,
        upiId: updatedUser?.upiId,
        profileCompleted: updatedUser?.profileCompleted,
        hasBankDetails: !!updatedUser?.bankDetails,
      }
    });

  } catch (error) {
    console.error("Complete profile error:", error);
    return NextResponse.json(
      { error: "Failed to complete profile" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}