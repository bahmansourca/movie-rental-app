const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');

// Liste des images à télécharger avec leurs URLs
const images = [
    {
        url: 'https://m.media-amazon.com/images/M/MV5BODg3MGNhYjItZGU2Yi00MzU0LThlY2UtYjEwYjM0ODc0YzFkXkEyXkFqcGdeQXVyNTI4MjkwNjA@._V1_.jpg',
        filename: 'leon.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BYjY3YzYxMWUtNGJkNy00M2RkLTlmZGEtYzU5YzU0NjI5YjY4XkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
        filename: 'truelies.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_.jpg',
        filename: 'inception.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg',
        filename: 'darkknight.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BNjE5MzYwMzYxMF5BMl5BanBnXkFtZTcwOTk4MTk0OQ@@._V1_.jpg',
        filename: 'gravity.jpg'
    }
];

// Créer le répertoire images s'il n'existe pas
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Télécharger chaque image
images.forEach(image => {
    const filePath = path.join(imagesDir, image.filename);
    
    https.get(image.url, (response) => {
        const fileStream = fs.createWriteStream(filePath);
        response.pipe(fileStream);
        
        fileStream.on('finish', () => {
            fileStream.close();
            console.log(`Image téléchargée: ${image.filename}`);
        });
    }).on('error', (err) => {
        console.error(`Erreur lors du téléchargement de ${image.filename}:`, err);
    });
}); 