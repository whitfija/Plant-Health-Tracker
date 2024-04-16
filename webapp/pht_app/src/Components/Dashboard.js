import * as React from 'react';
import { styled, createTheme, ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import Badge from '@mui/material/Badge';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import NotificationsIcon from '@mui/icons-material/Notifications';
import { mainListItems, secondaryListItems } from './listItems';
import Chart from './Chart';
import HealthStatus from './Deposits';
import Orders from './Orders';
import Overlay from './Overlay';
import { firebaseConfig } from './firebaseInitCode';
import { getFirestore, collection, addDoc, getDocs, query, where, orderBy, onSnapshot} from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { useState, useEffect } from 'react';
import Loading from './Loading';



const drawerWidth = 240;

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen,
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9),
        },
      }),
    },
  }),
);

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

export default function Dashboard() {
  const [open, setOpen] = React.useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);
  const [mostRecentDataPt, setMostRecentDataPt] = useState({});
  const [lightHealthy, setLightHealthy] = useState(false);
  const [moistureHealthy, setMoistureHealthy] = useState(false);
  const [humidityHealthy, setHumidityHealthy] = useState(false);
  const [temperatureHealthy, setTemperatureHealthy] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'plantData'), orderBy('time', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newData = [];
        querySnapshot.forEach((doc) => {
          newData.push(doc.data());
        });
        setData(newData);
        setMostRecentDataPt(newData[0])
      });
      return unsubscribe;
    };

    fetchData();
  }, [db]);

  useEffect(() => {
    const fetchPlantMetaData = async () => {
      // Will rewrite this query to be flexible for whatever plant the user is using
      const q = query(collection(db, 'plantType'), where('__name__', '==', 'African Violet'))
      const querySnapshot = await getDocs(q);
      let baseline;
      querySnapshot.forEach((doc) => {
        baseline = doc.data();
      });
      (mostRecentDataPt['lightLevel'] < baseline.Light[1] && mostRecentDataPt['lightLevel'] > baseline.Light[0])?setLightHealthy(true):setLightHealthy(false);
      (mostRecentDataPt['humidity'] < baseline.Humidity[1] && mostRecentDataPt['humidity'] > baseline.Humidity[0])?setHumidityHealthy(true):setHumidityHealthy(false);
      (mostRecentDataPt['moisture'] < baseline.Moisture[1] && mostRecentDataPt['moisture'] > baseline.Moisture[0])?setMoistureHealthy(true):setMoistureHealthy(false);
      (mostRecentDataPt['temperature'] < baseline.Temperature[1] && mostRecentDataPt['temperature'] > baseline.Temperature[0])?setTemperatureHealthy(true):setTemperatureHealthy(false);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    };
    fetchPlantMetaData();
  }, [mostRecentDataPt]);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return isLoading? <Loading/> : (
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
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9} style={{minWidth:"100%"}}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <Chart />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240,
                  }}
                >
                  <HealthStatus dataSet="Light" health={lightHealthy?"Good":"Bad"} dataTime={Date().toLocaleString()} />
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
                  <HealthStatus dataSet="Moisture" health={moistureHealthy?"Good":"Bad"} dataTime={Date().toLocaleString()} />
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
                  <HealthStatus dataSet="Temperature" health={temperatureHealthy?"Good":"Bad"} dataTime={Date().toLocaleString()} />
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
                  <HealthStatus dataSet="Humidity" health={humidityHealthy?"Good":"Bad"} dataTime={Date().toLocaleString()} />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Orders />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </Box>
    </ThemeProvider>
  );
}