import { 
    sendMessage,
    sendMessageWithButton,
    updateMessage,
    getAnswer,
    isCallBackQuery,
    isNotSupportedMessage,
    getNotSupportedAnswer,
    saveMessage,
    saveFeedback,
    getHistory

} from '../helpers/helpers.js'
import { isStartCommand } from '../utils/regex.js';
import sessionManager from '../utils/sessionManager.js';


const handleMessage = async(req, res, next) => {
    try {
        
        const getChatId = req => isCallBackQuery(req) ? req.body.callback_query.message.chat.id : req.body.message.chat.id
        const getUserId = req => isCallBackQuery(req) ? req.body.callback_query.from.id : req.body.message.from.id
        const chatId = getChatId(req)
        const userId = getUserId(req)
        let session = await sessionManager(chatId,userId);

        
        if(isCallBackQuery(req)){ //callback query es cuando me responden el pulgar arriba o abajo y cuando me reaccionan los mensajes.
            console.log("Es callback query")
            const { message } = req.body.callback_query
            const rating = req.body.callback_query.data

            let messageId = message.message_id
            let answer = "Gracias por el feedback"

            // Borra los botones
            updateMessage(chatId, messageId)
            .then(result => console.log("Mensaje actualizado"))
            .catch(error => console.log("Algo salío mal"))

            // Guarda los cambios en db
            sendMessage(chatId, answer)
            .then(result => { 
                const res = result.data.result

                console.log("Mensaje enviado")

                const sentMessage = {
                    chat_id: chatId,
                    session_id: session.data.session_id,
                    role: "ai",
                    message_id: res.message_id, // El id del mensaje enviado recién
                    content: res.text,
                    date: res.date
                }

                const feedback = {
                    chat_id: chatId,
                    session_id: session.data.session_id,
                    message_id: messageId, // El id del mensaje al que se le está dando una clasificación
                    feedback: rating
                }

                // console.log(feedback)
                
                // Guardar el mensaje enviado mensaje
                saveMessage(sentMessage)
                .then(result => {
                    console.log("Mensaje guardado!")                
                })
                .then(()=> {

                    // 2º Actualizar feedback de la respuesta de la IA
                    saveFeedback(feedback)
                    .then(result => {
                        console.log("Feedback guardado!")
                    })
                    .catch(error => console.log(error))

                })
                .catch(error => console.log(error))



            })
            .catch(error => console.log(error.message))

        } else {
            console.log("No es callback query")

            if(isNotSupportedMessage(req)){
            
                console.log("Es not supported")

                const { message } = req.body
                let chatId = message.chat.id
                let answer = getNotSupportedAnswer(req)

                // Primero hay que guardar el mensaje entrante
                const receivedMessage = {
                    chat_id: chatId,
                    session_id: session.data.session_id,
                    role: "human",
                    message_id: message.message_id,
                    content: "Mensaje en formato no soportado",
                    date: message.date
                }

                await saveMessage(receivedMessage)

                // Después hay que guardar el mensaje enviado
                sendMessage(chatId, answer)
                .then(result => {
                    console.log("Mensaje enviado")
                    const response = result.data.result

                    const sentMessage = {
                        chat_id: chatId,
                        session_id: session.data.session_id,
                        role: "ai",
                        message_id: response.message_id,
                        content: response.text,
                        date: response.date
                    }

                    saveMessage(sentMessage)
                    .then(result => console.log("Mensaje guardado!"))
                    .catch(error => console.log(error))

                })
                .catch(error => console.log("Algo salío mal"))
    
            } else {
                console.log("Es mensaje para IA")
                const { message } = req.body
                let chatId = message.chat.id
                
                if(isStartCommand(message.text)){
                    let answer = "Bienvenido!"
                    // Primero hay que guardar el mensaje entrante
                    const receivedMessage = {
                        chat_id: chatId,
                        session_id: session.data.session_id,
                        role: "human",
                        message_id: message.message_id,
                        content: message.text,
                        date: message.date
                    }

                    console.log(receivedMessage)

                    saveMessage(receivedMessage)
                    .then(()=> {
                        sendMessage(chatId, answer)
                        .then(result => { 
                            const response = result.data.result
                            console.log("Mensaje enviado")
    
                            const sentMessage = {
                                chat_id: chatId,
                                session_id: session.data.session_id,
                                role: "ai",
                                message_id: response.message_id,
                                content: response.text,
                                date: response.date
                            }
    
                            saveMessage(sentMessage)
                            .then(result => console.log("Mensaje guardado!"))
                            .catch(error => console.log(error))
    
                        })
                        .catch(error => {
                            console.log("Algo salío mal")
                            console.log(error)
                        })
                    })
                    
                } else {
                    let answer = "Respuesta generada por la IA"
                    console.log("imprimo")
                    // Primero hay que guardar el mensaje entrante
                    const receivedMessage = {
                        chat_id: chatId,
                        session_id: session.data.session_id,
                        role: "human",
                        message_id: message.message_id,
                        content: message.text,
                        date: message.date
                    }
                    
                    console.log(receivedMessage)

                    saveMessage(receivedMessage)
                    .then(()=> {
                        console.log(1)

                        return getHistory(chatId, session.data.session_id)
                    })
                    .then((result)=> {
                        console.log(2)

                        let history = result.data
                        return getAnswer(message.text, result.data)
                    })
                    .then((result)=> {
                        console.log(3)
                        // let answer = result.data.answer
                        // console.log("Respuesta LLM:", result.data.answer)
                        answer = result.data.answer

                        sendMessageWithButton(chatId, answer)
                        .then(result => { 
                            console.log("Mensaje enviado")
                        
                            const response = result.data.result

                            const sentMessage = {
                                chat_id: chatId,
                                session_id: session.data.session_id,
                                role: "ai",
                                message_id: response.message_id,
                                content: response.text,
                                date: response.date
                            }

                            saveMessage(sentMessage)
                            .then(result => console.log("Mensaje guardado!"))
                            .catch(error => console.log(error))

                        })
                        .catch(error => {
                            console.log("Algo salío mal")
                            console.log(error)
                        })
                    })
                    .catch((error) => {
                        console.log(error)
                    })

                    }
            }

        }

        res.send("Hello World")

    } catch (error){
        console.log(error)
    }
}

export { handleMessage }