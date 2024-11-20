import React, { useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.tsx";
import requestNotificationPermission from "./services/notification.tsx";

const App: React.FC = () => {
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
      </Routes>
    </Router>
  );
};

export default App;
