import express from "express"
import * as dotenv from "dotenv"
import axios from "axios"

dotenv.config();

const app = express()
app.use(express.json())

const PORT = process.env.PORT
const BASE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`

app.listen(PORT, ()=> {
    console.log(`Server express levantado en el puerto ${PORT}`)
})


function sendMessage(chatId, message) {

    const url = `${BASE_URL}/sendMessage`

    const data = {
      chat_id: chatId,
      text: message
    };
  
    return axios.post(url, data)
}


app.post("*", (req, res)=> {
    console.log(req.body)

    const chatId = req.body.message.chat.id
    let text = "Hola, en qué puedo ayudarte?" // Reemplazar por llamada al LLM

    if(req.body.message.photo){
        text = "Lo siento. No estoy preparado para interpretar imágenes.\n Por favor, cargá un ticket en Jira."
    }

    if(req.body.message.voice){
        text = "Lo siento. No estoy preparado para interpretar audios.\n Por favor, cargá un ticket en Jira."
    }

    if(req.body.message.document){
        text = "Lo siento. No estoy preparado para interpretar documentos.\n Por favor, cargá un ticket en Jira."
    }

    if(req.body.message.poll){
        text = "Lo siento. No estoy preparado para responder encuestas.\n ¿Qué querías preguntarme?."
    }

    sendMessage(chatId, text).then(result => console.log("Mensaje enviado")).catch(error => console.log("Algo salío mal"))
    res.send("Hello World")
})


app.get("*", (req, res)=> {
    res.send("Hello World")
})
