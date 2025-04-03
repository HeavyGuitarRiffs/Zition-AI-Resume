const Stripe = require("stripe");
const dotenv = require("dotenv");

dotenv.config();

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCheckoutSession = async (priceId) => {
  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${process.env.FRONTEND_URL}/success`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing`,
    });

    return session.url;
  } catch (error) {
    console.error("Stripe checkout error:", error.message);
    throw new Error(error.message);
  }
};

module.exports = { createCheckoutSession };
