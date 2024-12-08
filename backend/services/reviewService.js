const Review = require('../models/Review');

// Creates a new review for a user
exports.createReview = async (user, reviewData) => {
  const review = new Review({ ...reviewData, userId: user._id });
  return await review.save();
};

// Fetches all reviews by a specific user
exports.getReviewsByUser = async (user) => {
  return await Review.find({ userId: user._id });
};

// Updates a review if the user is authorized
exports.updateReview = async (user, reviewId, updatedData) => {
  const review = await Review.findOneAndUpdate(
    { _id: reviewId, userId: user._id },
    updatedData,
    { new: true }
  );
  if (!review) {
    throw new Error('Review not found or unauthorized');
  }
  return review;
};

// Deletes a review if the user is authorized
exports.deleteReview = async (user, reviewId) => {
  const result = await Review.findOneAndDelete({ _id: reviewId, userId: user._id });
  if (!result) {
    throw new Error('Review not found or unauthorized');
  }
  return result;
};
