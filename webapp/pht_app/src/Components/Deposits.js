import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';

function preventDefault(event) {
  event.preventDefault();
}

export default function HealthStatus({dataSet, health, dataTime, onSelectChart, chartRef, data}) {
  const handleViewHistory = (event) => {
    event.preventDefault();
    onSelectChart(dataSet.toLowerCase());
    //if (chartRef.current) {
      //chartRef.current.scrollIntoView({ behavior: 'smooth' });
    //}
  };

  // text color
  const textStyle = { color: health === 'Good' ? 'green' : 'red', };


  return (
    <React.Fragment>
      <Title>{dataSet}</Title>
      <Typography component="p" variant="h4">
        {data}
      </Typography>
      <Typography component="p" variant="h4" style={textStyle}>
        ({health})
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {dataTime}
      </Typography>
      <div>
        <Link color="primary" href="#" onClick={handleViewHistory}>
          View history
        </Link>
      </div>
    </React.Fragment>
  );
}