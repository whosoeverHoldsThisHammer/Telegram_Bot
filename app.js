import express from 'express'
import axios from 'axios'
import cors from 'cors'
import routerMaster from './routes/index.js'
import * as dotenv from 'dotenv'

dotenv.config();

const app = express()

app.use(cors());
app.use(express.json())
app.use(routerMaster)

const PORT = process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Server express levantado en el puerto ${PORT}`)
})


app.get("*", (req, res)=> {
    res.send("Hello World")
})
