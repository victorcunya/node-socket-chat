
const url = location.hostname.includes('localhost')
    ? 'http://localhost:8080/api/auth'
    : ''

const form = document.querySelector('form');

form.addEventListener('submit', event => {

    event.preventDefault(); //para que no recargue la pagina
    const formData = {}
    const elements = Array.from(form.elements);

    for (const e of elements) {
        if (e.name.length > 0) {
            formData[e.name] = e.value
        }
    }

    fetch(url + '/login', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: { 'Content-Type': 'application/json' },
    })
        .then(response => response.json())
        .then(data => {
            const { token, msg } = data;
            if (msg)
                return console.log(msg);
            console.log('login token: ' + token);
            localStorage.setItem('token', token);
            window.location = 'chat.html';
        })
        .catch(error => console.log(error));

});

function handleCredentialResponse(response) {

    const body = {
        id_token: response.credential
    }

    fetch(url + '/google', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
    })
        .then(resp => resp.json())
        .then(resp => {
            const { token, user } = resp
            localStorage.setItem('email', user.email);
            localStorage.setItem('token', token);
            console.log(resp)
            window.location = 'chat.html';
        })
        .catch(console.warn);
}


const button = document.getElementById('google_signout');
button.onclick = () => {
    console.log(google.accounts.id);
    google.accounts.id.disableAutoSelect();

    const email = localStorage.getItem('email');
    google.accounts.id.revoke(email, done => {
        localStorage.clear();
        location.reload();
    });
}