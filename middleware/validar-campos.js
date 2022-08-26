import { response } from 'express';
import { validationResult } from 'express-validator';


const validarCampos = (req, res = response, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }
    // sirve para que ejecute el siguiente middleware 
    // sino hay ejecuta el controller
    next();
}

const validateFile = (req, res = response, next) => {

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).json({
            msg: 'No files were uploaded.'
        });
    }

    next();
}

export {
    validarCampos, validateFile
};
