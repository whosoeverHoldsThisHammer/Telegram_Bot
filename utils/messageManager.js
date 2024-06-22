import {
    sendMessage,
    sendMessageWithButton,
    saveMessage,
    getAnswer,
    getHistory
} from '../helpers/helpers.js'
import { isStartCommand } from './regex.js'

export const messageManager = async (chat_id, session, message) => {
    const receivedMessage = {
        chat_id,
        session_id: session.data.session_id,
        role: "Human",
        message_id: message.message_id,
        content: message.text,
        date: message.date
    }

    await saveMessage(receivedMessage)

    if (isStartCommand(message.text)){ // "/start" => es el start command
        await handleStartCommand(chat_id, session, message);
    }else{
        await handleAIMessage(chat_id, session, message);
    }
}

const handleStartCommand = async (chat_id, session, message) => {
    let answer = "Bienvenido"
    const response = await sendMessage(chat_id,answer);

    const sentMessage = {
        chat_id,
        session_id: session.data.session_id,
        role: "AI",
        message_id: response.data.result.message_id,
        content: response.data.result.text,
        date: response.data.result.date
    };

    await saveMessage(sentMessage)
}

const handleAIMessage = async (chat_id, session, message) => {
    const history = await getHistory(chat_id, session.data.session_id);
    const aiResponse = await getAnswer(message.text, history.data);
    const answer = aiResponse.data.answer;
    const response = await sendMessageWithButton(chat_id, answer);

    const sentMessage = {
        chat_id,
        session_id: session.data.session_id,
        role: "ai",
        message_id: response.data.result.message_id,
        content: response.data.result.text,
        date: response.data.result.date
    };
    await saveMessage(sentMessage);
};