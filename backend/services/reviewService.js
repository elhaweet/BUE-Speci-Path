const Review = require('../models/Review');

exports.createReview = async (user, reviewData) => {
  const review = new Review({ ...reviewData, userId: user._id });
  return await review.save();
};

exports.getReviewsByUser = async (user) => {
  return await Review.find({ userId: user._id });
};

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

exports.deleteReview = async (user, reviewId) => {
  const result = await Review.findOneAndDelete({ _id: reviewId, userId: user._id });
  if (!result) {
    throw new Error('Review not found or unauthorized');
  }
  return result;
};
