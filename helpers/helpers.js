import axios from 'axios'
import * as dotenv from 'dotenv'
dotenv.config();

const BASE_URL = `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}`
const MONGO_URL = `http://localhost:${process.env.MONGO_PORT}`
const LLM_URL = `http://localhost:${process.env.LLM_PORT}`


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
                { "text": "👎🏻", "callback_data": "Negativa" },
                { "text": "👍🏻", "callback_data": "Positiva" }

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

const getAnswer = (message, history) => {

    const url = `${LLM_URL}/chat`
    //console.log("LLM URL: ",url)

    const data = {
        role: "human",
        content: message,
        history: history
    }   

    return axios.post(url, data)

    //para probar devuelve el mismo mensaje que me envian
    // return {
    //         data: {
    //             answer: message
    //         }
    //     }

}

const isCallBackQuery = (req) => {
    return req.body.callback_query
}

const isNotSupportedMessage = (req) => {
    if (!req.body){ //caso para cuando mandan una imagen sin texto, no hay body. mismo los audios, stickers, archivos etc...
        return true
    }else{ //si mandan texto + imagen existe body pero aun asi no es soportado.
        const { message } = req.body
        return message.photo || message.voice || message.document || message.poll
    }
}

const getNotSupportedAnswer = (req) => {
    
    try { //de momento siempre caemos en el primer return
        if (!req.body){
            return "No puedo interpretar mensajes que no sean escritos, porfavor cargá un ticket en jira :)"
        }

        const { message } = req.body

        if(message.photo){
            
            return "Lo siento. No estoy preparado para interpretar imágenes.\n Por favor, cargá un ticket en Jira."
    
        } else if(message.voice){
            
            return "Lo siento. No estoy preparado para interpretar audios.\n Por favor, cargá un ticket en Jira."
    
        } else if(message.document){
            
            return "Lo siento. No estoy preparado para interpretar documentos.\n Por favor, cargá un ticket en Jira."
    
        } else if (message.poll){
            
            return "Lo siento. No estoy preparado para responder encuestas.\n ¿Qué querías preguntarme?."
    
        }

    } catch (error) {
        console.log("Not Supported Answer error: ", error)
    }
    
    
    
}

const getSession = async (chatId) => {
    const url = `${MONGO_URL}/sessions/${chatId}`
    let data;

    try {
        data = await axios.get(url)
    } catch (error) {
        console.log("GET SESSION ERROR: ", error)
    }

    return data

}

const createSession = async (chatId) => {
    const url = `${MONGO_URL}/sessions`
    let response
    const data = {
        chat_id: chatId
    }

    try {
        response = await axios.post(url, data)
    } catch (error) {
        console.log("error en create session: ", error)
    }
    

    return response;
}

const updateSession = async (chatId) => {
    const url = `${MONGO_URL}/sessions/updateSession/${chatId}`
    let response

    try {
        response = await axios.patch(url)
    } catch (error) {
        console.log("error en update session: ", error)
    }

    return response

}


const updateActivity = async (chatId) => {
    const url = `${MONGO_URL}/sessions/updateActivity/${chatId}`
    let response

    try {
        response = await axios.patch(url)
    } catch (error) {
        console.log("updateActivity error: ", error)
    }

    return response
}

const saveMessage = async (message) => {
    const chatId = message.chat_id
    const sessionId = message.session_id

    const url = `${MONGO_URL}/conversations/${chatId}/${sessionId}/saveMessage`

    const data = {
        role: message.role,
        message_id: message.message_id,
        content: message.content,
        date: message.date
    }

    console.log("Guardo lo siguiente: ", data)
    let response
    
    try {
        response = await axios.patch(url, data)
    } catch (error) {
        console.log("error en saveMessage: ", error)
    }
    
    return response
}

const saveFeedback = async (message) => {
    const chatId = message.chat_id
    const url = `${MONGO_URL}/conversations/${chatId}/${message.message_id}/saveFeedback`

    const data = {
        feedback: message.feedback
    }

    try {
        
    } catch (error) {
        console.log("saveFeedback error: ", error)
    }
    return axios.patch(url, data)

}

const createConversation = async (chatId, userId, sessionId)=> {
    
    const url = `${MONGO_URL}/conversations`
    let response
    const data = {
        chat_id: chatId,
        user_id: userId,
        session_id: sessionId
    }

    try {
        response = await axios.post(url, data)
    } catch (error) {
        console.log("Create Conversation error: ", error)
    }
    

    return response

}

const getHistory = async (chatId, sessionId)=> {
    const url = `${MONGO_URL}/conversations/${chatId}/${sessionId}/messages`

    let response
    try {
        response = await axios.get(url)
    } catch (error) {
        console.log("GetHistory error: ", error)
    }
    return response

}

export { 
    sendMessage,
    sendMessageWithButton,
    updateMessage,
    getAnswer,
    isCallBackQuery,
    isNotSupportedMessage,
    getNotSupportedAnswer,
    getSession,
    createSession,
    updateActivity,
    updateSession,
    saveMessage,
    saveFeedback,
    createConversation,
    getHistory
}