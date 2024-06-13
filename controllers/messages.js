import axios from 'axios'
import * as dotenv from 'dotenv'

dotenv.config();

const BASE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`


const sendMessage = (chatId, message) => {
    
    const url = `${BASE_URL}/sendMessage`

    const data = {
      chat_id: chatId,
      text: message
    };

    return axios.post(url, data)

}

const handleMessage = async(req, res) => {
    try {
        console.log(req.body)
        
        const chatId = req.body.message.chat.id

        let text = "Hola, en qué puedo ayudarte?" // Reemplazar por llamada a servicio integrador o LLM

        
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

    } catch (error){
        console.log(error)
    }
}

export { handleMessage }