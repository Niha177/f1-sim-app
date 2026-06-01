import express from "express"
import {apiApp} from "./routes.js"


const PORT = 3000
const app = express()

app.use(express.static("public"))

app.use(express.json())

app.use("/api", apiApp)


app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`)
})