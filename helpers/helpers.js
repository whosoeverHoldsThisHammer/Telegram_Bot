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


export { sendMessage, sendMessageWithButton, updateMessage, storeMessage, getAnswer }