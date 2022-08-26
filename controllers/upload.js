import { request, response } from 'express';
import fs from 'fs';
import path from 'path';
import { getModelBy } from '../helpers/db-validators.js';
import { upload } from '../helpers/upload.js';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config(process.env.CLOUDINARY_URL)


const uploadFile = async (req = request, res = response) => {

    try {
        const name = await upload(req.files, undefined, 'imgs');
        res.json({ name });
    } catch (error) {
        res.status(400).json({ error })
    }

}

const updateFile = async (req = request, res = response) => {

    const { id, collection } = req.params;
    let model;
    try {
        model = await getModelBy(collection, id);
    } catch (error) {
        return res.status(404).json({ msg: error.message });
    }

    if (model.image) {
        const pathImage = path.join(process.cwd(), '/uploads/', collection, model.image);

        if (fs.existsSync(pathImage)) {
            fs.unlinkSync(pathImage); // remove
        }

    }

    model.image = await upload(req.files, undefined, collection);
    await model.save()

    res.json(model);
}


const updateFileCloudinary = async (req = request, res = response) => {

    const { id, collection } = req.params;
    let model;
    try {
        model = await getModelBy(collection, id);
    } catch (error) {
        return res.status(404).json({ msg: error.message });
    }

    if (model.image) {
        const nameArr = model.image.split('/')
        const name = nameArr[nameArr.length - 1];
        const [public_id] = name.split('.')
        cloudinary.uploader.destroy(public_id)
            .then((ok) => console.log(ok))
            .catch((error) => console.log(error))
    }

    const { tempFilePath } = req.files.file
    const data = await cloudinary.uploader.upload(tempFilePath);
    const { secure_url } = data
    model.image = secure_url
    await model.save()

    res.json(model);
}

const showImage = async (req = request, res = response) => {

    const { id, collection } = req.params;
    let model;
    try {
        model = await getModelBy(collection, id);
    } catch (error) {
        return res.status(404).json({ msg: error.message });
    }

    const pathImage = (model.image)
        ? path.join(process.cwd(), '/uploads/', collection, model.image)
        : path.join(process.cwd(), '/assets/no_image.jpg')

    res.sendFile(pathImage)
}

export {
    uploadFile, updateFile, showImage, updateFileCloudinary
};

