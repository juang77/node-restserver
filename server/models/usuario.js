const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

//Roles Validos
let rolesValidos = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: 'eEl Role {VALUE}, no es un Role válido.'
}

let Schema = mongoose.Schema;

let usuarioSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es requerido.']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'El Correo es requerido']
    },
    password: {
        type: String,
        required: [true, 'La contraseña es requerido']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: rolesValidos
    },
    estado: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },

});

usuarioSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();
    delete userObject.password;
    return userObject;
};

usuarioSchema.plugin(uniqueValidator, {
    message: 'El campo {PATH} debe ser unico.'
});


module.exports = mongoose.model('Usuario', usuarioSchema);