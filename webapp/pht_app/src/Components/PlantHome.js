import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import { db } from './firebaseInitCode';
import { collection, doc, getDoc } from "firebase/firestore";
import Title from './Title';

export default function PlantHome({ plantId }) {
  const [plantData, setPlantData] = useState(null);

    React.useEffect(() => {
        const fetchPlantData = async () => {
            try {
                const plantDocRef = doc(db, "plants", plantId);
                const planDocSnap = await getDoc(plantDocRef);
                if (planDocSnap.exists()) {
                    const plantData = planDocSnap.data();
                    setPlantData(plantData);
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error fetching plant data: ", error);
            }
        };

        fetchPlantData();
    }, [plantId]);

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
                        <Button variant="contained" color="primary" onClick={() => {}}>
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
