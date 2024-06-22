import { 
    sendMessage, 
    saveMessage, 
    getNotSupportedAnswer 
} from '../helpers/helpers.js';

export const NotSupportedMessage = async (chatId, session, message) => {
    const answer = getNotSupportedAnswer(message);

    const receivedMessage = {
        chat_id: chatId,
        session_id: session.data.session_id,
        role: "human",
        message_id: message.message_id,
        content: "Mensaje en formato no soportado",
        date: message.date
    };

    await saveMessage(receivedMessage);

    const response = await sendMessage(chatId, answer);
    const sentMessage = {
        chat_id: chatId,
        session_id: session.data.session_id,
        role: "ai",
        message_id: response.data.result.message_id,
        content: response.data.result.text,
        date: response.data.result.date
    };
    
    await saveMessage(sentMessage);
};
