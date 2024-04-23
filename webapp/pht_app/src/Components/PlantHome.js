import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Title from './Title';

export default function PlantHome({ plantData }) {

    return (
        <React.Fragment>
            <Title>Current Plant:</Title>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: '30px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Avatar alt="Plant Logo" src="/img/planticon.png" sx={{ width: 150, height: 150}} />
                </div>
                {plantData && (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    <div>
                    <Typography variant="h4" gutterBottom>
                        {plantData.nickname}
                    </Typography>
                    <Typography variant="subtitle1" gutterBottom>
                        ({plantData.type})
                    </Typography>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
                        <Button variant="contained" color="primary" href="/plant/select">
                            Switch Plant
                        </Button>
                        <Button variant="contained" color="secondary" onClick={() => {}} style={{marginBottom: '20px'}}>
                            Modify Plant
                        </Button>
                    </div>
                </div>
                )}
            </div>

        </React.Fragment>
    );
    }
