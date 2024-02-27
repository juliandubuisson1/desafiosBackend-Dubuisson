//const fs = require("fs");
import fs from 'fs'
import multer from 'multer'

//const multer = require('multer');

// Función para asegurar que un archivo exista en la ruta especificada
async function ensureFileExists(filePath, defaultContent = "[]") {
    try {
        const fileExists = fs.existsSync(filePath);
        if (!fileExists) {
            await fs.promises.writeFile(filePath, defaultContent);
            console.error(`No se encontró el archivo en la ruta: ${filePath}. Se creó un nuevo archivo con el contenido predeterminado.`);
        }
    } catch (error) {
        console.error(`Error al verificar o crear el archivo en la ruta: ${filePath}.`, error);
    } 
}

// Configuración de Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
    cb(null, './uploads/');
},
    filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
}
});

const upload = multer({ storage: storage });

//module.exports = { ensureFileExists, upload };
export default ensureFileExists