import React, { useState, useEffect } from 'react';
import './App.css';
import { ramadan_data } from './data';
import IfterCard from './IfterCard';
import SahriCard from './SahriCard';
import axios from 'axios';

function getCurrentWaqt(waqt_list) {
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentFormattedTime = `${currentHour}:${currentMinute}`;

  for (const [waqt, times] of Object.entries(waqt_list)) {
      const start = times.start.split(':').map(Number);
      const end = times.end.split(':').map(Number);
      
      const startTime = start[0] * 60 + start[1];
      const endTime = end[0] * 60 + end[1];
      const currentTimeInMinutes = currentHour * 60 + currentMinute;

      if (currentTimeInMinutes >= startTime && currentTimeInMinutes < endTime) {
          return waqt;
      }
  }

  return "No active waqt currently"; // If no prayer time is active
}

const iftertext = ""// "ইফতার এর বাকি "
const sahritext = ""//"সেহরির  বাকি "

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
  const [ramadan_date, set_ramadan_date] = useState(null)
  const [waqt_list, set_waqt_List] = useState(null)
  const [waqt,setWaqt]= useState(null)
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
    axios.get("https://api.aladhan.com/v1/timingsByCity/18-03-2024?city=Dhaka&country=Bangladesh&method=8")
      .then(res => {
        set_ramadan_date(parseInt(res.data.data.date.hijri.day) );
    
       
        const { Fajr,Sunrise,Sunset, Dhuhr,Imsak,Firstthird,Midnight,Lastthird, Asr, Maghrib, Isha ,} = res.data.data.timings
        const waqtList = {
          Fajr: { start: Fajr, end: Sunrise },
          Dhuhr: { start: Dhuhr, end: Asr },
          Asr: { start: Asr, end: Maghrib },
          Maghrib: { start: Maghrib, end: Sunset },
          Isha: { start: Isha, end:Firstthird }
        }
        const currentWaqt = getCurrentWaqt(waqtList);
        setWaqt(currentWaqt)
       
        // set_waqt_List({ Fajr, Dhuhr, Asr, Maghrib, Isha, Lastthird });

      })
  }, [])


  useEffect(() => {
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const currentMinute = currentTime.getMinutes();
    const totalCurrentMinutes = currentHour * 60 + currentMinute;

    const prayerTimesInMinutes = {};
    for (const prayer in waqt_list) {
      const time = waqt_list[prayer].split(':');
      prayerTimesInMinutes[prayer] = parseInt(time[0]) * 60 + parseInt(time[1]);
    }
    let currentWaqt = '';
    for (const prayer in prayerTimesInMinutes) {
      if (totalCurrentMinutes >= prayerTimesInMinutes[prayer]) {
        currentWaqt = prayer;
      } else {
        break;
      }
    }

    console.log(currentWaqt);

  }, [waqt_list])
  if (!timeRemaining) {
    return null; // Or loading indicator
  }



  return (
    <div className="h-screen w-full bg-[#52525256] overflow-hidden">

      <div className='float-left h-1/2 w-1/2'>
        <p><span>{ramadan_date}</span>রমজান</p>

      </div>
      {timeRemaining.type === 'sahri' ? (
        <SahriCard text={timeRemaining.type == 'sahri' ? sahritext : ""} time={timeRemaining.time.sahri} />
      ) : (
        <IfterCard text={timeRemaining.type == 'ifter' ? iftertext : ""} time={timeRemaining.time.ifter} />
      )}
    </div>
  );
};

export default App;
