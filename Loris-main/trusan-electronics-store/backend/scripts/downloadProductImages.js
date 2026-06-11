const fs = require('fs');
const path = require('path');
const https = require('https');

const images = [
  {
    url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=800&q=80',
    filename: 'jumia-phone-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=800&q=80',
    filename: 'alibaba-laptop-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=800&q=80',
    filename: 'google-tv-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1586201375761-83865001e8b7?auto=format&fit=crop&w=800&q=80',
    filename: 'jumia-fridge-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1512499617640-c2f99912b6f2?auto=format&fit=crop&w=800&q=80',
    filename: 'alibaba-audio-1.jpg'
  },
  {
    url: 'https://images.unsplash.com/photo-1519183071298-a2962f450d7f?auto=format&fit=crop&w=800&q=80',
    filename: 'google-camera-1.jpg'
  }
];

const outputFolder = path.join(__dirname, '../../frontend/public/product-images');
if (!fs.existsSync(outputFolder)) {
  fs.mkdirSync(outputFolder, { recursive: true });
}

function downloadImage(item) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(outputFolder, item.filename);
    https.get(item.url, (response) => {
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${item.url}: ${response.statusCode}`));
      }
      const fileStream = fs.createWriteStream(filePath);
      response.pipe(fileStream);
      fileStream.on('finish', () => fileStream.close(resolve));
    }).on('error', reject);
  });
}

(async function () {
  for (const item of images) {
    try {
      console.log(`Downloading ${item.filename}...`);
      await downloadImage(item);
      console.log(`Saved ${item.filename}`);
    } catch (error) {
      console.error(`Unable to download ${item.url}:`, error.message);
    }
  }
  console.log('Product image import complete.');
})();
