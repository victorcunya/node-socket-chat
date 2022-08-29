import { Socket } from 'socket.io';
import { validateToken } from '../../helpers/jwt.js';
import { ChatMessage } from '../../models/index.js';

const chatMessage = new ChatMessage();

const socketController = async (socket = Socket, io) => {

    const token = socket.handshake.headers['x-token'];
    const user = await validateToken(token);
    if (!user) {
        return socket.disconnect();
    }

    // Agregar cuando user se conecta
    chatMessage.connectUser(user);
    io.emit('active-users', chatMessage.userArray)
    socket.emit('received-message', chatMessage.lastTen) // para los nuevos conectados se listan

    // conectarlo a una sala especial (por user.id)
    // el socket.id es volátil es decir se pierde al recargar la página
    socket.join(user.id);  // hay 3 salas (global es el io), socket.id y por user.id


    // Limpiar cuando se desconecta (cuándo recarga la pagina)
    socket.on('disconnect', () => {
        chatMessage.disconnectUser(user.id);
        io.emit('active-users', chatMessage.userArray)
    });

    socket.on('send-message', ({ message, uid }) => {

        console.log(message, uid)
        if (uid) { // si viene el uid es msg privado.
            chatMessage.sendMessage(uid, user.name, message, true);
            socket.to(uid)
                .emit('private-message', chatMessage.getMessagesByUID(uid));
        } else {
            chatMessage.sendMessage(user.id, user.name, message)
            io.emit('received-message', chatMessage.lastTen)
        }

    });

}

export default socketController
