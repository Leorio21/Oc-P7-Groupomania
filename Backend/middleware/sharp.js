const fs = require('fs/promises');
const sharp = require('sharp');
const path = require('path');

const MIME_TYPES = {
    'image/jpeg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp'
};

module.exports = async (req, res, next) => {
    /*if(req.file) {
        console.log('file present')
        if (MIME_TYPES[req.file.mimetype]) {
            console.log(('file ok'))
            req.file = await sharp(req.file).resize(150,150).toFile(`${req.file.filename}.webp`)
            await fs.unlink(`images/${req.file.filename}`);
        } else {
            throw 'Erreur fichier'
        }
    }*/
    await sharp('./images/test.jpeg').resize(150,150).toFile('./images/test.webp')
    next()
}
