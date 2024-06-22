const isEmoji = (message) => {
    const pattern = /(\u00a9|\u00ae|[\u2000-\u3300]|\ud83c[\ud000-\udfff]|\ud83d[\ud000-\udfff]|\ud83e[\ud000-\udfff])/

    return pattern.test(message)
}

const isStartCommand = (message) => {
    const pattern = /^\/start$/

    return pattern.test(message)
}

export { isEmoji, isStartCommand }
