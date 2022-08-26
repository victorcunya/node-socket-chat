

import { Router } from 'express';
import { check } from 'express-validator';
import {
    createCategory,
    deleteCategory,
    getCategory,
    listarCategories,
    updateCategory
} from '../controllers/category.js';
import { categoryExistsById } from '../helpers/db-validators.js';
import {
    tieneRole,
    validarCampos,
    validarJWT
} from '../middleware/index.js';

const categoryRouter = Router();

/**
 * {{url}}/api/categories
 */
// obtener todas las categories
categoryRouter.get('/', listarCategories);

// obtener 1 category x id
categoryRouter.get('/:id', [
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(categoryExistsById),
    validarCampos
], getCategory);

// create a new category (cualquier con token valido)
categoryRouter.post('/', [
    validarJWT,
    check('name', 'nombre obligatorio').notEmpty(),
    validarCampos
], createCategory)

// actualizar para cualquier con token valido
categoryRouter.put('/:id', [
    validarJWT,
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(categoryExistsById),
    check('name', 'nombre obligatorio').notEmpty(),
    validarCampos
], updateCategory)

// eliminar solo para administrador
categoryRouter.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(categoryExistsById),
    validarCampos
], deleteCategory)


export { categoryRouter };

