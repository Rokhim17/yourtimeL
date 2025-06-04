const express = require('express');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const Letter = require('../models/Letter');
const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname),
});
const upload = multer({ storage });

const authMiddleware = (req, res, next) => {
  const token = req.header('x-auth-token');
  if (!token) return res.status(401).json({ msg: 'No token' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded.id;
    next();
  } catch {
    res.status(401).json({ msg: 'Invalid token' });
  }
};

router.post('/send', authMiddleware, upload.single('file'), async (req, res) => {
  const { title, message, openDate } = req.body;
  const fileUrl = req.file ? req.file.path : null;

  try {
    const letter = new Letter({
      userId: req.user,
      title,
      message,
      fileUrl,
      openDate,
    });
    await letter.save();
    res.json(letter);
  } catch (err) {
    res.status(500).send('Server error');
  }
});

router.get('/myletters', authMiddleware, async (req, res) => {
  try {
    const letters = await Letter.find({ userId: req.user });
    res.json(letters);
  } catch {
    res.status(500).send('Server error');
  }
});

module.exports = router;
