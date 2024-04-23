import React from "react";
import '../loading.css'
 
export default function Loading() {
    return (
        <div className="rootTest">
            <img src={`${process.env.PUBLIC_URL}/img/roundplant.png`} alt="Loading" className="spinner" style={{width: '100px', height: 'auto', marginBottom: '40px'}}/>
            <p aria-label="Loading">Loading</p>
        </div>
    );
}