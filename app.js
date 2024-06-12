import express from "express"
import * as dotenv from "dotenv"

dotenv.config();

const app = express()
app.use(express.json())

const PORT = process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Server express levantado en el puerto ${PORT}`)
})