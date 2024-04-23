import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import { db } from './firebaseInitCode';
import { collection, doc, getDoc, getDocs, where } from "firebase/firestore";

export default function Welcome({ userId }) {
    const [userName, setUserName] = React.useState("");
    const [numberOfPlants, setNumberOfPlants] = React.useState(0);

    React.useEffect(() => {
        const fetchUserData = async () => {
          try {
            const userDocRef = doc(db, "users", userId);
            const userDocSnap = await getDoc(userDocRef);
            if (userDocSnap.exists()) {
              const userData = userDocSnap.data();
              setUserName(userData.fname);
              const plantsSnapshot = await getDocs(collection(db, 'plants'), where('userid', '==', userId));
              console.log(plantsSnapshot.size)
              setNumberOfPlants(plantsSnapshot.size)
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
            Monitoring {numberOfPlants} plant(s)
        </Typography>
        <Button variant="contained" color="primary" href='/plant/new'>
            Add New Plant
        </Button>
        <Button variant="contained" color="secondary" style={{  }}>
            Account Settings
        </Button>
    </div>
    </React.Fragment>
    );
}
