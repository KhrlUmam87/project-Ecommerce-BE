import bodyParser from "body-parser"
import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"
import session from "express-session"
import passport from "passport"
import User from "./models/User.js"

import UserRoutes from "./routes/UserRoutes.js"
import productsRoutes from "./routes/ProductRoutes.js"
import cartRoutes from "./routes/CartRoates.js"
import ShippingRoutes from "./routes/ShippingRoutes.js"
import PaymentRoutes from "./routes/PaymentRoutes.js"

const app = express()
app.use(cors())
app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json())

app.use(
  session({
    secret: process.env.KEY,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 60 * 60 * 1000,
    },
  })
)

app.use(passport.initialize())
app.use(passport.session())

passport.use(User.createStrategy())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use("/User", UserRoutes)
app.use("/products", productsRoutes)
app.use("/cart", cartRoutes)
app.use("/shipping", ShippingRoutes)
app.use("/payment", PaymentRoutes)
export default app
