import express from "express"
import User from "../models/User.js"
import jwt from "jsonwebtoken"
import passport from "passport"
import { authenticate } from "../middleware/authenticate.js"

const router = express.Router()

function genereateToken(user) {
  return jwt.sign({ id: user._id }, process.env.KEY, {
    expiresIn: process.env.EXPIRES,
  })
}

// Register
router.post("/register", async (req, res) => {
  try {
    User.register(
      {
        name: req.body.name,
        username: req.body.username,
        phone: req.body.phone,
      },
      req.body.password,
      (err, user) => {
        if (err) {
          return res.status(500).json({ error: err.message })
        } else {
          const token = genereateToken(user)
          res.status(200).cookie("token", token).json({ isRegister: true })
        }
      }
    )
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error })
  }
})

//LOGIN
router.post("/login", async (req, res) => {
  try {
    passport.authenticate("local", (err, user) => {
      if (err) {
        return res.status(500).json({ error: err.message })
      } else if (!user) {
        return res.status(404).json({ error: "Username atau Password salah" })
      } else {
        req.login(user, function (err) {
          if (err) {
            return res.status(500).json({ error: err.message })
          }
          const token = genereateToken(user)

          res.status(200).cookie("token", token).json({ isLogin: true }) //menambah user untuk testing cart
        })
      }
    })(req, res) //kenapa di panggil karena cara termudah menggunakan password
  } catch (error) {
    return res.status(500).json({ error: error })
  }
})

// PROFILE
router.get("/profile", authenticate(["admin", "user"]), async (req, res) => {
  try {
    const user = req.user
    res.status(200).json(user)
  } catch (error) {
    return res.status(500).json({ error: error })
  }
})

// UPDATE Profile
router.put(
  "/update-profile",
  authenticate(["admin", "user"]),
  async (req, res) => {
    try {
      const id = req.user._id
      const user = await User.findByIdAndUpdate(id, req.body, {
        new: true,
        runValidators: true,
      })
      res.status(200).json({ message: "Berhasil di perbarui", user })
    } catch (error) {
      console.log(error)
      return res.status(500).json({ error: error })
    }
  }
)

// Menampilkan Semua user
router.get("/get", authenticate(["admin"]), async (req, res) => {
  try {
    const data = await User.find()
    const users = data.filter((user) => user.role === "user")
    res.status(200).json(users)
  } catch (error) {
    return res.status(500).json({ error: error })
  }
})

// Menghapus user
router.delete("/delete/:id", authenticate(["admin"]), async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) {
      return res.status(404).json({ error: "User tidak di temukan" })
    }

    await user.deleteOne()
    res.status(200).json({ message: "user berhasil di Hapus" })
  } catch (error) {
    console.log(error)
    return res.status(500).json({ error: error })
  }
})

export default router
