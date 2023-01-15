const express = require('express');
const router = express.Router();

const {
  createCategory,
  getCategories,
  getCategory,
} = require('../controllers/category');

router.post('/category', createCategory);

router.get('/category', getCategories);

router.get('/category/:id', getCategory);

module.exports = router;
