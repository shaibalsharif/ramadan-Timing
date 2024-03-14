import React from 'react'

const SahriCard = ({text,time}) => {

    return (
        <div className=''>
  <h2 className="title-header text-center pt-56 ">{text}</h2>
            <div className="digitalClock  ">
                <div className="timer">
                    <div className="time">TIME

                    </div>
                    <div id="hours" className="t">
                        {time?.hours}<br />
                        hours
                    </div>
                    <div className="colon">:</div>
                    <div id="mins" className="t">
                        {time?.minutes} <br />
                        mins
                    </div>
                    <div className="colon">:</div>
                    <div id="secs" className="t">
                        {time?.seconds}<br />
                        secs
                    </div>

                </div>
                <div className="boxOne">
                  
                </div>
                <div className="boxTwo">

                </div>
            </div>
        </div>

    )
}


export default SahriCard