const express = require("express");
const Stripe = require("stripe");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const stripe = Stripe("sk_test_51RvEnt9aViwz7NDmDhMFrE8Z7GyV7yRj41b2gaXWli3Rbt2jKl9vX5E9IP7i2RxYVwYaF74Tdq8uyG5a7FAan3DJ006Z0FthX6");

app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount, currency } = req.body;

    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount,
      currency: currency,
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, () => console.log("Server beží na porte 3000"));
