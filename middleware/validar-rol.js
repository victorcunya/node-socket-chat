import { request, response } from 'express';


const esAdminRole = (req = request, res = response, next) => {

    const user = req.user;

    if (!user) {
        return res.status(500).json({
            msg: 'se quiere validar el rol sin validar el token primero'
        })
    }

    if (user.role !== 'ADMIN_ROLE') {
        return res.status(401).json({
            msg: `${user.name} No tiene permisos de administrador`
        })
    }

    next();
}

const tieneRole = (...roles) => {

    return (req = request, res = response, next) => {

        const user = req.user;
        if (!user) {
            return res.status(500).json({
                msg: 'se quiere validar el rol sin validar el token primero'
            })
        }

        if (!user.role.includes(roles)) {
            return res.status(401).json({
                msg: `Se requiere uno de los sgte roles ${roles}`
            })
        }

        next();
    }
}

export {
    esAdminRole, tieneRole
};
