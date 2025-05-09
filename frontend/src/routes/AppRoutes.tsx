import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<div>Welcome to TaskSmith!</div>} />
        {/* Future routes go here */}
      </Routes>
    </Router>
  );
};

export default AppRoutes;
