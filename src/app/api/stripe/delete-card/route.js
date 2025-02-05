import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { paymentMethodId } = await req.json();
    await stripe.paymentMethods.detach(paymentMethodId);
    return NextResponse.json({
      success: true,
      message: "Card removed successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
