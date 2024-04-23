import { getFirestore, collection, addDoc, getDocs, query, orderBy, onSnapshot} from "firebase/firestore";
import React, { useState, useEffect } from 'react';
import { db } from './firebaseInitCode';
import { useTheme, ThemeProvider, createTheme } from '@mui/material/styles';
import { Box, TextField, Button, Typography, Select, MenuItem } from '@mui/material';
import Title from './Title';
import Overlay from "./Overlay";
import { CssBaseline } from "@mui/material";
import { useNavigate  } from 'react-router-dom';

  const NewPlantForm = () => {

    const navigate = useNavigate();
    const [inputData, setInputData] = useState({
        nickname: '',
        type: '',
    });
    const [plantTypes, setPlantTypes] = useState([]);
    
    useEffect(() => {
    const fetchPlantTypes = async () => {
        try {
        const typesSnapshot = await getDocs(collection(db, 'plantType'));
        const typesData = typesSnapshot.docs.map(doc => doc.id);
        setPlantTypes(typesData);
        } catch (error) {
        console.error("Error fetching plant types: ", error);
        }
    };

    fetchPlantTypes();
    }, []);

    const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputData({
        ...inputData,
        [name]: value,
    });
    };

    const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        inputData.dateadded = new Date().toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
            timeZoneName: 'short',
        });
        inputData.userid = '0';
        const docRef = await addDoc(collection(db, 'plants'), inputData);
        setInputData({
            nickname: '',
            type: '',
        });
        const plantId = docRef.id;
        navigate(`/plant/${plantId}`);

    } catch (error) {
        console.error("Error adding new plant: ", error);
    }
    };

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
        <h2>Add your new plant!</h2>
        <form onSubmit={handleSubmit}>
          <TextField
            label="Plant Nickname"
            name="nickname"
            value={inputData.nickname}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            fullWidth
          />
          <Select
            label="Plant Type"
            name="type"
            value={inputData.type}
            onChange={handleInputChange}
            margin="normal"
            variant="outlined"
            fullWidth
          >
            <MenuItem value="" disabled>
              Select Plant Type
            </MenuItem>
            {plantTypes.map((Ptype, index) => (
              <MenuItem key={index} value={Ptype}>{Ptype}</MenuItem>
            ))}
          </Select>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
          >
            Submit
          </Button>
        </form>
        </Box>
      </Box>
    </ThemeProvider>
    );
  };
  
export default NewPlantForm;