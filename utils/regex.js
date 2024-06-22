const isEmoji = (message) => {
    const pattern = /^[\p{Emoji}\s]+$/u

    return pattern.test(message)
}

const isStartCommand = (message) => {
    const pattern = /^\/start$/

    return pattern.test(message)
}

const isGreetingMessage = (message) => {
    const pattern = /^¡?Hola.+ayudarte\??$/

    return pattern.test(message)
}

export { isEmoji, isStartCommand, isGreetingMessage }
