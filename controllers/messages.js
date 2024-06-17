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
    updateActivity
} from '../helpers/helpers.js'
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

            console.log("chat_id:", chatId)

            let session
            
            getSession(chatId)
            .then(result => {
                session = result.data
   
                if(session == null){
                    // Si no existe la sesión, debe crearla
                    console.log("La sesión no existe y tiene que crearla")
                    createSession(chatId)

                } else {
                    // Si la sesión está expirada, debe actualizar la sesión
                    
                    const MAX_MINUTES = 30

                    let last = (parseInt(session.last_active))
                    let current = Date.now()

                    // console.log(typeof(last))
                    // console.log(typeof(current))

                    const diff = Math.abs(current - last)
                    const minutes = diff / (1000 * 60)

                    // console.log(minutes)

                    if(minutes > MAX_MINUTES){
                        console.log("La sesión está expirada. Hay que crear otra sesión")
                        updateSession(chatId)

                    } else {
                        // Si la sesión no está expirada, hay que actualizar la actividad
                        console.log("La sesión no expiró. Hay que actualizar la útlima actividad")
                        updateActivity(chatId)

                    }
                }

                
            })
            .catch(error => console.log(error))
            

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