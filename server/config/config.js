//================================
//PUERTO
//================================
process.env.PORT = process.env.PORT || 3000;


//================================
//ENTORNO
//================================
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//================================
//VENCIMIENTO DEL TOKEN
//================================
//1 mes
process.env.CADUCIDAD_TOKEN = 60 * 60 * 24 * 30;


//================================
//SEED Semilla de Autenticacion
//================================
process.env.SEED = process.env.SEED || 'este-es-el-seed-desarrollo';


//================================
//GOOGLE CLient ID
//================================
process.env.CLIENT_ID = process.env.CLIENT_ID || '773016055504-9o1vomcqog0235gqcoqogaledic0ls3d.apps.googleusercontent.com';

//================================
//BASE DE DATOS
//================================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    //Variable de Ambiente de Heroku
    urlDB = process.env.MONGO_URI_DB;
}


process.env.URLDB = urlDB;