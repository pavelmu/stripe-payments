const express = require("express");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// sprístupni statické súbory (napr. checkout.html) z koreňového priečinka
app.use(express.static(__dirname));

// Stripe kľúč ber z prostredia (NEukladať do kódu!)
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

// endpoint na vytvorenie Payment Intentu
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Render ti dá port cez env; lokálne padne na 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server beží na porte ${PORT}`));
