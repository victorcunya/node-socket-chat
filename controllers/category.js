import { request, response } from 'express';
import { Category } from '../models/index.js';


const createCategory = async (req = request, res = response) => {

    const name = req.body.name.toUpperCase();
    let category = await Category.findOne({ name });
    if (category) {
        return res.status(400)
            .json({ msg: `Categoría ${name} ya existe` });
    }

    const user = req.user._id;
    category = new Category({ name, user });

    await category.save();

    res.status(201).json(category);
}

const listarCategories = async (req = request, res = response) => {

    const { limit = 5, skip = 0 } = req.query;
    const query = { state: true }

    const [total, categories] = await Promise.all([
        Category.count(query),
        Category.find(query)
            .populate('user', 'name')
            .limit(limit)
            .skip(skip)
    ])

    res.json({ total, categories });
}


const getCategory = async (req = request, res = response) => {

    const id = req.params.id;
    const category = await Category.findById(id).populate('user', 'name');
    res.json(category);
}

const deleteCategory = async (req = request, res = response) => {

    const { id } = req.params;
    const category = await Category.findByIdAndUpdate(id, { state: false });
    res.json(category)
}

const updateCategory = async (req = request, res = response) => {

    const { id } = req.params;
    const { state, user, ...data } = req.body;

    data.name = data.name.toUpperCase();
    data.user = req.user._id;

    const category = await Category.findByIdAndUpdate(id, data)

    res.json(category)
}

export {
    createCategory, listarCategories,
    getCategory, deleteCategory, updateCategory
};

