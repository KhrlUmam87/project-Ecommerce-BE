import express from "express"
import Product from "../models/Products.js"
import { authenticate } from "../middleware/authenticate.js"

const router = express.Router()

// MENAMBAH
router.post("/add-product", authenticate(["admin"]), async (req, res) => {
  try {
    const { name, desc, category, price, capital, stock, weight } = req.body

    const profit = price - capital

    const product = await Product.create({
      name: name,
      desc: desc,
      category: category,
      price: price,
      capital: capital,
      profit: profit,
      stock: stock,
      weight: weight,
    })

    if (!product)
      return res.status(500).json({ error: "Product gagal di tambahkan " })

    res.status(200).json({ message: "Produk berhasil di tambahkan", product })
  } catch (error) {
    return res.status(500).json({ error: error.massage })
  }
})

// MELIHAT
router.get("/show-products", async (req, res, next) => {
  try {
    const products = await Product.find()

    res.status(200).json(products)
  } catch (error) {
    return res.status(500).json({ error: error.massage })
  }
})

router.get("/:name", async (req, res, next) => {
  try {
    // jika tidak menggunakan findOne maka bentuknya Arraw
    const product = await Product.findOne({ name: req.params.name })
    if (!product) {
      res.status(404).json({ error: "produk tidak tidak temukan" })
    }
    res.status(200).json(product)
  } catch (error) {
    return res.status(500).json({ error: error.massage })
  }
})

// MENGHAPUS
router.delete("/delete/:id", authenticate(["admin"]), async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    await product.deleteOne()
    res.status(200).json({ message: "product berhasil dihapus" })
  } catch (error) {
    if (error.name === "CastError") {
      res.status(404).json({ error: "produk tidak tidak temukan" })
    }
    return res.status(500).json({ error: error.message })
  }
})

// UPDATE
router.put("/update/:id", authenticate(["admin"]), async (req, res) => {
  try {
    let product = await Product.findById(req.params.id)

    const { name, desc, category, price, capital, stock, weight } = req.body
    const profit = price - capital

    const data = {
      name: name,
      desc: desc,
      category: category,
      price: price,
      capital: capital,
      profit: profit,
      stock: stock,
      weight: weight,
    }

    product = await Product.findByIdAndUpdate(req.params.id, data, {
      new: true,
      runValidators: true,
    })
    res.status(200).json({ message: "product berhasil di update" })
  } catch (error) {
    if (error.name === "CastError") {
      res.status(404).json({ error: "produk tidak tidak temukan" })
    }
    return res.status(500).json({ error: error.message })
  }
})

export default router

/*
https://mongoosejs.com/docs/queries.html

Mongoose models provide several static helper functions for CRUD operations. Each of these functions returns a mongoose Query object.

Model.deleteMany()
Model.deleteOne()
Model.find()
Model.findById()
Model.findByIdAndDelete()
Model.findByIdAndRemove()
Model.findByIdAndUpdate()
Model.findOne()
Model.findOneAndDelete()
Model.findOneAndReplace()
Model.findOneAndUpdate()
Model.replaceOne()
Model.updateMany()
Model.updateOne()
A mongoose query can be executed in one of two ways. First, if you pass in a callback function, Mongoose will execute the query asynchronously and pass the results to the callback.
*/
