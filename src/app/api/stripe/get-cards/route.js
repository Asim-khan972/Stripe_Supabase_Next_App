import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email } = await req.json();
    let customers = await stripe.customers.list({ email });
    let customer = customers.data.length ? customers.data[0] : null;

    if (!customer) return NextResponse.json({ cards: [] });

    // Retrieve attached payment methods
    const paymentMethods = await stripe.paymentMethods.list({
      customer: customer.id,
      type: "card",
    });

    return NextResponse.json({ cards: paymentMethods.data });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
