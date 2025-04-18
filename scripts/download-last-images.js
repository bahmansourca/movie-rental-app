const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');

// Liste des images à télécharger avec leurs URLs
const images = [
    {
        url: 'https://m.media-amazon.com/images/M/MV5BMTYwOTEwNjAzMl5BMl5BanBnXkFtZTcwODc5MTUwMw@@._V1_.jpg',
        filename: 'avatar.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BZjdkOTU3MDktN2IxOS00OGEyLWFmMjktY2FiMmZkNWIyODZiXkEyXkFqcGdeQXVyMTMxODk2OTU@._V1_.jpg',
        filename: 'interstellar.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BNGNhMDIzZTUtNTBlZi00MTRlLWFjM2ItYzViMjE3YzI5MjljXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
        filename: 'pulpfiction.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BMTQ2NzUxMTAxN15BMl5BanBnXkFtZTcwMzIxOTM3Mg@@._V1_.jpg',
        filename: 'twilight.jpg'
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