const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const imageUrl = 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80';
const imagePath = path.join(imagesDir, 'movies-bg.jpg');

// Créer le dossier images s'il n'existe pas
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Télécharger l'image
https.get(imageUrl, (response) => {
    const fileStream = fs.createWriteStream(imagePath);
    response.pipe(fileStream);

    fileStream.on('finish', () => {
        fileStream.close();
        console.log('Image de fond des films téléchargée avec succès');
    });
}).on('error', (err) => {
    console.error('Erreur lors du téléchargement de l\'image:', err);
}); 