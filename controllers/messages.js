import axios from 'axios'
import * as dotenv from 'dotenv'
import { isStartCommand } from '../utils/regex.js';

dotenv.config();

const BASE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`


const sendMessage = (chatId, message) => {
    
    const url = `${BASE_URL}/sendMessage`

    const data = {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown'
    }

    return axios.post(url, data)

}


const sendMessageWithButton = (chatId, message) => {

    const url = `${BASE_URL}/sendMessage`

    const data = {
      chat_id: chatId,
      text: message,
      parse_mode: 'Markdown',
      reply_markup: {
        'inline_keyboard': [
            [
                { "text": "👍🏻", "callback_data": "Positiva" },
                { "text": "👎🏻", "callback_data": "Negativa" }
            ]
        ]
      }
    }

    return axios.post(url, data)

}


const updateMessage = (chatId, messageId)=> {

    const url = `${BASE_URL}/editMessageReplyMarkup`

    const data = {
        chat_id: chatId,
        message_id: messageId,
        reply_markup: {}
    }

    return axios.post(url, data)

}


const storeMessage = (msg)=> {

    let { chat, message_id, from, date, text } = msg

    const url = "http://localhost:3000/conversations"

    const data = { 
        chat_id: chat.id,
        message_id: message_id,
        user_id: from.id,
        role: from.is_bot === false ? "human" : "aiMessage",
        date: new Date(date * 1000),
        content: text,
        context: "Telegram"
    }

    axios.post(url, data)
    .then(result => console.log(result))
    .catch(error => console.log(error))
    
}


const getAnswer = () => {

    // TODO
    // Obtener el content del mensaje

    const url = "http://localhost:3001/test"

    const data = {
        role: "human",
        content: "Cómo configuro un almacén?",
        history: []
    }

    return axios.post(url, data)

}

const handleMessage = async(req, res, next) => {
    try {

        let chatId

        if (req.body.callback_query) {
            
            const { message } = req.body.callback_query

            let chatId = message.chat.id
            let messageId = message.message_id
            // let feedback = req.body.callback_query.data
            
            // console.log("Chat id: " + chatId)
            // console.log("Calificación: " + feedback)
            // console.log("Message id: " + messageId)

            let answer = "Gracias por el feedback"

            updateMessage(chatId, messageId)
            .then(result => console.log("Mensaje actualizado"))
            .catch(error => console.log("Algo salío mal"))

            sendMessage(chatId, answer)
            .then(result => console.log("Mensaje enviado"))
            .catch(error => console.log("Algo salío mal"))

        } else {
            const { message } = req.body

            chatId = message.chat.id
            let answer

            if(message.photo){
            
                answer = "Lo siento. No estoy preparado para interpretar imágenes.\n Por favor, cargá un ticket en Jira."
    
            } else if(message.voice){
                
                answer = "Lo siento. No estoy preparado para interpretar audios.\n Por favor, cargá un ticket en Jira."
    
            } else if(message.document){
                
                answer = "Lo siento. No estoy preparado para interpretar documentos.\n Por favor, cargá un ticket en Jira."
    
            } else if (message.poll){
                
                answer = "Lo siento. No estoy preparado para responder encuestas.\n ¿Qué querías preguntarme?."
    
            } else {
    
                // answer = "Hola, en qué puedo ayudarte?" // Reemplazar por llamada a servicio integrador o LLM
                // answer = "Todavía no puedo contestarte preguntas de la base de conocimiento \n\n [Te mando un pikachu](https://www.destructoid.com/wp-content/uploads/2020/12/473652-pika.jpg)"
    
                if(isStartCommand(message.text)){
                    answer = "Bienvenido!"

                    sendMessage(chatId, answer)
                    .then(result => console.log("Mensaje enviado"))
                    .catch(error => console.log("Algo salío mal"))

                } else {
                    // answer = "Respuesta generada por la IA"

                    getAnswer()
                    .then(result => {
                        answer = result.data.answer

                        sendMessageWithButton(chatId, answer)
                        .then(result => console.log("Mensaje enviado"))
                        .catch(error => {
                            console.log("Algo salío mal")
                            console.log(error)
                        })

                    })
                    .catch(error => console.log(error))

                    storeMessage(req.body.message)
                }  
    
            }

        }

        res.send("Hello World")

    } catch (error){
        console.log(error)
    }
}

export { handleMessage }