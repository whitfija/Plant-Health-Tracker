// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import React, { useState, useEffect } from 'react';


import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import Box from '@mui/material/Box';
import Title from './Title';
import Overlay from "./Overlay";
import { CssBaseline } from "@mui/material";


// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIZX_86XACr_pFqFDM4BcmAGM7F-zAncI",
  authDomain: "plant-health-tracker.firebaseapp.com",
  projectId: "plant-health-tracker",
  storageBucket: "plant-health-tracker.appspot.com",
  messagingSenderId: "791972996799",
  appId: "1:791972996799:web:c1b9b1673aeedfed12480a",
  measurementId: "G-E6KS4L9KLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);




// test code below

const TestDataComponent = () => {
    const [data, setData] = useState([]);
    const [inputData, setInputData] = useState({});
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      const dataSnapshot = await getDocs(collection(db, 'testData'));
      const dataArr = [];
      dataSnapshot.forEach(doc => {
        dataArr.push(doc.data());
      });
      setData(dataArr);
    };
  
    const handleInputChange = (e) => {
      setInputData({
        ...inputData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await addDoc(collection(db, 'testData'), inputData);
      fetchData();
      setInputData({});
    };
  
    return (
      <div>
        <h2>Test Data</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Input 1:
            <input type="text" name="input1" value={inputData.input1 || ''} onChange={handleInputChange} />
          </label>
          <label>
            Input 2:
            <input type="text" name="input2" value={inputData.input2 || ''} onChange={handleInputChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Input 1</th>
              <th>Input 2</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.input1}</td>
                <td>{item.input2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };





  /// plant data ///

  const PlantDataTest = () => {
    const [data, setData] = useState([]);
    const [inputData, setInputData] = useState({
      lightLevel: '',
      humidity: '',
      moisture: '',
      temperature: '',
      time: ''
    });
    const theme = useTheme();
  
    useEffect(() => {
      const fetchData = async () => {
        const q = query(collection(db, 'plantData'), orderBy('time', 'desc'));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const newData = [];
          querySnapshot.forEach((doc) => {
            newData.push(doc.data());
          });
          setData(newData);
        });
        return unsubscribe;
      };
  
      fetchData();
    }, [db]);
  
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        const parsedValue = name === 'time' ? value : parseFloat(value); // Convert to float for numeric fields
      
        setInputData({
          ...inputData,
          [name]: isNaN(parsedValue) ? '' : parsedValue, // Set empty string if parsing fails
          time: new Date().toLocaleString()
        });
      };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await addDoc(collection(db, 'plantData'), inputData);
      setInputData({
        lightLevel: '',
        humidity: '',
        moisture: '',
        temperature: '',
        time: ''
      });
    };
  
    const generateChartData = (type) => {
      return data.map((item) => {
        return { time: item.time, amount: item[type] };
      });
    };

    const defaultTheme = createTheme();
  
    return (
    <ThemeProvider theme={defaultTheme}>
      <Box sx={{ display: 'flex' }}>
        <CssBaseline />
        <Overlay />
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto',
            padding: 10,
          }}
        >
        <h2>Plant Data Test</h2>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label>
              Light Level (lux):
              <input type="text" name="lightLevel" value={inputData.lightLevel} onChange={handleInputChange} />
            </label>
          </div>
          <div className="input-group">
            <label>
              Humidity (%):
              <input type="text" name="humidity" value={inputData.humidity} onChange={handleInputChange} />
            </label>
          </div>
          <div className="input-group">
            <label>
              Moisture (%):
              <input type="text" name="moisture" value={inputData.moisture} onChange={handleInputChange} />
            </label>
          </div>
          <div className="input-group">
            <label>
              Temperature (°C):
              <input type="text" name="temperature" value={inputData.temperature} onChange={handleInputChange} />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Light Level (lux)</th>
              <th>Humidity (%)</th>
              <th>Moisture (%)</th>
              <th>Temperature (°C)</th>
              <th>Time</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.lightLevel}</td>
                <td>{item.humidity}</td>
                <td>{item.moisture}</td>
                <td>{item.temperature}</td>
                <td>{item.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {/* Charts */}
        <div className="charts">
            
            {/* Light */}
            <div className="chart-container">
            <Title>Light Level</Title>
                <div style={{ height: '300px' }}>
                <LineChart
                    dataset={generateChartData('lightLevel')}
                    xAxis={[
                    {
                        scaleType: 'point',
                        dataKey: 'time',
                        tickNumber: 2,
                        tickLabelStyle: theme.typography.body2,
                    },
                    ]}
                    yAxis={[
                    {
                        label: 'Light Level (lux)',
                        labelStyle: {
                        ...theme.typography.body1,
                        fill: theme.palette.text.primary,
                        },
                        tickLabelStyle: theme.typography.body2,
                    },
                    ]}
                    series={[
                    {
                        dataKey: 'amount',
                        showMark: false,
                        color: theme.palette.primary.light,
                    },
                    ]}
                />
                </div>
            </div>

            {/* Humidity */}
            <div className="chart-container">
            <Title>Humidity</Title>
            <div style={{ height: '300px' }}>
                <LineChart
                dataset={generateChartData('humidity')}
                xAxis={[
                    {
                    scaleType: 'point',
                    dataKey: 'time',
                    tickNumber: 2,
                    tickLabelStyle: theme.typography.body2,
                    },
                ]}
                yAxis={[
                    {
                    label: 'Humidity (%)',
                    labelStyle: {
                        ...theme.typography.body1,
                        fill: theme.palette.text.primary,
                    },
                    tickLabelStyle: theme.typography.body2,
                    },
                ]}
                series={[
                    {
                    dataKey: 'amount',
                    showMark: false,
                    color: theme.palette.primary.light,
                    },
                ]}
                />
            </div>
            </div>

            {/* Moisture */}
            <div className="chart-container">
            <Title>Moisture</Title>
            <div style={{ height: '300px' }}>
                <LineChart
                dataset={generateChartData('moisture')}
                xAxis={[
                    {
                    scaleType: 'point',
                    dataKey: 'time',
                    tickNumber: 2,
                    tickLabelStyle: theme.typography.body2,
                    },
                ]}
                yAxis={[
                    {
                    label: 'Moisture (%)',
                    labelStyle: {
                        ...theme.typography.body1,
                        fill: theme.palette.text.primary,
                    },
                    tickLabelStyle: theme.typography.body2,
                    },
                ]}
                series={[
                    {
                    dataKey: 'amount',
                    showMark: false,
                    color: theme.palette.primary.light,
                    },
                ]}
                />
            </div>
            </div>

            {/* Temperature */}
            <div className="chart-container">
            <Title>Temperature</Title>
            <div style={{ height: '300px' }}>
                <LineChart
                dataset={generateChartData('temperature')}
                xAxis={[
                    {
                    scaleType: 'point',
                    dataKey: 'time',
                    tickNumber: 2,
                    tickLabelStyle: theme.typography.body2,
                    },
                ]}
                yAxis={[
                    {
                    label: 'Temperature (°C)',
                    labelStyle: {
                        ...theme.typography.body1,
                        fill: theme.palette.text.primary,
                    },
                    tickLabelStyle: theme.typography.body2,
                    },
                ]}
                series={[
                    {
                    dataKey: 'amount',
                    showMark: false,
                    color: theme.palette.primary.light,
                    },
                ]}
                />
            </div>
            </div>

        </div>
        </Box>
      </Box>
    </ThemeProvider>
    );
  };
  
export default PlantDataTest;