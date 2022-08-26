import bcrypt from 'bcryptjs';
import { request, response } from 'express';
import { googleVerify } from '../helpers/google-verify.js';
import { generateJWT } from '../helpers/jwt.js';
import { User } from '../models/index.js';

const login = async (req = request, res = response) => {

    const { email, password } = req.body

    try {
        // verificar si el user existe
        const user = await User.findOne({ email: email })
        if (!user) {
            return res.status(400).json({ msg: 'User not found' });
        }

        // si está activo
        if (!user.state) {
            return res.status(400).json({ msg: 'User deleted' });
        }

        //validar contraseña
        const validPwd = bcrypt.compareSync(password, user.password);
        if (!validPwd) {
            return res.status(400).json({ msg: 'password invalid' });
        }

        // generar JWT
        const token = await generateJWT(user.id);

        res.json({ user, token });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            msg: 'algo salió mal'
        })
    }

}

const googleSignIn = async (req = request, res = response) => {

    const { id_token } = req.body

    try {
        const googleUser = await googleVerify(id_token);

        const { name, email, image } = googleUser

        let user = await User.findOne({ email });

        if (!user) {
            const data = {
                name,
                email,
                image,
                password: ':P',
                google: true
            };

            user = new User(data);
            await user.save();
        }

        // usuario dado de baja
        if (!user.state) {
            return res.status(400).json({
                msg: 'hable con administrador, user bloqueado'
            })
        }

        const token = await generateJWT(user.id);

        res.json({
            token,
            user
        });

    } catch (error) {
        console.log(error)
        res.status(400).json({
            ok: false,
            msg: 'token no se puede validar'
        });
    }
}

export {
    login, googleSignIn
};

