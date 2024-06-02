import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import VerifyIdentity from './VerifyIdentity';
import Home from './Home';
import Exam from './exam';
import FraudDetectionPage from './dashboard.js';
import ExamResults from './result.js';


function App() {
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  return (
    <Router>
      <div>
        <Routes>
         <Route path="/" element={<Login />} />
         <Route path="/verify" element={<VerifyIdentity />} />
         <Route path="/home" element={<Home />} />
         <Route path="/exam" element={<Exam />} />
         <Route path="/dash" element={<FraudDetectionPage />} />
         <Route path="/result" element={<ExamResults />} />

        
        </Routes>
      </div>
    </Router>
  );
}

export default App;
