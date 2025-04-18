const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
    {
        url: '/movie-rental-app/public/images/tmnt.jpg',
        filename: 'tmnt.jpg'
    },
    {
       // url: 'https://fr.web.img2.acsta.net/medias/nmedia/18/62/84/94/18680369.jpg',
       // filename: 'fastfurious.jpg'
    },
    {
       // url: 'https://fr.web.img4.acsta.net/pictures/14/08/14/12/20/198981.jpg',
        //filename: 'hook.jpg'
    },
    {
       // url: 'https://fr.web.img6.acsta.net/pictures/14/10/08/11/49/195724.jpg',
       // filename: 'sisteract.jpg'
    }
];

const imagesDir = path.join(__dirname, '../public/images');
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

for (const image of images) {
    const filePath = path.join(imagesDir, image.filename);
    const file = fs.createWriteStream(filePath);

    https.get(image.url, (response) => {
        response.pipe(file);
        file.on('finish', () => {
            file.close();
            console.log(`Downloaded ${image.filename}`);
        });
    }).on('error', (err) => {
        fs.unlink(filePath, () => {});
        console.error(`Error downloading ${image.filename}:`, err.message);
    });
} 