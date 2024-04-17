import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { db } from './firebaseInitCode';
import { collection, doc, getDoc } from "firebase/firestore";

export default function Welcome({ userId }) {
    const [userName, setUserName] = React.useState("");
    const numberOfPlants = 1;

    React.useEffect(() => {
        const fetchUserData = async () => {
          try {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              setUserName(userData.fname);
            } else {
              console.log("No such document!");
            }
          } catch (error) {
            console.error("Error fetching user data: ", error);
          }
        };
    
        fetchUserData();
    }, [userId]);

    return (
    <React.Fragment>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px', padding: '26px' }}>
        <Typography variant="h4" gutterBottom>
            Hello {userName}!
        </Typography>
        <Typography variant="subtitle1" gutterBottom>
            You are monitoring {numberOfPlants} plant(s)
        </Typography>
        <Button variant="contained" color="primary" >
            Add New Plant
        </Button>
        <Button variant="contained" color="secondary" style={{  }}>
            Account Settings
        </Button>
    </div>
    </React.Fragment>
    );
}
