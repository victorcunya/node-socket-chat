import pkg from 'mongoose';
const { model, Schema } = pkg;

const productSchema = Schema({
    name: {
        type: String,
        required: [true, 'Nombre requerido']
    },
    state: {
        type: Boolean,
        default: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    price: {
        type: Number,
        default: 0,
        required: [true, 'Precio requerido']
    },
    image: {
        type: String
    }
})

productSchema.methods.toJSON = function () {
    const { __v, _id, state, ...product } = this.toObject();
    product.id = _id
    return product
}

const Product = model('Product', productSchema)

export {
    Product
};
