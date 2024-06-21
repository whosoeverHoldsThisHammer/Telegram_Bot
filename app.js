import express from 'express'
import axios from 'axios'
import cors from 'cors'
import routerMaster from './routes/index.js'
import * as dotenv from 'dotenv'
import session from 'express-session'
dotenv.config();

const app = express()

const store = new session.MemoryStore()

app.use(session({
    store: store,
    secret: "super secreto",
    cookie: { maxAge: 50000 },
    resave: true,
    saveUninitialized: true,
}))

app.use(cors());
app.use(express.json())
app.use(routerMaster)


const PORT = process.env.PORT

app.listen(PORT, ()=> {
    console.log(`Server express levantado en el puerto ${PORT}`)
})

app.get("/", (req, res)=> {

    // console.log(store.sessions)
    req.session.user = "Test"
    console.log("Session id: " + req.session.id)
    res.send("Hello World")
})