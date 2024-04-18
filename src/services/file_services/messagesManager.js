import messageModel from "../models/messagesModel.js"

export default class MessagesManagerDao {
    constructor() {
        this.model = messageModel
    }

    async getAllMessages() {
        try {
            const messages = await this.model.find()
            return messages
        } catch (error) {
            console.log("No se encontraron los mensajes",error)
        }
    }
    async addMessage(message) {
        try {
            const newMessage = await this.model({
                user: message.user,
                message: message.message
            })
            const savedMessage = await newMessage.save()
            return savedMessage
        } catch (error) {
            console.log("No se pudo crear el mensaje", error)
        }
    }
}