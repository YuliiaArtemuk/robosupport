import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./login";
import MainPage from "./main";

const App = () => {
  return (
    <Router>
      <Routes>
        {/* Define the route for the Login Page */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/main" element={<MainPage />} />
      </Routes>
    </Router>
  );
};

export default App;