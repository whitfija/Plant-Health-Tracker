import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Title from './Title';
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "./firebaseInitCode";

export default function RecentData() {
  const [plantData, setPlantData] = React.useState([]);

  React.useEffect(() => {
    const fetchData = async () => {
      const q = query(collection(db, 'plantData'), orderBy('time', 'desc'));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const newData = [];
        querySnapshot.forEach((doc) => {
          newData.push(doc.data());
        });
        setPlantData(newData);
      });
      return unsubscribe;
    };

    fetchData();
  }, [db]);

  return (
    <React.Fragment>
      <Title>Recent Plant Data</Title>
      <div style={{ height: "600px", overflowX: 'auto', overflowY: "scroll"}}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Time</TableCell>
            <TableCell>Light Level (%)</TableCell>
            <TableCell>Humidity (%)</TableCell>
            <TableCell>Moisture (%)</TableCell>
            <TableCell>Temperature (°F)</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {plantData.map((data, index) => (
            <TableRow key={index}>
              <TableCell>{data.time}</TableCell>
              <TableCell>{data.lightLevel}</TableCell>
              <TableCell>{data.humidity}</TableCell>
              <TableCell>{data.moisture}</TableCell>
              <TableCell>{data.temperature}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </div>
    </React.Fragment>
  );
}
