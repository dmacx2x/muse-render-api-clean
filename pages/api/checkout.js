import Stripe from "stripe";
import { getAuth } from "@clerk/nextjs/server";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {

    // 🔐 Get logged-in user
    const { userId } = getAuth(req);

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // 💳 CREATE CHECKOUT SESSION
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "ATA Muse Render Pack",
            },
            unit_amount: 500, // $5 per render
          },
          quantity: 1,
        },
      ],

      success_url: "http://localhost:3000/studio?success=true",
      cancel_url: "http://localhost:3000/studio?canceled=true",

      metadata: {
        userId: userId,
      },
    });

    return res.status(200).json({
      url: session.url
    });

  } catch (err) {
    console.error("STRIPE ERROR:", err);

    return res.status(500).json({
      error: "checkout failed",
      message: err.message
    });
  }
}