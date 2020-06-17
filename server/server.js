require('./config/config');


const express = require('express');
const app = express();
// Using Node.js `require()`
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

//Habilitar la carpeta public
app.use(express.static(path.resolve(__dirname, '../public')));

// parse application/json
app.use(bodyParser.json());

//Configuracion Global de Rutas
app.use(require('./routes/index'));


mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true },
    (err, res) => {
        if (err) throw err;
        console.log('Base de datos ONLINE');
    });


app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto : ', process.env.PORT);
});