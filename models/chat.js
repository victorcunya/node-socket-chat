
class Message {

    constructor(uid, name, message) {
        this.uid = uid;
        this.name = name;
        this.message = message;
    }
}


export class ChatMessage {

    constructor() {
        this.messages = [];
        this.users = {};
        this.privateMessages = {};
    }

    get lastTen() {
        this.messages = this.messages.splice(0, 10);
        return this.messages;
    }

    get userArray() {
        return Object.values(this.users); // [ {}, {}, {}]
    }

    sendMessage(uid, name, message, prvt = false) {
        const sms = new Message(uid, name, message);
        if (!prvt) {
            this.messages.unshift(sms);
            return;
        }
        const messages = this.privateMessages[uid] || '';
        if (messages) {
            messages.unshift(sms)
            this.privateMessages[uid] = messages
        } else {
            this.privateMessages[uid] = [sms]
        }
    }

    getMessagesByUID(uid) {
        return this.privateMessages[uid];
    }

    connectUser(user) {
        this.users[user.id] = user;
    }

    disconnectUser(uid = '') {
        delete this.users[uid];
    }
}