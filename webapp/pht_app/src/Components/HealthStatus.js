import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Title from './Title';
import StatusModal from './StatusModal'

function preventDefault(event) {
  event.preventDefault();
}

export default function HealthStatus({dataSet, health, dataTime}) {
  const [modalOpen, setModalOpen] = React.useState(false);
  const handleClose = () => {
      setModalOpen(false);
  };

  const handleOpen = () => {
      setModalOpen(true);
  };
  return (
    <React.Fragment>
      <Title>{dataSet}</Title>
      <Typography component="p" variant="h4">
        Status: {health}
      </Typography>
      <Typography color="text.secondary" sx={{ flex: 1 }}>
        {dataTime}
      </Typography>
      <div>
        <button type="button" onClick={handleOpen}>
          View Status
        </button>
        <StatusModal isOpen={modalOpen} onClose={handleClose} />
      </div>
    </React.Fragment>
  );
}