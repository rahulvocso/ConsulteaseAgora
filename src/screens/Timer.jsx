import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';

const Timer = ( {timerLimit, callId = 'not available'} ) => {
  const [timeRemaining, setTimeRemaining] = useState(timerLimit);
  const [timePassedHrMinSec, setTimePassedHrMinSec] = useState({ hr: 0, min: 0, sec: 0 });
  const [timeRemainingHrMinSec, setTimeRemainingHrMinSec] = useState({ hr: 0, min: 0, sec: 0 });

  const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
  const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;


  useEffect(() => {
    const timerInterval = setInterval(() => {
      setTimeRemaining(prevTime => prevTime - 1);
    }, 1000);

    return () => {
      clearInterval(timerInterval);
    };
  }, []);

  useEffect(() => {
    const totalSecondsPassed = timerLimit - timeRemaining;

    setTimePassedHrMinSec({
      hr: Math.floor(totalSecondsPassed / (60 * 60)),
      min: Math.floor((totalSecondsPassed - (Math.floor(totalSecondsPassed / (60 * 60)) * 60 * 60)) / 60),
      sec: totalSecondsPassed % 60
    });

    setTimeRemainingHrMinSec({
      hr: Math.floor(timeRemaining / (60 * 60)),
      min: Math.floor((timeRemaining - (Math.floor(timeRemaining / (60 * 60)) * 60 * 60)) / 60),
      sec: timeRemaining % 60
    });
  }, [timerLimit, timeRemaining]);


  const formatTime = (time) => {
    return time < 10 ? `0${time}` : time;   // add zero in front if value is less than 10
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap', 
      justifyContent: 'space-around',
      alignContent: 'center',
      backgroundColor: '#ffffff1a',
      // backgroundColor: '#3DB271', //'#3DB2717F',
      width: deviceWidth,
      height: deviceHeight / 25,
      position: 'absolute',
      top: 0,
      margin: 0,
      borderRadius: 25,
    },
    topProgressBarText: {
        // paddingTop: 2,
        // paddingBottom: 2,
        // color: '#3DB271',
        alignSelf: 'center',
        color: '#fff',
      },
  })

  return (
  <View style={styles.container}>
    <Text style={styles.topProgressBarText}>
      {`${formatTime(timePassedHrMinSec.hr)}:${formatTime(timePassedHrMinSec.min)}:${formatTime(timePassedHrMinSec.sec)} passed`}
    </Text>
    
    <Text style={styles.topProgressBarText}>#{callId}</Text>

    {
      timeRemaining <= 300 &&  // time remaining will be shown only when time left <=300 seconds i.e 5 mins.
      <Text style={styles.topProgressBarText}>
        {`${formatTime(timeRemainingHrMinSec.hr)}:${formatTime(timeRemainingHrMinSec.min)}:${formatTime(timeRemainingHrMinSec.sec)} remaining`}
      </Text>
    }
      
  </View>
  )
};


export default Timer;







// import React from 'react';

// const Timer = () => {
//     const timer_limit = 36000; // set the time limit in seconds
//     let time_passed = 3595;
//     let time_remaining = timer_limit;
//     const timePassedHrMinSec = {hr: '', min: '', sec: ''}
//     const timeRemainingHrMinSec = {hr: '', min: '', sec: ''}

//     const startTimer = () => {
//     const timerInterval = setInterval(() => {
//         time_passed++;
//         time_remaining--;
//         // console.log(`Time passed: ${time_passed}s, Time remaining: ${time_remaining}s`);

//         timePassedHrMinSec.hr = Math.floor(time_passed/(60*60));
//         timePassedHrMinSec.min = Math.floor((time_passed - (timePassedHrMinSec.hr*60*60))/60);
//         timePassedHrMinSec.sec = time_passed - (timePassedHrMinSec.hr*3600 + timePassedHrMinSec.min*60);

//         timeRemainingHrMinSec.hr = Math.floor(time_remaining/(60*60));
//         timeRemainingHrMinSec.min = Math.floor((time_remaining - (timeRemainingHrMinSec.hr*60*60))/60);
//         timeRemainingHrMinSec.sec = time_remaining - (timeRemainingHrMinSec.hr*3600 + timeRemainingHrMinSec.min*60);

//         if (time_remaining <= 0) {
//         clearInterval(timerInterval);
//         console.log('Time is up!');  
//         }   console.log(`Time passed hr:${ timePassedHrMinSec.hr} min:${ timePassedHrMinSec.min} sec:${ timePassedHrMinSec.sec}s, Time remaining hr:${ timeRemainingHrMinSec.hr} min:${ timeRemainingHrMinSec.min} sec:${ timeRemainingHrMinSec.sec}s`);
//     }, 1000);

//     };

//     startTimer();

//     return (
//         {'timePassedHrMinSec': timePassedHrMinSec, 'timeRemainingHrMinSec':timeRemainingHrMinSec}
//     )

        // return (
        //     <>
        //     <Text style={styles.topProgressBarText}>{`${timeRemainingHrMinSec.hr}:${timeRemainingHrMinSec.min}:${timeRemainingHrMinSec.sec} remaining`}</Text>
        //     <Text style={styles.topProgressBarText}>{`${timePassedHrMinSec.hr}:${timePassedHrMinSec.min}:${timePassedHrMinSec.sec} passed`}</Text>
        //     <Text style={styles.topProgressBarText}>CallId</Text>
        //     </>
        //     )
// }

// export default Timer;






