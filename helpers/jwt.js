import jwt from 'jsonwebtoken';

const generateJWT = (uid = '') => {

    return new Promise((resolve, reject) => {
        const payload = { uid };
        jwt.sign(
            payload,
            process.env.PRIVATE_SECRET_KEY,
            {
                expiresIn: '4h'
            },
            (err, token) => {
                if (err) {
                    console.error(err);
                    reject('no se pudo generar el JWT', err);
                } else {
                    resolve(token);
                }

            })
    })
}

export {
    generateJWT
};

