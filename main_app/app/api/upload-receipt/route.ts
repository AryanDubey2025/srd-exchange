import { NextRequest, NextResponse } from 'next/server';
import { uploadReceiptToS3 } from '@/lib/aws/s3-upload';
import { prisma } from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const orderId = formData.get('orderId') as string;
    const orderType = formData.get('orderType') as string;

    if (!file || !orderId || !orderType) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate file type (only PDFs)
    if (file.type !== 'application/pdf') {
      return NextResponse.json(
        { success: false, error: 'Only PDF files are allowed' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { success: false, error: 'File size must be less than 10MB' },
        { status: 400 }
      );
    }

    console.log('🔍 Finding order with ID:', orderId);

    // 🔥 FIX: First find the order to get its actual ID
    const existingOrder = await prisma.order.findFirst({
      where: {
        OR: [
          { id: orderId },
          { blockchainOrderId: orderId }
        ]
      }
    });

    if (!existingOrder) {
      console.error('❌ Order not found:', orderId);
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    console.log('✅ Order found:', existingOrder.id);

    // Upload to S3
    console.log('📤 Starting S3 upload...');
    const uploadResult = await uploadReceiptToS3(file, orderId, orderType);

    if (!uploadResult.success) {
      console.error('❌ S3 upload failed:', uploadResult.error);
      return NextResponse.json(
        { success: false, error: uploadResult.error },
        { status: 500 }
      );
    }

    console.log('✅ S3 upload successful, updating order...');

    // 🔥 FIX: Use the actual order ID for update
    const updatedOrder = await prisma.order.update({
      where: { 
        id: existingOrder.id  // Use the actual order ID
      },
      data: {
        paymentProof: uploadResult.url,
        status: 'PAYMENT_SUBMITTED',
        updatedAt: new Date(),
      },
    });

    console.log('✅ Order updated successfully:', updatedOrder.id);

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      message: 'Receipt uploaded successfully',
      orderId: updatedOrder.id,
    });
  } catch (error) {
    console.error('❌ Upload receipt error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}