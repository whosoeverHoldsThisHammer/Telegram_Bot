# Telegram bot

Proyecto con backend para contestar de forma automática a las consultas de los usuarios que escriben por Telegram.

## Registrar un bot en Telegram

1. Empezar una conversación con [@BotFather](https://telegram.me/BotFather)
2. Escribir /newbot y completar los datos para registrar un bot
3. Guardar en el .env el token del bot


## Descargar Ngrok

Ngrok - https://ngrok.com/


## Ejecutar el proyecto

1. Levantar un servidor local

```

npm start

```

2. Ir al directorio donde esté ngrok.exe
3. Abrir la terminal
4. Crear un tunel a nuestro localhost

```

ngrok http http://localhost:4040

```

5. Copiar la URL que generó Ngrok
6. Reemplazar la URL en el archivo webhook.js
7. Establecer el webhook para que el bot escuche los mensajes que envían los usuarios

```

node webhook.js

```

8. Escribir un mensaje al bot 🤖🚀
