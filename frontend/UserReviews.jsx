import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./UserReviews.css";

const UserReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [newReview, setNewReview] = useState({ title: "", content: "", rating: 5 });
  const [editReview, setEditReview] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }

    // Fetch user-specific reviews using the token
    const fetchUserReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5000/reviews", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReviews(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        setMessage("Error fetching reviews.");
        setLoading(false);
      }
    };

    fetchUserReviews();
  }, [navigate]);

  const handleAddReview = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.post(
        "http://localhost:5000/reviews",
        newReview,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews([...reviews, response.data]);
      setNewReview({ title: "", content: "", rating: 5 });
      setMessage("Review added successfully!");
    } catch (error) {
      console.error("Error adding review:", error);
      setMessage("Error adding review.");
    }
  };

  const handleEditReview = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await axios.put(
        `http://localhost:5000/reviews/${editReview._id}`,
        { title: editReview.title, content: editReview.content, rating: editReview.rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviews(
        reviews.map((review) =>
          review._id === response.data._id ? response.data : review
        )
      );
      setEditReview(null);
      setMessage("Review updated successfully!");
    } catch (error) {
      console.error("Error updating review:", error);
      setMessage("Error updating review.");
    }
  };

  const handleDeleteReview = async (reviewId) => {
    const token = localStorage.getItem("token");
    try {
      await axios.delete(`http://localhost:5000/reviews/${reviewId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReviews(reviews.filter((review) => review._id !== reviewId));
      setMessage("Review deleted successfully!");
    } catch (error) {
      console.error("Error deleting review:", error);
      setMessage("Error deleting review.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (editReview) {
      setEditReview({ ...editReview, [name]: value });
    } else {
      setNewReview({ ...newReview, [name]: value });
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <div className="reviews-body">
      <div className="reviews-container">
        <h2>Help Us Improve</h2>
        {message && <div className={`message ${message.includes("Error") ? "error" : "success"}`}>{message}</div>}

        <form
          className="review-form"
          onSubmit={(e) => {
            e.preventDefault();
            editReview ? handleEditReview() : handleAddReview();
          }}
        >
          <h3>{editReview ? "Edit Review" : "Add a Review"}</h3>
          <input
            type="text"
            name="title"
            value={editReview ? editReview.title : newReview.title}
            onChange={handleInputChange}
            placeholder="Review Title"
            required
          />
          <textarea
            name="content"
            value={editReview ? editReview.content : newReview.content}
            onChange={handleInputChange}
            placeholder="Write your review here..."
            required
          />
          <div className="slider-container">
            <label htmlFor="rating-slider">
              Rating: {editReview ? editReview.rating : newReview.rating} {" "}
              {[...Array(5)].map((_, index) => {
                return (
                  <i
                    key={index}
                    className={`fas fa-star ${index < (editReview ? editReview.rating : newReview.rating) ? 'filled' : ''}`}
                    style={{ color: index < (editReview ? editReview.rating : newReview.rating) ? "#f39c12" : "#ccc" }}
                  ></i>
                );
              })}
            </label>
            <input
              id="rating-slider"
              type="range"
              name="rating"
              min="1"
              max="5"
              value={editReview ? editReview.rating : newReview.rating}
              onChange={(e) => {
                const value = parseInt(e.target.value);
                handleInputChange({ target: { name: "rating", value } });
              }}
            />
          </div>
          <button type="submit">
            {editReview ? "Save Changes" : "Submit Review"}
          </button>
          {editReview && (
            <button type="button" onClick={() => setEditReview(null)}>Cancel</button>
          )}
        </form>

        <div className="reviews-list">
          <h3>Your Reviews</h3>
          {reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="review-item">
                <h4>{review.title}</h4>
                <p>{review.content}</p>
                <p>Rating: {review.rating}</p>
                <p><small>Created At: {new Date(review.createdAt).toLocaleString()}</small></p>
                {review.updatedAt && (
                  <p><small>Updated At: {new Date(review.updatedAt).toLocaleString()}</small></p>
                )}
                <button onClick={() => setEditReview(review)}>Edit</button>
                <button onClick={() => handleDeleteReview(review._id)}>Delete</button>
              </div>
            ))
          ) : (
            <p>No reviews found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserReviews;
