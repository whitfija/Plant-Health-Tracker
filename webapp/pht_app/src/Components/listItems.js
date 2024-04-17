import * as React from 'react';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import ListSubheader from '@mui/material/ListSubheader';
import DashboardIcon from '@mui/icons-material/Dashboard';
import DataUsageIcon from '@mui/icons-material/DataUsage';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import ForestIcon from '@mui/icons-material/Forest';

import { Link } from "react-router-dom";

export const mainListItems = (
  <React.Fragment>
    <ListItemButton component={Link} to="/">
      <ListItemIcon>
        <ForestIcon />
      </ListItemIcon>
      <ListItemText primary="Dashboard" />
    </ListItemButton>
    <ListItemButton component={Link} to="/datatest">
      <ListItemIcon>
        <DataUsageIcon />
      </ListItemIcon>
      <ListItemText primary="Data Sets">
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

export const secondaryListItems = (
  <React.Fragment>
    <ListSubheader component="div" inset>
      Plants
    </ListSubheader>
    <ListItemButton>
      <ListItemIcon>
        <img src="/img/plant.png" alt="Custom Icon" style={{ width: 24, height: 24, marginRight: 8 }} />
      </ListItemIcon>
      <ListItemText primary="African Violet" />
    </ListItemButton>
  </React.Fragment>
);