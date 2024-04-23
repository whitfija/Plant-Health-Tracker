import logo from './logo.svg';
import React from 'react';
import { BrowserRouter, Routes, Route, useParams   } from "react-router-dom";
import './App.css';
import Dashboard from './Components/Dashboard';
import TestDataComponent from './Components/firebaseTesting';
import PlantDataTest from './Components/firebaseTesting';
import './PlantDataTest.css';
import PlantSelect from './Components/PlantSelect';
import NewPlantForm from './Components/NewPlantForm';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard plantId={'0JpvIKo0TQ8r70AeSKhe'} userId={'0'}/>} />
        <Route path="/datatest" element={<TestDataComponent />} />
        <Route path="/plantdatatest" element={<PlantDataTest />} />
        <Route path="/plant/:id" element={<DashboardWithSelectedPlant />} />
        <Route path="/plant/select" element={<PlantSelect userId={'0'}/>} />
        <Route path="/plant/new" element={<NewPlantForm userId={'0'}/>}/>
      </Routes>
    </BrowserRouter>
  );
}

// specific plant dashboard
function DashboardWithSelectedPlant() {
  const { id: plantId } = useParams();
  return <Dashboard plantId={plantId} userId={'0'} />;
}

export default App;
