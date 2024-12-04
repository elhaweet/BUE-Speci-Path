import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MCQComponent from "./mcq";
import CareerPlanningComponent from "./CareerPlanning";
import KnowledgeHubComponent from "./KnowledgeHub";
import AuthComponent from "./Auth";
import Navbar from "./Navbar";

function AppRouter() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<AuthComponent />} />
        <Route path="/recommend" element={<MCQComponent />} />
        <Route path="/career" element={<CareerPlanningComponent />} />
        <Route path="/knowledgeHub" element={<KnowledgeHubComponent />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
