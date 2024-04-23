import React, { useRef } from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Chart from './Chart';
import HealthStatus from './Deposits';
import RecentData from './RecentData';
import Overlay from './Overlay';
import { db } from './firebaseInitCode';
import { getFirestore, collection, doc, addDoc, getDoc, getDocs, query, where, orderBy, onSnapshot} from "firebase/firestore";
import { useState, useEffect } from 'react';
import Loading from './Loading';
import Welcome from './Welcome';
import PlantHome from './PlantHome';
import { useParams } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#257a33',
    },
    secondary: {
      main: '#8bab35',
    },
  },
});

export default function Dashboard({plantId, userId}) {
  const [open, setOpen] = React.useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [mostRecentDataPt, setMostRecentDataPt] = useState({});
  const [lightHealthy, setLightHealthy] = useState(false);
  const [moistureHealthy, setMoistureHealthy] = useState(false);
  const [humidityHealthy, setHumidityHealthy] = useState(false);
  const [temperatureHealthy, setTemperatureHealthy] = useState(false);
  const [plantDoc, setPlantDoc] = useState(null);
  const { id } = useParams();
  //console.log(userId)

  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'plantData'), where('plantId', '==', plantId), orderBy('time', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newData = [];
        querySnapshot.forEach((doc) => {
          newData.push(doc.data());
        });
        setData(newData);
        setMostRecentDataPt(newData[0])
        setIsLoading(false);
      });
      return unsubscribe;
    };
    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchPlantData = async () => {
      try {
        //console.log(plantId)
        const plantDocRef = doc(db, 'plants', plantId);
        const plantDocSnap = await getDoc(plantDocRef);
        if (plantDocSnap.exists()) {
          const plantData = plantDocSnap.data();
          setPlantDoc(plantData);
        } else {
          console.log('No such document in plants!');
        }
      } catch (error) {
        console.error('Error fetching plant data: ', error);
      }
    };

    fetchPlantData();
  }, [plantId]);

  useEffect(() => {
    const fetchPlantMetaData = async () => {
      try {
        if (plantDoc) {
          //console.log(plantDoc)
          //console.log(plantDoc['type'])
          const plantType = plantDoc['type'].replace(/"/g, '');
          const plantTypeDocRef = doc(db, 'plantType', plantType);
          const plantTypeDocSnap = await getDoc(plantTypeDocRef);
    
          if (plantTypeDocSnap.exists()) {
            const baseline = plantTypeDocSnap.data();
    
            (mostRecentDataPt['lightLevel'] <= baseline.Light[1] && mostRecentDataPt['lightLevel'] >= baseline.Light[0]) ? setLightHealthy(true) : setLightHealthy(false);
            (mostRecentDataPt['humidity'] <= baseline.Humidity[1] && mostRecentDataPt['humidity'] >= baseline.Humidity[0]) ? setHumidityHealthy(true) : setHumidityHealthy(false);
            (mostRecentDataPt['moisture'] <= baseline.Moisture[1] && mostRecentDataPt['moisture'] >= baseline.Moisture[0]) ? setMoistureHealthy(true) : setMoistureHealthy(false);
            (mostRecentDataPt['temperature'] <= baseline.Temperature[1] && mostRecentDataPt['temperature'] >= baseline.Temperature[0]) ? setTemperatureHealthy(true) : setTemperatureHealthy(false);

            setIsLoading(false);
          } else {
            console.log('No such document in plantType!');
          }
        }
      } catch (error) {
        console.error('Error fetching plant type data: ', error);
      }
    };
    fetchPlantMetaData();
  }, [plantId]);


  // for selecting charts
  const [selectedChart, setSelectedChart] = useState('temperature'); // Initialize with default chart
  const handleChartSelection = (dataType) => {
    setSelectedChart(dataType);
  };
  const chartPaper = useRef(null);



  return isLoading? <Loading/> : (
    <ThemeProvider theme={theme}>
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
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3} justifyContent="center" alignItems="center">

              {/* Welcome */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2, height: 261.49 }}>
                  <Welcome userId={userId}/>
                </Paper>
              </Grid>
              {/* Plant Home */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 2}}>
                  <PlantHome plantData={plantDoc} />
                </Paper>
              </Grid>

              {mostRecentDataPt && (
              <>

              {/* health statuses */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <HealthStatus dataSet="Light" health={lightHealthy ? "Good" : "Bad"} dataTime={mostRecentDataPt['time']} onSelectChart={() => handleChartSelection('lightLevel')} chartRef={chartPaper} data={mostRecentDataPt['lightLevel'] + '%'}/>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <HealthStatus dataSet="Moisture" health={moistureHealthy?"Good":"Bad"} dataTime={mostRecentDataPt['time']} onSelectChart={() => handleChartSelection('moisture')} chartRef={chartPaper} data={mostRecentDataPt['moisture'] + '%'}/>
                </Paper>
              </Grid>
               <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <HealthStatus dataSet="Temperature" health={temperatureHealthy?"Good":"Bad"} dataTime={mostRecentDataPt['time']} onSelectChart={() => handleChartSelection('temperature')} chartRef={chartPaper} data={mostRecentDataPt['temperature'] + '°F'}/>
                </Paper>
              </Grid>
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <HealthStatus dataSet="Humidity" health={humidityHealthy?"Good":"Bad"} dataTime={mostRecentDataPt['time']} onSelectChart={() => handleChartSelection('humidity')} chartRef={chartPaper} data={mostRecentDataPt['humidity'] + '%'}/>
                </Paper>
              </Grid>

              {/* Chart */}
              <Grid item xs={12} md={8} lg={9} style={{minWidth:"100%"}}>
                <Paper 
                  ref={chartPaper}
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 400,
                  }}
                >
                  <Chart dataType={selectedChart} />
                </Paper>
              </Grid>


              {/* Recent Data */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <RecentData />
                </Paper>
              </Grid>
              </>)}
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}