import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MCQComponent from "./mcq";
import CareerPlanningComponent from "./CareerPlanning";
import KnowledgeHubComponent from "./KnowledgeHub";
import UserReviews from "./UserReviews";
import AuthComponent from "./Auth";
import UserProfile from "./UserProfile";
import Navbar from "./Navbar";

function AppRouter() {
  return (
    <Router basename="/BUE-Path">
      <Navbar />
      <Routes>
        <Route path="/" element={<AuthComponent />} />
        <Route path="/recommend" element={<MCQComponent />} />
        <Route path="/career" element={<CareerPlanningComponent />} />
        <Route path="/knowledgeHub" element={<KnowledgeHubComponent />} />
        <Route path="/review" element={<UserReviews />} />
        <Route path="/profile" element={<UserProfile />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
