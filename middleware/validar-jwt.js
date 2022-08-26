import { request, response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const validarJWT = async (req = request, res = response, next) => {

    const token = req.header('x-token');
    if (!token) {
        return res.status(401).json({
            msg: 'no hay token'
        });
    }

    try {
        const { uid } = jwt.verify(token, process.env.PRIVATE_SECRET_KEY);
        const user = await User.findById(uid);

        // en caso se haya eliminado de la BD
        if (!user) {
            return res.status(401).json({
                msg: 'token no valido - user no existe en la BD'
            })
        }

        //validar si user está activo:
        if (!user.state) {
            return res.status(401).json({
                msg: 'user eliminado - dado de baja'
            });
        }

        req.user = user;

        next();
    } catch (error) {
        console.log(error);
        return res.status(401).json({
            msg: 'token invalido'
        });
    }

}
