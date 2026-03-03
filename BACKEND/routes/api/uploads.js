const express = require('express');
const multer = require('multer');
const path = require('path');

const router = express.Router();

// Defineix on es guardaran les imatges
const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname); // ex: .jpg
      const baseName = 'comanda'; // o pots personalitzar-ho amb req.body
      const timestamp = new Date().toISOString().replace(/[-:.]/g, '');
      const fileName = `${baseName}-${timestamp}${ext}`;
      cb(null, fileName);
    }
  });
  

const upload = multer({ storage });

router.post('/', upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No s’ha enviat cap imatge' });

  const url = `http://localhost:3000/uploads/${req.file.filename}`;
  res.json({ url });
});

module.exports = router;