// routes/paypalRoutes.js
import express from "express";
import fetch from "node-fetch";

const router = express.Router();

const PAYPAL_CLIENT_ID = process.env.PAYPAL_CLIENT_ID;
const PAYPAL_SECRET = process.env.PAYPAL_SECRET;
const PAYPAL_URL = "https://api-m.sandbox.paypal.com"; // Change to live when deploying

// Function to get access token
async function getAccessToken() {
  const auth = Buffer.from(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`).toString("base64");

  const response = await fetch(`${PAYPAL_URL}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token || null;
}

// Create PayPal Order Route
router.post("/create-order", async (req, res) => {
  try {
    const { total } = req.body;
    if (!total) {
      return res.status(400).json({ status: "error", message: "Total amount is required" });
    }

    const accessToken = await getAccessToken();
    if (!accessToken) {
      return res.status(500).json({ status: "error", message: "Unable to get access token" });
    }

    const orderResponse = await fetch(`${PAYPAL_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [
          {
            amount: {
              currency_code: "USD",
              value: total,
            },
          },
        ],
      }),
    });

    const result = await orderResponse.json();
    res.json(result);
  } catch (error) {
    console.error("PayPal Order Error:", error);
    res.status(500).json({ status: "error", message: "Something went wrong" });
  }
});

export default router;
