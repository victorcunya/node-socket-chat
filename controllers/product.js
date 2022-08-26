import { request, response } from 'express';
import { Product } from '../models/index.js';


const createProduct = async (req = request, res = response) => {

    const { ...body } = req.body;
    const name = body.name.toUpperCase();
    let product = await Product.findOne({ name });
    if (product) {
        return res.status(400)
            .json({ msg: `El producto ${name} ya existe` });
    }

    body.user = req.user._id;
    body.name = name;
    product = new Product({ ...body });

    await product.save();

    res.status(201).json(product);
}

const listarProducts = async (req = request, res = response) => {

    const { limit = 5, skip = 0 } = req.query;
    const query = { state: true }

    const [total, products] = await Promise.all([
        Product.count(query),
        Product.find(query)
            // .populate('user', 'name')
            // .populate('category', 'name')
            .limit(limit)
            .skip(skip)
    ])

    res.json({ total, products });
}


const getProduct = async (req = request, res = response) => {

    const id = req.params.id;
    const product = await Product.findById(id).populate('user', 'name');
    res.json(product);
}

const deleteProduct = async (req = request, res = response) => {

    const { id } = req.params;
    const product = await Product.findByIdAndUpdate(id, { state: false });
    res.json(product)
}

const updateProduct = async (req = request, res = response) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    if (data.name) {
        data.name = data.name.toUpperCase();
    }

    data.user = req.user;

    const product = await Product.findByIdAndUpdate(id, data)

    res.json(product)
}

export {
    createProduct, listarProducts,
    getProduct, deleteProduct, updateProduct
};

