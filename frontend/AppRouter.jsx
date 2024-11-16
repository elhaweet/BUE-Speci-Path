import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import MCQComponent from './mcq';
import CareerPlanningComponent from './CareerPlanning';

function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MCQComponent />} />
        <Route path="/Career" element={<CareerPlanningComponent />} />
      </Routes>
    </Router>
  );
}

export default AppRouter;
