// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, getDocs} from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import React, { useState, useEffect } from 'react';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCIZX_86XACr_pFqFDM4BcmAGM7F-zAncI",
  authDomain: "plant-health-tracker.firebaseapp.com",
  projectId: "plant-health-tracker",
  storageBucket: "plant-health-tracker.appspot.com",
  messagingSenderId: "791972996799",
  appId: "1:791972996799:web:c1b9b1673aeedfed12480a",
  measurementId: "G-E6KS4L9KLN"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Cloud Firestore and get a reference to the service
const db = getFirestore(app);




// test code below

const TestDataComponent = () => {
    const [data, setData] = useState([]);
    const [inputData, setInputData] = useState({});
  
    useEffect(() => {
      fetchData();
    }, []);
  
    const fetchData = async () => {
      const dataSnapshot = await getDocs(collection(db, 'testData'));
      const dataArr = [];
      dataSnapshot.forEach(doc => {
        dataArr.push(doc.data());
      });
      setData(dataArr);
    };
  
    const handleInputChange = (e) => {
      setInputData({
        ...inputData,
        [e.target.name]: e.target.value
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      await addDoc(collection(db, 'testData'), inputData);
      fetchData();
      setInputData({});
    };
  
    return (
      <div>
        <h2>Test Data</h2>
        <form onSubmit={handleSubmit}>
          <label>
            Input 1:
            <input type="text" name="input1" value={inputData.input1 || ''} onChange={handleInputChange} />
          </label>
          <label>
            Input 2:
            <input type="text" name="input2" value={inputData.input2 || ''} onChange={handleInputChange} />
          </label>
          <button type="submit">Submit</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>Input 1</th>
              <th>Input 2</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.input1}</td>
                <td>{item.input2}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };
  
  export default TestDataComponent;