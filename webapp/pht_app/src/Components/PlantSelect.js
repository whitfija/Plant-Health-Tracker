import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot, where} from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import { db } from './firebaseInitCode';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
import Title from './Title';
import Overlay from "./Overlay";
import { CssBaseline } from "@mui/material";
import { useNavigate  } from 'react-router-dom';

const PlantSelect = () => {

    const [plants, setPlants] = useState([]);

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

    useEffect(() => {
      const fetchPlants = async () => {
        const userId = '0';
        const plantsSnapshot = await getDocs(collection(db, 'plants'), where('userid', '==', userId));
        if (plantsSnapshot.empty) {
          console.log('No matching documents.');
          setPlants([]);
          return;
        }
        const fetchedPlants = [];
        plantsSnapshot.forEach((doc) => {
          fetchedPlants.push({
            id: doc.id,
            name: doc.data().nickname,
          });
          setPlants(fetchedPlants);
        });
        //console.log(plants)
        //console.log(fetchedPlants)
      };
      fetchPlants();
    }, []);
  
    return (
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
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
                overflow: 'auto',
                padding: '20px',
            }}
            >
            <h2>Your plants.</h2>
            
            {plants.map((plant) => (
                <Button
                    key={plant.id}
                    variant="contained"
                    color="primary"
                    style={{ margin: '10px' }}
                    href={'/plant/' + plant.id}
                >
                    {plant.name}
                </Button>
            ))}

            </Box>
        </Box>
    </ThemeProvider>
    );
  };
  
export default PlantSelect;