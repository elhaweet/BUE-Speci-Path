import React, { useState, useEffect } from "react";
import axios from "axios";
import "./KnowledgeHub.css";

function KnowledgeHup() {
  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [KnowledgeHub, setKnowledgeHub] = useState("Software Development");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Fetch recommended courses for the career when the component loads
    fetchCourses(KnowledgeHub);
  }, [KnowledgeHub]);

  const fetchCourses = async (query) => {
    setIsLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:5000/get-courses?query=${query}`
      ); // Replace with your backend API for fetching courses
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCourses([]);
    }
    setIsLoading(false);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      fetchCourses(searchQuery);
    }
  };

  return (
    <div id="BG-img">
      <div className="content">
        <h2 className="heading">Recommended Courses</h2>

        {/* Recommended Career */}
        <div className="career-info">
          <h3>Career Path: {KnowledgeHub}</h3>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearch} className="search-bar">
          <input
            type="text"
            placeholder="Search for other courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="search-input"
          />
          <button type="submit" className="search-button">
            Search
          </button>
        </form>

        {/* Course List */}
        {isLoading ? (
          <p>Loading courses...</p>
        ) : courses.length > 0 ? (
          <div className="course-list">
            {courses.map((course, index) => (
              <div key={index} className="course-item">
                <h3 className="course-title">{course.title}</h3>
                <p className="course-description">{course.description}</p>
                <p>
                  <strong>Platform:</strong> {course.platform}
                </p>
                <a
                  href={course.url}
                  className="course-link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  View Course
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p>No courses found.</p>
        )}
      </div>
    </div>
  );
}

export default KnowledgeHup;
