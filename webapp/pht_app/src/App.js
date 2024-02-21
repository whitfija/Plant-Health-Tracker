import logo from './logo.svg';
import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Dashboard from './Components/Dashboard';
import TestDataComponent from './Components/firebaseTesting';

import PlantDataTest from './Components/firebaseTesting';
import './PlantDataTest.css';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/datatest" element={<TestDataComponent />} />
        <Route path="/plantdatatest" element={<PlantDataTest />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
