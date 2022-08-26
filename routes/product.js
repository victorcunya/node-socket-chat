

import { Router } from 'express';
import { check } from 'express-validator';
import {
    createProduct,
    deleteProduct,
    getProduct,
    listarProducts,
    updateProduct
} from '../controllers/product.js';
import { categoryExistsById, productExistsById } from '../helpers/db-validators.js';
import {
    tieneRole,
    validarCampos,
    validarJWT
} from '../middleware/index.js';

const productRouter = Router();

/**
 * {{url}}/api/products
 */
// obtener todos los products
productRouter.get('/', listarProducts);

// obtener 1 product x id
productRouter.get('/:id', [
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(categoryExistsById),
    validarCampos
], getProduct);

// create a product (cualquier con token valido)
productRouter.post('/', [
    validarJWT,
    check('name', 'nombre obligatorio').notEmpty(),
    validarCampos
], createProduct)

// actualizar para cualquier con token valido
productRouter.put('/:id', [
    validarJWT,
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(productExistsById),
    check('name', 'nombre obligatorio').notEmpty(),
    validarCampos
], updateProduct)

// eliminar solo para administrador
productRouter.delete('/:id', [
    validarJWT,
    tieneRole('ADMIN_ROLE'),
    check('id', 'ID no valido').isMongoId(),
    check('id').custom(productExistsById),
    validarCampos
], deleteProduct)


export { productRouter };

