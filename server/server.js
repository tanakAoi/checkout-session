const express = require("express")
const cors = require("cors")

const authRouter = require("./auth/auth.router")

const app = express()

app.use(express.json())
app.use(cors())

app.use("/api/auth", authRouter)

app.listen(3000, () => console.log("Server is up and running...💡"))