import "dotenv/config"
import app from "./app.js"
import connect from "./config/connection.js"

connect()

app.get("/", (req, res) => {
  res.send("Server Okee")
})

const port = 2000;

app.listen(port, () => {
  console.log("Server berjalan ke port : " + port)
})
