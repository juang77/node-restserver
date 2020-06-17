const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

let Schema = mongoose.Schema;

let categoriaSchema = new Schema({
    descripcion: {
        type: String,
        unique: true,
        required: [true, 'La descripción es requerido.']
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
    }
});

categoriaSchema.methods.toJSON = function() {
    let category = this;
    let categoryObject = category.toObject();
    return categoryObject;
};

categoriaSchema.plugin(uniqueValidator, {
    message: 'El campo {PATH} debe ser unico.'
});

module.exports = mongoose.model('Categoria', categoriaSchema);