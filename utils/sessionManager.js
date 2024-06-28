import {
        getSession,
        createSession,
        updateSession,
        createConversation,
        updateActivity
} from '../helpers/helpers.js'

const MAX_MINUTES = process.env.MAX_TIME_PER_SESSION

const sessionIsValid = (session) => {
    let last = (parseInt(session.data.last_active));
    let current = Date.now();
    const diff = Math.abs(current - last);
    const minutes = diff / (1000*60);

    return minutes < MAX_MINUTES
}

const sessionManager = async (chatId, userId) => {
    let session = await getSession(chatId);
    if(session.data == null || session.data == ""){ //si la persona que me habla no tiene session 

        session = await createSession(chatId); // le creamos una session
        await createConversation(chatId, userId, session.data.session_id) //y le creamos una conversacion

    }else{
        if(sessionIsValid(session)){ //si la session aun es valida 
            await updateActivity(chatId) //le updateamos la actividad para reiniciar su tiempo
        }else{
            session = await updateSession(chatId) //le hacemos un update de su session.
            await createConversation(chatId, userId, session.data.session_id) //le creamos una nueva conversación. 
        }

    }

    return session;
}

export default sessionManager;