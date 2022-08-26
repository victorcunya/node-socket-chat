import pkg from 'mongoose';
const { model, Schema } = pkg;

const userSchema = Schema({
    name: {
        type: String,
        required: [true, 'Nombre requerido']
    },
    email: {
        type: String,
        required: [true, 'email requerido'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'password requerido']
    },
    image: {
        type: String
    },
    role: {
        type: String,
        required: true,
        default: 'USER_ROLE',
        emun: ['ADMIN_ROLE', 'USER_ROLE', 'VENTAS_ROLE']
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    }
})

userSchema.methods.toJSON = function () {
    const { __v, password, _id, ...user } = this.toObject();
    user.uid = _id
    return user
}

const User = model('User', userSchema)

export {
    User
};
