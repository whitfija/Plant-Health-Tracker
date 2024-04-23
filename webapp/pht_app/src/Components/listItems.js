import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import AddIcon from '@mui/icons-material/Add';
import SettingsIcon from '@mui/icons-material/Settings';
import ForestIcon from '@mui/icons-material/Forest';
import { db } from './firebaseInitCode';
import { collection, getDocs, where, query} from "firebase/firestore";
import { useState, useEffect } from 'react';
import { Link, useLocation  } from "react-router-dom";

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/">
      <ListItemIcon>
        <ForestIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/plant/new">
      <ListItemIcon>
        <AddIcon />
      </ListItemIcon>
      <ListItemText primary="New Plant">
      </ListItemText>
    </ListItemButton>
    <ListItemButton component={Link} to="/">
      <ListItemIcon>
        <SettingsIcon />
      </ListItemIcon>
      <ListItemText primary="Settings">
      </ListItemText>
    </ListItemButton>
  </React.Fragment>
);

export const SecondaryListItems = () => {
    const [plants, setPlants] = useState([]);
    const location = useLocation();

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
    }, [location.key]);

    return (
    
    <React.Fragment>
      <ListSubheader component="div" inset>
        Plants
      </ListSubheader>

      {plants.map((plant) => (
        <ListItemButton
          key={plant.id}
          component={Link}
          to={`/plant/${plant.id}`}
        >
          <ListItemIcon>
            <img src="/img/plant.png" alt="Plant Icon" style={{ width: 24, height: 24, marginRight: 8 }} />
          </ListItemIcon>
          <ListItemText primary={plant.name} />
        </ListItemButton>
      ))}
    </React.Fragment>
  );
};