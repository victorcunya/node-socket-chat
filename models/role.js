import pkg from 'mongoose';
const { model, Schema } = pkg;

const roleSchema = Schema({
    role: {
        type: String,
        required: [true, 'El rol es obligatorio.']
    }
})

const Role = model('Role', roleSchema);

export {
    Role
};
