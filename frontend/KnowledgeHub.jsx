import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import "./KnowledgeHub.css";

function KnowledgeHub() {
  const location = useLocation();
  const { specializationName, careerName } = location.state || {};

  const [courses, setCourses] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [KnowledgeHub, setKnowledgeHub] = useState(specializationName || "Software Engineering"); 
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const coursesPerPage = 18;

  // Automatically trigger the search when the component mounts if careerName exists
  useEffect(() => {
    if (careerName && !searchQuery) {
      setSearchQuery(careerName);
      handleSearch();
    }
  }, [careerName, searchQuery]);

  // Fetch courses for the current specialization or search query
  useEffect(() => {
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
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setCurrentPage(1); // Reset to the first page on new search
      fetchCourses(searchQuery);
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Ensure the scroll happens after DOM update
    setTimeout(() => {
      document.querySelector("#BG-img").scrollIntoView({
        behavior: "smooth",
        block: "start", // Scrolls to the top of the element
      });
    }, 100); // Small delay to ensure DOM updates
  };

  // Get current courses for the page
  const indexOfLastCourse = currentPage * coursesPerPage;
  const indexOfFirstCourse = indexOfLastCourse - coursesPerPage;
  const currentCourses = courses.slice(indexOfFirstCourse, indexOfLastCourse);

  // Calculate total pages
  const totalPages = Math.ceil(courses.length / coursesPerPage);

  // Create an array of page numbers
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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
            value={searchQuery || careerName}
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
        ) : currentCourses.length > 0 ? (
          <div className="course-list">
            {currentCourses.map((course, index) => (
              <div key={index} className="course-item">
                <img
                  src={course.image}
                  alt={course.title}
                  className="course-image"
                />
                <h3 className="course-title">{course.title}</h3>
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

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination">
            {pageNumbers.map((number) => (
              <button
                key={number}
                className={`page-button ${
                  currentPage === number ? "active" : ""
                }`}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default KnowledgeHub;
