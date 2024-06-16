import { sendMessage, sendMessageWithButton, updateMessage, storeMessage, getAnswer, isCallBackQuery, isNotSupportedMessage, getNotSupportedAnswer } from '../helpers/helpers.js'
import { isStartCommand } from '../utils/regex.js';


const handleMessage = async(req, res, next) => {
    try {
        
        if(isCallBackQuery(req)){

            const { message } = req.body.callback_query

            let chatId = message.chat.id
            let messageId = message.message_id
            let answer = "Gracias por el feedback"

            updateMessage(chatId, messageId)
            .then(result => console.log("Mensaje actualizado"))
            .catch(error => console.log("Algo salío mal"))

            sendMessage(chatId, answer)
            .then(result => console.log("Mensaje enviado"))
            .catch(error => console.log("Algo salío mal"))

        }

        if(isNotSupportedMessage(req)){

            const { message } = req.body
            let chatId = message.chat.id
            let answer = getNotSupportedAnswer(req)

            sendMessage(chatId, answer)
            .then(result => console.log("Mensaje enviado"))
            .catch(error => console.log("Algo salío mal"))

        } else {

            const { message } = req.body
            let chatId = message.chat.id

            if(isStartCommand(message.text)){
                let answer = "Bienvenido!"

                sendMessage(chatId, answer)
                .then(result => console.log("Mensaje enviado"))
                .catch(error => console.log("Algo salío mal"))

            } else {
                let answer = "Respuesta generada por la IA"

                sendMessageWithButton(chatId, answer)
                    .then(result => console.log("Mensaje enviado"))
                    .catch(error => {
                        console.log("Algo salío mal")
                        console.log(error)
                })

                /* getAnswer()
                .then(result => {
                    answer = result.data.answer

                    sendMessageWithButton(chatId, answer)
                    .then(result => console.log("Mensaje enviado"))
                    .catch(error => {
                        console.log("Algo salío mal")
                        console.log(error)
                    })

                })
                .catch(error => console.log(error))*/

                // storeMessage(req.body.message)
            }

        }

        res.send("Hello World")

    } catch (error){
        console.log(error)
    }
}

export { handleMessage }