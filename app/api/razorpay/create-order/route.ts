import { NextRequest, NextResponse } from 'next/server';
import Razorpay from 'razorpay';
import { auth } from '@clerk/nextjs/server';

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const { amount, currency = 'USD', packName } = body;

    if (!amount) {
      return NextResponse.json({ error: 'Amount is required' }, { status: 400 });
    }

    const instance = new Razorpay({
      key_id: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || '',
      key_secret: process.env.RAZORPAY_KEY_SECRET || '',
    });

    const options = {
      amount: amount * 100, // amount in the smallest currency unit
      currency,
      receipt: `receipt_${Date.now()}_${userId.slice(0, 5)}`,
      notes: {
        packName,
        userId
      }
    };

    const order = await instance.orders.create(options);
    
    return NextResponse.json({ success: true, order });

  } catch (error: any) {
    console.error('Razorpay Error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
