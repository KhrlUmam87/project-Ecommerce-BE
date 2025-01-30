import express from "express"
import { authenticate } from "../middleware/authenticate.js"
import midtransClient from "midtrans-client"

const router = express.Router()

router.get("/process-transaction", authenticate(["user"]), async (req, res) => {
  try {
    const snap = new midtransClient.Snap({
      isProduction: false,
      serverKey: process.env.SERVER_KEY,
      clientKey: process.env.CLIENT_KEY,
    })
    const parameter = {
      transaction_details: {
        order_id: req.body.orderId,
        gross_amount: req.body,
      },
      customer_details: {
        first_name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
      },
      callbacks: {
        finish: `${process.env.DOMAIN}`,
      },
      enable_payment: [
        "mandiri_clicpay",
        "bca_va",
        "bni_va",
        "dana_va",
        "other_va",
      ],
    }
    snap
      .createTransaction(parameter)
      .then((transaction) => {
        const dataPayment = {
          midtransRespone: JSON.stringify(transaction),
        }

        const transactionToken = transaction.token
        res.status(200).json({ token: transactionToken })
      })
      .catch((error) => {
        res.status(400).json({ error: error.message })
      })
  } catch (error) {
    return res.status(500).json({ error: error.massage })
  }
})

export default router
