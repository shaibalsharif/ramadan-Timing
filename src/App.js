import React, { useState, useEffect } from 'react';
import './App.css';
import { ramadan_data } from './data';

const App = () => {
  const [timeRemaining, setTimeRemaining] = useState('');
  const current_data = ramadan_data.find(el => {
    const currentDateObj = new Date();
    const elDateObj = new Date(el.date);
    return (
      currentDateObj.getDate() === elDateObj.getDate() &&
      currentDateObj.getMonth() === elDateObj.getMonth() &&
      currentDateObj.getFullYear() === elDateObj.getFullYear()
    );
  });
  useEffect(() => {
    /* const interval = setInterval(() => { */
    const currentDate = new Date();
    const sahriEndsDate = new Date(currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      currentDate.getDate(),
      parseInt(current_data.sahri_ends.split('-')[0]),
      parseInt(current_data.sahri_ends.split('-')[1]),
      0


    );

    const difference = currentDate - sahriEndsDate;
    console.log(currentDate,sahriEndsDate);
    if (difference > 0) {
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      console.log(hours);
      setTimeRemaining(`${hours}:${minutes}:${seconds}`);
    } else {
      setTimeRemaining('Sahri time ended');
    }
  }, []);



  return (
    <div className="h-screen w-full bg-[#52525256] overflow-hidden">
      <div>Time remaining until Sahri ends: {timeRemaining}</div>
    </div>
  );
}

export default App;
