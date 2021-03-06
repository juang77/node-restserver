const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let productoSchema = new Schema({
    nombre: {
        type: String,
        required: [true, 'El nombre es necesario']
    },
    precioUni: {
        type: Number,
        required: [true, 'El precio únitario es necesario']
    },
    descripcion: {
        type: String,
        required: false
    },
    disponible: {
        type: Boolean,
        required: true,
        default: true
    },
    img: {
        type: String,
        required: false
    },
    categoria: {
        type: Schema.Types.ObjectId,
        ref: 'Categoria',
        required: true
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario'
    }
});

productoSchema.methods.toJSON = function() {
    let producto = this;
    let productObject = producto.toObject();
    return productObject;
};


module.exports = mongoose.model('Producto', productoSchema);