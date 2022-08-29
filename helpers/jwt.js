import jwt from 'jsonwebtoken';
import { getModelBy } from './db-validators.js';

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


const validateToken = async (token = '') => {

    try {
        if (token.length < 0) {
            return null;
        }
        const { uid } = jwt.verify(token, process.env.PRIVATE_SECRET_KEY);
        const user = getModelBy('users', uid);
        return (user) ? user : null;
    } catch (error) {
        return null;
    }
}

export {
    generateJWT, validateToken
};

