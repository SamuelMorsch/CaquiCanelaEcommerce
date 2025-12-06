const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Para garantir que a pasta uploads existe

const router = express.Router();

// Define onde as imagens serão salvas e como serão nomeadas
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '..', '..', 'uploads'); // Caminho para backend/uploads
    // Garante que a pasta 'uploads' existe. Se não existir, cria.
    fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    // Renomeia o arquivo para evitar conflitos (ex: imagem-123456789.jpg)
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Rota POST /api/upload para fazer upload de uma única imagem
router.post('/', upload.single('productImage'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Nenhum arquivo enviado.' });
  }

  // Retorna a URL pública da imagem. O frontend precisará disso para salvar.
  // A URL será algo como: http://localhost:3000/uploads/productImage-12345.jpg
  res.json({ imageUrl: `/uploads/${req.file.filename}` });
});

module.exports = router;