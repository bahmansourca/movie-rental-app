const https = require('https');
const fs = require('fs');
const path = require('path');

const imagesDir = path.join(__dirname, '../public/images');
const imageUrl = 'https://images.unsplash.com/photo-1517604931442-7e0c8ed2963c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2025&q=80';
const imagePath = path.join(imagesDir, 'register-bg.jpg');

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
    fs.mkdirSync(imagesDir, { recursive: true });
}

// Download the image
https.get(imageUrl, (response) => {
    const fileStream = fs.createWriteStream(imagePath);
    response.pipe(fileStream);
    
    fileStream.on('finish', () => {
        fileStream.close();
        console.log('Background image downloaded successfully');
    });
}).on('error', (err) => {
    console.error('Error downloading background image:', err);
}); 