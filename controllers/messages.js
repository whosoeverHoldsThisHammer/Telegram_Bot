import { 
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
    updateSession,
    updateActivity,
    saveMessage,
    saveFeedback,
    createConversation

} from '../helpers/helpers.js'
import { isStartCommand } from '../utils/regex.js';


const handleMessage = async(req, res, next) => {
    try {
        
        const getChatId = req => isCallBackQuery(req) ? req.body.callback_query.message.chat.id : req.body.message.chat.id
        const getUserId = req => isCallBackQuery(req) ? req.body.callback_query.from.id : req.body.message.from.id
        const chatId = getChatId(req)
        const userId = getUserId(req)
        let session = await getSession(chatId)
        
        if(session.data == null){
            // Si no existe la sesión, debe crearla
            console.log("La sesión no existe. Hay que crear una sesión y una conversación")

            // Crea la sesión
            createSession(chatId)

            // Crea la conversacion
            await createConversation(chatId, userId, session.data.session_id)

        } else {
            // Si la sesión está expirada, debe actualizar la sesión
            const MAX_MINUTES = 30

            let last = (parseInt(session.data.last_active))
            let current = Date.now()
            const diff = Math.abs(current - last)
            const minutes = diff / (1000 * 60)

            if(minutes > MAX_MINUTES){
                console.log("La sesión está expirada. Hay que crear otra sesión y una nueva conversación")
                
                // Crea la nueva sesión
                session = await updateSession(chatId)

                // Crea la nueva conversación
                await createConversation(chatId, userId, session.data.session_id)

            } else {
                // Si la sesión no está expirada, hay que actualizar la actividad
                console.log("La sesión no expiró. Hay que actualizar la útlima actividad")
                updateActivity(chatId)
            }
        }


        if(isCallBackQuery(req)){
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
                
                // console.log(sentMessage)
                // Guardar el mensaje enviado mensaje
                saveMessage(sentMessage)
                .then(result => console.log("Mensaje guardado!"))
                .catch(error => console.log(error))

                // 2º Actualizar feedback de la respuesta de la IA
                // Descomentar
                // await saveFeedback(feedback)

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

                    await saveMessage(receivedMessage)

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
                    .catch(error => console.log("Algo salío mal"))

                } else {
                    let answer = "Respuesta generada por la IA"

                    // Primero hay que guardar el mensaje entrante
                    const receivedMessage = {
                        chat_id: chatId,
                        session_id: session.data.session_id,
                        role: "human",
                        message_id: message.message_id,
                        content: message.text,
                        date: message.date
                    }

                    await saveMessage(receivedMessage)

                    sendMessageWithButton(chatId, answer)
                        .then(result => { 
                            console.log("Mensaje enviado")
                        
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