// routes/reviewRoutes.js

const express = require('express');
const {
  createReview,
  getReviews,
  updateReview,
  deleteReview,
} = require('../controllers/reviewController');

const router = express.Router();

router.post('/reviews', createReview);
router.get('/reviews', getReviews);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

module.exports = router;
