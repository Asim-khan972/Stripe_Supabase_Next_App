import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const { email, paymentMethodId } = await req.json();

    // Create or retrieve a Stripe customer
    let customers = await stripe.customers.list({ email });
    let customer = customers.data.length ? customers.data[0] : null;

    if (!customer) {
      customer = await stripe.customers.create({ email });
    }

    // Attach the payment method to the customer
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: customer.id,
    });

    // Set as default payment method
    await stripe.customers.update(customer.id, {
      invoice_settings: { default_payment_method: paymentMethodId },
    });

    return NextResponse.json({
      success: true,
      message: "Card added successfully",
    });
  } catch (error) {
    return NextResponse.json({ success: false, message: error.message });
  }
}
