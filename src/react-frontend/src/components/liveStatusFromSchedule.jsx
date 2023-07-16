

const liveStatusFromSchedule = (data, setIsOnline) => {
    let dayToday = new Date().getDay();
    dayToday === 0 ? (dayToday = 6) : (dayToday = dayToday - 1);

    let time = new Date().toLocaleString('en-US', {
      hour: 'numeric',
      hour12: true,
      minute: 'numeric',
    });
    //console.log(time, typeof time);
    let timeCheckOnline = false;
    let slots;
    data.body.profile.schedule[dayToday] &&
      (slots = data.body.profile.schedule[dayToday].slots);

    if (slots !== undefined) {
      for (let i = 0; i < slots.length; i++) {
        // console.log(slots);

        let from = slots[i].from.toLowerCase().split(/[" ":]/); //["Hr","Min","AM/PM"]
        from[2] === 'pm' &&
          from[0] !== '12' &&
          (from[0] = Number(from[0]) + 12); //set 24 hr format
        from[2] === 'am' && from[0] === '12' && (from[0] = 0);

        let to = slots[i].to.toLowerCase().split(/[" ":]/); //["Hr","Min","AM/PM"]
        to[2] === 'pm' && to[0] !== '12' && (to[0] = Number(to[0]) + 12); //set 24 hr format

        let tempTime = time.toLowerCase().split(/[" ":]/); //["Hr","Min","AM/PM"]
        tempTime[2] === 'pm' &&
          tempTime[0] !== '12' &&
          (tempTime[0] = Number(tempTime[0]) + 12); //set 24 hr format
        tempTime[2] === 'am' && tempTime[0] === '12' && (tempTime[0] = 0);
        // console.log(from, to, tempTime);
        if (
          Number(from[0]) < Number(tempTime[0]) &&
          Number(tempTime[0]) < Number(to[0])
          // &&
          // Number(from[1]) <= Number(tempTime[1]) &&
          // Number(tempTime[1]) <= Number(to[1])
        ) {
          timeCheckOnline = true;
        }
        if (
          (Number(from[0]) === Number(tempTime[0]) &&
            Number(from[1]) <= Number(tempTime[1])) ||
          (Number(tempTime[0]) === Number(to[0]) &&
            Number(tempTime[1]) <= Number(to[1]))
        ) {
          timeCheckOnline = true;
        }
      }
    }
    //below: check current time and set online status according to schedule
    (data.body.profile.alwaysAvailable && setIsOnline(true)) ||
      (!data.body.profile.vacation &&
        data.body.profile.schedule[dayToday] &&
        data.body.profile.schedule[dayToday].isAvailable &&
        setIsOnline(timeCheckOnline));
  }



  export default liveStatusFromSchedule;