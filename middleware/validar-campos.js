import { response } from 'express';
import { validationResult } from 'express-validator';


const validarCampos = (req, res = response, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json(errors);
    }

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
