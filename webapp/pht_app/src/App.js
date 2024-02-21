import logo from './logo.svg';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Dashboard from './Components/Dashboard';
import TestDataComponent from './Components/firebaseTesting';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/datatest" element={<TestDataComponent />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
