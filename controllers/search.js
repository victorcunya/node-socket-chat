import { response } from 'express';
import pkg from 'mongoose';
import { Category, Product, User } from '../models/index.js';
const { isValidObjectId } = pkg;

const collectionPermitted = [
    'users', 'categories', 'products'
]

const buscarUser = async (term = '', res = response) => {

    try {
        if (isValidObjectId(term)) {
            const user = await User.findById(term);
            return res.json({
                results: user ? [user] : []
            });
        }

        const regex = new RegExp(term, 'i');
        const users = await User.find({
            $or: [{ name: regex }, { email: regex }],
            $and: [{ state: true }]
        });
        return res.json({
            results: users ? [users] : []
        });
    } catch (error) {
        return res.status(500).json({
            msg: `Algo salió mal ${error}`
        })
    }

}


const buscarProduct = async (term = '', res = response) => {

    if (isValidObjectId(term)) {
        const product = await Product.findById(term)
            .populate('category', 'name');
        return res.json({
            results: product ? [product] : []
        });
    }

    const regex = new RegExp(term, 'i');
    const products = await Product.find({ name: regex, state: true })
        .populate('category', 'name');
    return res.json({
        results: products
    });
}


const buscarCategory = async (term = '', res = response) => {

    if (isValidObjectId(term)) {
        const category = await Category.findById(term);
        return res.json({
            results: category ? [category] : []
        });
    }

    const regex = new RegExp(term, 'i');
    const categories = await Category.find({ name: regex, state: true });
    return res.json({
        results: categories
    });
}


const search = async (req = request, res = response) => {

    const { collection, term } = req.params;
    if (!collectionPermitted.includes(collection)) {
        return res.status(400).json({
            msg: `Colecciones permitidas son ${collectionPermitted}`
        })
    }

    switch (collection) {
        case 'products':
            buscarProduct(term, res);
            break;
        case 'users':
            buscarUser(term, res);
            break;
        case 'categories':
            buscarCategory(term, res);
            break;
        default:
            res.status(500).json({
                msg: `Se le olvido hacer busqueda`
            });
    }

}

export {
    search
};

