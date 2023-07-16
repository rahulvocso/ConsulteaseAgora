import {useState,useEffect} from 'react';
import "./Timer.css";

const Timer=(props)=> {    

    const calculateTimeLeft = (dt) => {
        const difference =  dt - new Date();
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
              hours: Math.floor(difference / (1000 * 60 * 60)),
              minutes: Math.floor((difference / 1000 / 60) % 60),
              seconds: Math.floor((difference / 1000) % 60),
            };
          }
          //console.log(timeLeft);
          return timeLeft;

    };

    let timeStamp=null;
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const {hours,minutes,seconds}=timeLeft;

    useEffect(() => {
       timeStamp= AddMinutes(props.time);
       setInterval(() => {
        setTimeLeft(calculateTimeLeft(timeStamp));
      }, 1000);
      //clearInterval(timerID);
    },[props.running]);
    

    return (
        <div className='timer'>
        { hours || minutes || seconds ? (
            <div > Resend OTP in <span>{minutes}</span>:<span>{ seconds < 10 ? `0${ seconds }` : seconds } seconds</span>
            </div>
        ) : (
            <div>Time is up</div>
        )
        }
        </div>
    );
  }
export default Timer;


const AddMinutes =  ({minutes=0,seconds=0})=> {
    const dt=new Date();
    console.log("dt",dt);
    return(dt.getTime() + minutes*60000 + seconds*1000);
}