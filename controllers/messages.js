import { 
    isCallBackQuery,
    isNotSupportedMessage,
} from '../helpers/helpers.js'
import { messageManager } from '../utils/messageManager.js';
import sessionManager from '../utils/sessionManager.js';
import { CallbackQuery } from '../utils/callbackManager.js';
import { NotSupportedMessage } from '../utils/notSupportedMessageManager.js';


const handleMessage = async(req, res, next) => {
    try {
        
        const getChatId = req => isCallBackQuery(req) ? req.body.callback_query.message.chat.id : req.body.message.chat.id
        const getUserId = req => isCallBackQuery(req) ? req.body.callback_query.from.id : req.body.message.from.id

        const chatId = getChatId(req)
        const userId = getUserId(req)

        let session = await sessionManager(chatId,userId);

        if(isCallBackQuery(req)){ //callback query es cuando me responden el pulgar arriba o abajo y cuando me reaccionan los mensajes. 
            await CallbackQuery(chatId, session, req.body.callback_query);
        }else if (isNotSupportedMessage(req)){
            await NotSupportedMessage(chatId, session, req.body.message);
        }else{
            await messageManager(chatId,session, req.body.message)
        }

        res.sendStatus(200)
    } catch (error){
        console.log(error)
    }
}

export { handleMessage }