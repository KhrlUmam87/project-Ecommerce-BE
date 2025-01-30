import User from "../models/User.js"
import jwt from "jsonwebtoken"

export const authenticate = (role = []) => {
  return async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
      return res.status(403).json({ message: "Anda Belum Login" })
    }
    try {
      const decode = jwt.verify(token, process.env.KEY)
      
      req.user = await User.findById(decode.id)

      if (!role.includes(req.user.role)) {
        return res
          .status(403)
          .json({ message: "kamu tidak memiliki otorisasi" })
      }

      next()
    } catch (error) {
      return res.status(403).json({ message: "Token Tidak Valid" })
    }
  }
}
