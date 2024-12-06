const { createReview, getReviewsByUser, updateReview, deleteReview } = require('../services/reviewService');
const { decryptJWT } = require('../services/auth');

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
