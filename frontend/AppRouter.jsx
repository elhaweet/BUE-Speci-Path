import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import MCQComponent from "./mcq";
import CareerPlanningComponent from "./CareerPlanning";
import KnowledgeHubComponent from "./KnowledgeHub";

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MCQComponent />} />
        <Route path="/Career" element={<CareerPlanningComponent />} />
        <Route path="/KnowledgeHub" element={<KnowledgeHubComponent />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
