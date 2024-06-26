# Telegram bot

Proyecto con backend para contestar de forma automática a las consultas de los usuarios que escriben por Telegram.

## Registrar un bot en Telegram

1. Empezar una conversación con [@BotFather](https://telegram.me/BotFather)
2. Escribir /newbot y completar los datos para registrar un bot
3. Guardar en el .env el token del bot


## Descargar Ngrok

- Ngrok - https://ngrok.com/


## Ejecutar el proyecto

1. Levantar un servidor local

    ```
    npm start
    ```

2. Ir al directorio donde esté ngrok.exe
3. Abrir la terminal
4. Crear un tunel a un puerto localhost

    ```
    ngrok http http://localhost:4040
    ```

5. Copiar la URL que generó Ngrok
6. Reemplazar la URL en el archivo webhook.js
7. ![image](https://github.com/whosoeverHoldsThisHammer/Telegram_Bot/assets/102133841/3d478cc0-9bff-4bd9-bed9-88dd9967fa0a)

8. Establecer el webhook para que el bot escuche los mensajes que envían los usuarios

    ```
    node webhook.js
    ```
9. Levantar servidor local con una API con la persistencia

- Persistencia - https://github.com/FacuZ7/API_AccessChatbot_Conversations

9. Levantar servidor local con una API con el LLM

- LLM - https://github.com/FacuZ7/LLMService_ProyectoAccess

10. Escribir un mensaje al bot 🤖🚀
