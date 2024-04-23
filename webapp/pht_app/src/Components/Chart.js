import React, { useState, useEffect } from 'react';
import { useTheme } from '@mui/material/styles';
import { LineChart, axisClasses } from '@mui/x-charts';
import Title from './Title';
import { query, collection, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from './firebaseInitCode';

export default function Chart({ dataType }) {
  const [data, setData] = useState([]);
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
  }, []);

  const generateChartData = (type) => {
    return data.map((item) => {
      return { time: item.time, amount: item[type] };
    });
  };

  const formatDataType = (dataType) => {
    switch (dataType) {
      case 'lightLevel':
        return 'Light Level';
      case 'humidity':
        return 'Humidity';
      case 'moisture':
        return 'Moisture';
      case 'temperature':
        return 'Temperature';
      default:
        return dataType;
    }
  };

  return (
    <React.Fragment>
      <Title>{formatDataType(dataType)}</Title>
      <div style={{ height: '300px' }}>
        <LineChart
          dataset={generateChartData(dataType)}
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
              label: `${formatDataType(dataType)}`,
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
          grid={{ vertical: true, horizontal: true }}
        />
      </div>
    </React.Fragment>
  );
}