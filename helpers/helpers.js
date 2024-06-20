import axios from 'axios'
import * as dotenv from 'dotenv'
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


const getAnswer = (message, history) => {

    const url = "http://localhost:3001/test"

    const data = {
        role: "human",
        content: message,
        history: history
    }   

    return axios.post(url, data)

}

const isCallBackQuery = (req) => {
    return req.body.callback_query
}

const isNotSupportedMessage = (req) => {
    const { message } = req.body

    return message.photo || message.voice || message.document || message.poll
}

const getNotSupportedAnswer = (req) => {
    
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
}

const getSession = (chatId) => {
    // console.log(chatId)

    // Le pasa el chat id
    const url = `http://localhost:3000/sessions/${chatId}`

    return axios.get(url)

}

const createSession = (chatId) => {
    // console.log(chatId)

    // Mock
    /* const data = {
        chat_id: "555"
    }*/

    const url = "http://localhost:3000/sessions"

    // Le pasa el chat id
    const data = {
        chat_id: chatId
    }

    return axios.post(url, data)
}

const updateSession = (chatId) => {
    // console.log(chatId)
    
    // Le pasa el chat id
    const url = `http://localhost:3000/sessions/updateSession/${chatId}`


    return axios.patch(url)

}


const updateActivity = (chatId) => {
    // console.log(chatId)
    
    // Le pasa el chat id
    const url = `http://localhost:3000/sessions/updateActivity/${chatId}`

    return axios.patch(url)
}

const saveMessage = (message) => {
    const chatId = message.chat_id
    const sessionId = message.session_id

    const url = `http://localhost:3000/conversations/${chatId}/${sessionId}/saveMessage`

    const data = {
        role: message.role,
        message_id: message.message_id,
        content: message.content,
        date: message.date
    }

    return axios.patch(url, data)
}

const saveFeedback = (message) => {
    const chatId = message.chat_id

    const url = `http://localhost:3000/conversations/${chatId}/${message.message_id}/saveFeedback`

    const data = {
        feedback: message.feedback
    }

    return axios.patch(url, data)

}

const createConversation = (chatId, userId, sessionId)=> {
    
    const url = "http://localhost:3000/conversations"

    const data = {
        chat_id: chatId,
        user_id: userId,
        session_id: sessionId
    }

    return axios.post(url, data)

}

const getHistory = (chatId, sessionId)=> {
    console.log("chat_id:", chatId)
    console.log("session_id:", sessionId)

    // `http://localhost:3000/conversations/${chatId}}/${sessionId}}/messages?limit=1`
    const url = `http://localhost:3000/conversations/${chatId}/${sessionId}/messages`

    return axios.get(url)

}

export { 
    sendMessage,
    sendMessageWithButton,
    updateMessage,
    storeMessage,
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