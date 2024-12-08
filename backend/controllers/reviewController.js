// controllers/reviewController.js

const { createReview, getReviewsByUser, updateReview, deleteReview } = require('../services/reviewService');
const { decryptJWT } = require('../services/auth');

// Create a new review
exports.createReview = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await decryptJWT(token);

    const review = await createReview(user, req.body);
    res.status(201).json(review);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get reviews by the authenticated user
exports.getReviews = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await decryptJWT(token);

    const reviews = await getReviewsByUser(user);
    res.status(200).json(reviews);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an existing review
exports.updateReview = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await decryptJWT(token);

    const updatedReview = await updateReview(user, req.params.id, req.body);
    res.status(200).json(updatedReview);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    const user = await decryptJWT(token);

    await deleteReview(user, req.params.id);
    res.status(200).json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
