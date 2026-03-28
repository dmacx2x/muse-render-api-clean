import Stripe from "stripe";
import { buffer } from "micro";
import { getDB } from "../../lib/db";

export const config = {
  api: {
    bodyParser: false,
  },
};

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {

  if (req.method !== "POST") {
    return res.status(405).send("Method Not Allowed");
  }

  const sig = req.headers["stripe-signature"];

  let event;

  try {
    const buf = await buffer(req);

    event = stripe.webhooks.constructEvent(
      buf,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );

  } catch (err) {
    console.error("Webhook error:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // 💰 HANDLE SUCCESSFUL PAYMENT
  if (event.type === "checkout.session.completed") {

    const session = event.data.object;

    const userId = session.metadata.userId;

    const sql = getDB();

    try {

      // Create credits table if not exists
      await sql`
        CREATE TABLE IF NOT EXISTS user_credits (
          user_id TEXT PRIMARY KEY,
          credits INTEGER DEFAULT 0
        )
      `;

      // Add 1 credit per purchase (you can scale later)
      await sql`
        INSERT INTO user_credits (user_id, credits)
        VALUES (${userId}, 1)
        ON CONFLICT (user_id)
        DO UPDATE SET credits = user_credits.credits + 1
      `;

      console.log("Credits added to user:", userId);

    } catch (err) {
      console.error("DB ERROR:", err);
    }
  }

  res.status(200).json({ received: true });
}