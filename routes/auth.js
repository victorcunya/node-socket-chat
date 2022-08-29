
import { Router } from 'express';
import { check } from 'express-validator';
import { googleSignIn, login, renovateToken } from '../controllers/auth.js';
import { validarCampos, validarJWT } from '../middleware/index.js';

const authRouter = Router();

authRouter.post('/login', [
    check('email', 'email is required').isEmail(),
    check('password', 'password is required').notEmpty(),
    validarCampos,
], login);

authRouter.post('/google', [
    check('id_token', ' ID token de google is required').notEmpty(),
    validarCampos,
], googleSignIn);

authRouter.get('/', [
    validarJWT,
], renovateToken)

export { authRouter };

