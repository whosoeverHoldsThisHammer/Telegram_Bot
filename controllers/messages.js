import { sendMessage, sendMessageWithButton, updateMessage, storeMessage, getAnswer } from '../helpers/helpers.js'
import { isStartCommand } from '../utils/regex.js';


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
                    answer = "Respuesta generada por la IA"

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

        }

        res.send("Hello World")

    } catch (error){
        console.log(error)
    }
}

export { handleMessage }