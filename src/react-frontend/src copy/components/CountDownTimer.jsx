import { useState ,useEffect} from "react";

const CountDownTimer = ({time,running,setRunning},props) => {
   
    const { hours = 0, minutes = 0, seconds = 60 } = time;
    const [[hrs, mins, secs], setTime] = useState([hours, minutes, seconds]);

    const tick = () => {
        
        setRunning(true);

        if (hrs === 0 && mins === 0 && secs === 0) {
            stop()
            setRunning(false);
        }
            
        else if (mins === 0 && secs === 0) {
            setTime([hrs - 1, 59, 59]);
        } else if (secs === 0) {
            setTime([hrs, mins - 1, 59]);
        } else {
            setTime([hrs, mins, secs - 1]);
        }
    };


    const reset = () => setTime([parseInt(hours), parseInt(minutes), parseInt(seconds)]);
    const stop = () => setTime([0,0,0]);

    
     useEffect(() => {
        //if (flag)
        {
            const timerId = setInterval(() => tick(), 1000);
            return () => clearInterval(timerId);
        }
    });

    
    return (
        <div>
            { running && 
                 
                 `${hrs.toString().padStart(2, '0')}:
                 ${mins.toString().padStart(2, '0')}:
                 ${secs.toString().padStart(2, '0')}` 
                }
        </div>
    );
}

export default CountDownTimer;