

import { Router } from 'express';
import { check } from 'express-validator';
import {
    deleteUsers,
    getUsers,
    postUsers,
    putUsers
} from '../controllers/user.js';
import { emailExists, isRoleValid, userExistsById } from '../helpers/db-validators.js';
import {
    esAdminRole,
    tieneRole,
    validarCampos,
    validarJWT
} from '../middleware/index.js';

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.put('/:id', [
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(userExistsById),
    check('role').custom(isRoleValid),
    validarCampos
], putUsers);

userRouter.post('/', [
    check('name', 'nombre obligatorio').notEmpty(),
    check('password', 'password mas de 6 letras').isLength({ min: 6 }),
    check('email', 'El correo no es  valido').isEmail(),
    check('email').custom(emailExists),
    // check('role', 'rol no valido').isIn(['ADMIN_ROLE', 'USER_ROL']),
    check('role').custom(isRoleValid),
    validarCampos
], postUsers);

userRouter.delete('/:id', [
    validarJWT,
    esAdminRole,
    tieneRole('ADMIN_ROLE'),
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(userExistsById),
    validarCampos
], deleteUsers);

export { userRouter };
