const isStartCommand = (message) => {
    const pattern = /^\/start$/

    return pattern.test(message)
}

const isGreetingMessage = (message) => {
    const pattern = /^¡?Hola.+ayudarte\??$/

    return pattern.test(message)
}

const isEmoji = (message) => {
    const pattern = /^[\p{Emoji}\s]+$/u

    return pattern.test(message)
}

const isProfanity = (message) => {
    const pattern = /(bobo|idiota|mierda|tonto)/i

    return pattern.test(message)

}

const isTestingAI = (message)=> {
    const pattern = /\b(hablo con (un |una )?(bot|robot|IA)|estoy hablando con (un |una )?(robot|bot)|sos (un |una )?(bot|robot)|es (un |una )?bot)\b/i

    return pattern.test(message)
}


export { isEmoji, isStartCommand, isGreetingMessage, isProfanity, isTestingAI }
