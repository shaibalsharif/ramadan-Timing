import React, { useState, useEffect } from 'react';
import './App.css';
import { ramadan_data } from './data';
import IfterCard from './IfterCard';
import SahriCard from './SahriCard';
import axios from 'axios';

const iftertext = "ইফতার এর বাকি "
const sahritext = "সেহরির  বাকি "

const calculate_hrs_mins = (differenceInMilliseconds) => {
  const hours = Math.floor((differenceInMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)) - 12;
  const minutes = Math.floor((differenceInMilliseconds % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((differenceInMilliseconds % (1000 * 60)) / 1000);
  return { hours, minutes, seconds };
};

const getTimeRemaining = (current, sahri, ifter) => {
  const sahri_time_diff = sahri - current;
  const ifter_time_diff = ifter - current;
  return {
    sahri: calculate_hrs_mins(sahri_time_diff),
    ifter: calculate_hrs_mins(ifter_time_diff),
  };
};

const App = () => {
  const [timeRemaining, setTimeRemaining] = useState(null);
  const current_data = ramadan_data.find((el) => {
    const currentDateObj = new Date();
    const elDateObj = new Date(el.date);
    return (
      currentDateObj.getDate() === elDateObj.getDate() &&
      currentDateObj.getMonth() === elDateObj.getMonth() &&
      currentDateObj.getFullYear() === elDateObj.getFullYear()
    );
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const currentDate = new Date();
      const sahriEndsDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate(),
        parseInt(current_data.sahri_ends.split('-')[0]),
        parseInt(current_data.sahri_ends.split('-')[1]),
        0
      );
      const iftaarstartsDate = new Date(
        currentDate.getFullYear(),
        currentDate.getMonth() + 1,
        currentDate.getDate(),
        parseInt(current_data.iftar_starts.split('-')[0]),
        parseInt(current_data.iftar_starts.split('-')[1]),
        0
      );


      if (currentDate.getHours() > 22 && currentDate.getHours() < 6) {
        const time = getTimeRemaining(currentDate, sahriEndsDate, iftaarstartsDate);
        setTimeRemaining({ type: 'sahri', time });
      } else if (currentDate.getHours() > 6 && currentDate.getHours() < 19) {
        const time = getTimeRemaining(currentDate, sahriEndsDate, iftaarstartsDate);
        setTimeRemaining({ type: 'ifter', time });
      } else {
        const nextSahriDate = new Date(currentDate);
        nextSahriDate.setDate(nextSahriDate.getDate() + 1);
        const nextSahriEndsDate = new Date(
          nextSahriDate.getFullYear(),
          nextSahriDate.getMonth() + 1,
          nextSahriDate.getDate(),
          parseInt(current_data.sahri_ends.split('-')[0]),
          parseInt(current_data.sahri_ends.split('-')[1]),
          0);
        const time = getTimeRemaining(currentDate, nextSahriEndsDate, iftaarstartsDate);
        setTimeRemaining({ type: 'sahri', time });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [current_data]);
  useEffect(() => {
    axios.get("https://api.aladhan.com/v1/timingsByCity/14-03-2024?city=Dhaka&country=Bangladesh&method=8")
      .then(res => {
        console.log(res.data);
      })
  }, [])
  if (!timeRemaining) {
    return null; // Or loading indicator
  }
  


  return (
    <div className="h-screen w-full bg-[#52525256] overflow-hidden">
      {timeRemaining.type === 'sahri' ? (
        <SahriCard text={timeRemaining.type == 'sahri' ? sahritext : ""} time={timeRemaining.time.sahri} />
      ) : (
        <IfterCard text={timeRemaining.type == 'ifter' ? iftertext : ""} time={timeRemaining.time.ifter} />
      )}
    </div>
  );
};

export default App;
