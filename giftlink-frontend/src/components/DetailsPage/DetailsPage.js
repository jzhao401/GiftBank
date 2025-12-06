import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./DetailsPage.css";
import { urlConfig } from "../../config";

function DetailsPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const [gift, setGift] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const authenticationToken = sessionStorage.getItem("token");
    if (!authenticationToken) {
      // Task 1: Check for authentication and redirect
      navigate("/login");
      return;
    }

    // get the gift to be rendered on the details page
    const fetchGift = async () => {
      try {
        // Task 2: Fetch gift details
        const response = await fetch(
          `${urlConfig.backendUrl}/gift/${productId}`,
        );
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        const data = await response.json();
        setGift(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch comments for the gift
    const fetchComments = async () => {
      try {
        const response = await fetch(
          `${urlConfig.backendUrl}/api/comments/${productId}`,
        );
        if (!response.ok) {
          throw new Error("Failed to fetch comments");
        }
        const data = await response.json();
        setComments(data);
      } catch (error) {
        console.error("Error fetching comments:", error);
        // If comments fail to load, set empty array
        setComments([]);
      }
    };

    fetchGift();
    fetchComments();

    // Task 3: Scroll to top on component mount
    window.scrollTo(0, 0);
  }, [productId, navigate]);

  const handleBackClick = () => {
    // Task 4: Handle back click
    navigate(-1);
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    
    if (!newComment.trim()) {
      return;
    }

    setSubmitting(true);

    try {
      // Get username from session storage
      const username = sessionStorage.getItem("name") || sessionStorage.getItem("userName") || "Anonymous";
      
      const response = await fetch(
        `${urlConfig.backendUrl}/api/comments/${productId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            author: username,
            comment: newComment,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to submit comment");
      }

      const submittedComment = await response.json();
      
      // Add the new comment to the list
      setComments([...comments, submittedComment]);
      
      // Clear the input
      setNewComment("");
    } catch (error) {
      console.error("Error submitting comment:", error);
      alert("Failed to submit comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!gift) return <div>Gift not found</div>;

  return (
    <div className="container mt-5">
      <button className="btn btn-secondary mb-3" onClick={handleBackClick}>
        Back
      </button>
      <div className="card product-details-card">
        <div className="card-header text-white">
          <h2 className="details-title">{gift.name}</h2>
        </div>
        <div className="card-body">
          <div className="image-placeholder-large">
            {gift.image ? (
              <img
                src={gift.image}
                alt={gift.name}
                className="product-image-large"
              />
            ) : (
              <div className="no-image-available-large">No Image Available</div>
            )}
          </div>
          <p>
            <strong>Category:</strong>
            {gift.category}
          </p>
          <p>
            <strong>Condition:</strong>
            {gift.condition}
          </p>
          <p>
            <strong>Date Added:</strong>
            {gift.dateAdded}
          </p>
          <p>
            <strong>Age (Years):</strong>
            {gift.age_years}
          </p>
          <p>
            <strong>Description:</strong>
            {gift.description}
          </p>
        </div>
      </div>

      <div className="comments-section mt-4">
        <h3 className="mb-3">Comments</h3>
        
        {/* Comment submission form */}
        <div className="card mb-4 comment-form-card">
          <div className="card-body">
            <form onSubmit={handleCommentSubmit}>
              <div className="mb-3">
                <label htmlFor="newComment" className="form-label">
                  Add a comment:
                </label>
                <textarea
                  id="newComment"
                  className="form-control"
                  rows="3"
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Share your thoughts..."
                  disabled={submitting}
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={submitting || !newComment.trim()}
              >
                {submitting ? "Submitting..." : "Submit Comment"}
              </button>
            </form>
          </div>
        </div>

        {/* Display existing comments */}
        {comments.length === 0 ? (
          <p className="text-muted">No comments yet. Be the first to comment!</p>
        ) : (
          comments.map((comment, index) => (
            <div
              key={index}
              className={`card mb-3 comment-card comment-${comment.sentiment}`}
            >
              <div className="card-body">
                <div className="comment-header">
                  <p className="comment-author">
                    <strong>{comment.author}</strong>
                    <span className={`sentiment-badge sentiment-${comment.sentiment}`}>
                      {comment.sentiment}
                    </span>
                  </p>
                  {comment.createdAt && (
                    <p className="comment-date">
                      {new Date(comment.createdAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
                <p className="comment-text">{comment.comment}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default DetailsPage;
