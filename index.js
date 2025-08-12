// index.js
require('dotenv').config();
const express = require('express');
const path = require('path');
const Stripe = require('stripe');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname))); // sprístupni checkout.html z koreňa

// ===== Stripe cez ENV, nie v kóde! =====
const stripeSecret = process.env.STRIPE_SECRET_KEY;
if (!stripeSecret) {
  console.warn('⚠️ STRIPE_SECRET_KEY nie je nastavený!');
}
const stripe = Stripe(stripeSecret);

// Poskytneme publishable key do frontendu (bezpečné)
app.get('/config', (req, res) => {
  res.json({ publishableKey: process.env.STRIPE_PUBLISHABLE_KEY || '' });
});

// Endpoint na vytvorenie Payment Intentu
app.post('/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
      return res.status(400).json({ error: 'Chýba amount alebo currency.' });
    }

    // Stripe očakáva amount v najmenších jednotkách (napr. 10 € = 1000)
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      // pohodlná voľba – Stripe si vyberie vhodný spôsob platby
      automatic_payment_methods: { enabled: true },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server beží na porte ${PORT}`);
});

