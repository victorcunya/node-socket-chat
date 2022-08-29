const url = location.hostname.includes('localhost')
    ? 'http://localhost:8080/api/auth'
    : ''

let userGlobal;
let socket;


const txtUid = document.querySelector('#txtUid');
const txtMessage = document.querySelector('#txtMessage');
const ulUsers = document.querySelector('#ulUsers');
const ulMessages = document.querySelector('#ulMessages');
const ulPrivateMessages = document.querySelector('#ulPrivateMessages');
const btnLogOut = document.querySelector('#btnLogOut');


const validateToken = async () => {
    const token = localStorage.getItem('token') || '';

    if (token.length < 10) {
        window.location = 'index.html';
        throw new Error('No hay token en el server');
    }

    const { user, newToken } = await fetch(url, { headers: { 'x-token': token } })
        .then(resp => resp.json())
        .then(({ user, newToken }) => ({ user, newToken }))
        .catch(error => console.error(error));

    localStorage.setItem('token', newToken);
    userGlobal = user;

    console.log({ user, newToken });
    document.title = user.name

    connecSocket()

}

const connecSocket = async () => {
    socket = io({
        'extraHeaders': {
            'x-token': localStorage.getItem('token')
        }
    });

    socket.on('connect', () => {
        console.log('Socket online');
    });

    socket.on('disconnect', () => {
        console.log('Socket offline');
    });

    socket.on('received-message', showMessagehtml);
    socket.on('active-users', showUserhtml);

    socket.on('private-message', (payload) => {
        showPrivatehtml(payload);
    });
}

const showUserhtml = (users = []) => {
    let html = '';
    users.forEach(({ name, uid }) => {
        html += `
            <li>
                <p>
                    <h5 class="text-success">${name}</h5>
                    <span class="fs-6 text-muted">${uid} </span
                </p>
            </li>
        `;
    })
    ulUsers.innerHTML = html
}

const showMessagehtml = (messages = []) => {
    let html = '';
    messages.forEach(({ name, message }) => {
        html += `
            <li>
                <p>
                    <span class="text-primary">${name}</span>
                    <span>${message} </span>
                </p>
            </li>
        `;
    })
    ulMessages.innerHTML = html;
}

const showPrivatehtml = (privateMessages = []) => {
    let html = ''
    privateMessages.forEach(({ name, message }) => {
        html += `
            <li>
                <p>
                    <span class="text-primary">${name}</span>
                    <span>${message} </span>
                </p>
            </li>
        `;
    });
    ulPrivateMessages.innerHTML = html
}


txtMessage.addEventListener('keyup', ({ keyCode }) => {
    if (keyCode !== 13) return;

    const message = txtMessage.value;
    const uid = txtUid.value;
    if (message.length === 0) return;
    socket.emit('send-message', { message, uid });
    txtMessage.value = '';
})


const main = async () => {
    await validateToken();
}

main();
