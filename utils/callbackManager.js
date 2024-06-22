import { 
    sendMessage, 
    updateMessage, 
    saveMessage, 
    saveFeedback 
} from '../helpers/helpers.js';

export const CallbackQuery = async (chatId, session, callbackQuery) => {
    const { message, data: rating } = callbackQuery;
    const messageId = message.message_id;
    const answer = "Gracias por el feedback";

    await updateMessage(chatId, messageId);

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

    const feedback = {
        chat_id: chatId,
        session_id: session.data.session_id,
        message_id: messageId,
        feedback: rating
    };
    await saveFeedback(feedback);
};
