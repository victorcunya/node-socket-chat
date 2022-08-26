import bcrypt from 'bcryptjs';
import { request, response } from 'express';
import { User } from '../models/index.js';


const getUsers = async (req = request, res = response) => {

    const { limit = 3, skip = 0 } = req.query;
    const query = {
        state: true
    }
    // const users = await User.find(query)
    //     .limit(limit)
    //     .skip(skip);
    // const total = await User.count(query);

    // ejecuta ambas en simultaneos
    const [total, users] = await Promise.all([
        User.count(query),
        User.find(query)
            .limit(limit)
            .skip(skip)
    ]);

    res.json({
        total, users,
    })
};

const putUsers = async (req = request, res = response) => {

    const id = req.params.id;
    const { password, google, email, ...resto } = req.body;

    if (password) {
        const salt = bcrypt.genSaltSync();
        resto.password = bcrypt.hashSync(password, salt);
    }

    const user = await User.findByIdAndUpdate(id, resto);

    res.status(200).json(user);
};

const postUsers = async (req = request, res = response) => {

    const { name, email, password, role } = req.body;
    const user = new User({ name, email, password, role });

    //encriptar password 
    const salt = bcrypt.genSaltSync(10); //nro de vueltas para complejizar encriptación.
    user.password = bcrypt.hashSync(password, salt);

    // guardar en bd
    await user.save();

    res.status(201).json(user);
}

const deleteUsers = async (req = request, res = response) => {

    const { id } = req.params;

    // eliminacion logica
    const user = await User.findByIdAndUpdate(id, { state: false });

    res.json({ user })
}

export {
    getUsers, putUsers, postUsers, deleteUsers
};
