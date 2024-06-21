import axios from "axios"
import * as dotenv from "dotenv"

dotenv.config();

const TOKEN = process.env.TELEGRAM_BOT_TOKEN
const webhook = "https://16ed-2800-810-548-dde-a9dc-c588-d828-e8a2.ngrok-free.app" // actualizar cada vez que se levanta ngrok


axios.post(`https://api.telegram.org/bot${TOKEN}/setWebhook`, {
    url: webhook
  })
  .then(response => {
    console.log('El webhook fue establecido', response.data);
  })
  .catch(error => {
    console.error('Error: no se pudo establecer el webhook', error.response.data);
  })