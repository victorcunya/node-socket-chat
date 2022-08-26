import pkg from 'mongoose';
const { model, Schema } = pkg;

const categorySchema = Schema({
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
    }
})

categorySchema.methods.toJSON = function () {
    const { __v, _id, state, ...category } = this.toObject();
    category.id = _id
    return category
}

const Category = model('Category', categorySchema)

export {
    Category
};
