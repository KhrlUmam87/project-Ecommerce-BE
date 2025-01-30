import express from "express"
import { authenticate } from "../middleware/authenticate.js"
import axios from "axios"
import dotenv from "dotenv"
dotenv.config()

const router = express.Router()
axios.defaults.baseURL = process.env.API_ONGKIR_BASE_URL
axios.defaults.headers.common[
  "Authorization"
] = `Bearer ${process.env.API_ONGKIR_KEY}`
axios.defaults.headers.post["Content-Type"] = "application/json"

router.get("/provinces", authenticate(["user"]), async (req, res) => {
  try {
    const response = await axios.get("/province")
    res.status(200).json(response.data.data) // Sesuaikan dengan struktur respons API Ongkir
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
})

router.get("/city/:province_id", authenticate(["user"]), async (req, res) => {
  try {
    const id = req.params.province_id
    const cities = await axios.get(`city?province=${id}`)
    res.status(200).json(cities)
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error.message })
  }
})
export default router
