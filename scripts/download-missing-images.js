const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');

// Liste des images à télécharger avec leurs URLs
const images = [
    {
        url: 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80',
        filename: 'movies-bg.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BMTY2ODQ0NjEwNF5BMl5BanBnXkFtZTcwNjU3MDAwNw@@._V1_.jpg',
        filename: 'sisteract.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BNDE4OTMxMTctNmRhYy00NWE2LTg3YzItYTk3M2UwOTU5Njg4XkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_.jpg',
        filename: 'schindler.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BMTQ2NzUxMTAxN15BMl5BanBnXkFtZTcwMzIxOTM3Mg@@._V1_.jpg',
        filename: 'twilight.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BMTY2ODQ0NjEwNF5BMl5BanBnXkFtZTcwNjU3MDAwNw@@._V1_.jpg',
        filename: 'diner-cons.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BMTQ2NzUxMTAxN15BMl5BanBnXkFtZTcwMzIxOTM3Mg@@._V1_.jpg',
        filename: 'visiteurs.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BNWIwODRlZTUtY2U3ZS00Yzg1LWJhNzYtMmZiYmEyNmU1NjMzXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_.jpg',
        filename: 'forrest-gump.jpg'
    },
    {
        url: 'https://m.media-amazon.com/images/M/MV5BM2MyNjYxNmUtYTAwNi00MTYxLWJmNWYtYzZlODY3ZTk3OTFlXkEyXkFqcGdeQXVyNzkwMjQ5NzM@._V1_.jpg',
        filename: 'parrain.jpg'
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