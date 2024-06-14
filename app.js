import express from 'express'
import axios from 'axios'
import cors from 'cors'
import routerMaster from './routes/index.js'
import * as dotenv from 'dotenv'
import RedisStore from "connect-redis"
import session from 'express-session'
import { createClient } from "redis"


dotenv.config();

const app = express()

let redisClient = createClient()

const sessionMiddleware = session({
    store: new RedisStore({ client: redisClient }),
    secret: 'super secreto',
    resave: false,
    saveUninitialized: false
})

app.use(cors());
app.use(express.json())
app.use(routerMaster)
app.use(sessionMiddleware)

const PORT = process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Server express levantado en el puerto ${PORT}`)
})

app.get("*", (req, res)=> {
    console.log(req.session)
    res.send("Hello World")
})
