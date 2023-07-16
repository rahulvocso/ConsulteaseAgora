import { useRef, useState, useEffect } from "react";
import {
  IonGrid,
  IonCol,
  IonRow,
  IonIcon,
  IonContent,
  IonTitle,
  IonToolbar,
  IonButtons,
  IonButton,
  IonLabel,
  IonModal,
  IonDatetime,
  useIonToast,
} from "@ionic/react";
import { closeOutline, alertOutline } from "ionicons/icons";
import "./TimePicker.css";

const TimePicker = ({ setTimePicker, timePicker, handleAddSlot }) => {
  let timeSlotTemp = { from: "09:00:00", to: "10:00:00" };
  const modal = useRef(null);
  const [InvalidTimeScheduleToast] = useIonToast();
  const scheduleToTimeRef = useRef(null);
  const scheduleFromTimeRef = useRef(null);

  const [timeSlot, setTimeSlot] = useState({
    from: "00:00:00",
    to: "00:00:00",
  });

  function handleTimeSlotChange(ev, type) {
    console.log(ev.target.value, " -handleTimeSlotChange- ", type);
    let dt;
    type === "from" && scheduleFromTimeRef.current.confirm();
    type === "to" && scheduleToTimeRef.current.confirm();

    type === "to" &&
      (dt = new Date(ev.target.value).toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
        minute: "numeric",
      }));

    type === "from" &&
      (dt = new Date(ev.target.value).toLocaleString("en-US", {
        hour: "numeric",
        hour12: true,
        minute: "numeric",
      }));

    setTimeSlot(() => ({ ...timeSlot, [type]: dt }));
    console.log("timeSlot", timeSlot);
  }

  function handleSaveTimeSlot() {
    scheduleToTimeRef.current?.confirm();
    scheduleFromTimeRef.current?.confirm();

    let toTemp = new Date(scheduleToTimeRef.current?.value).toLocaleString(
      "en-US",
      { hour: "numeric", hour12: true, minute: "numeric" }
    );
    let fromTemp = new Date(scheduleFromTimeRef.current?.value).toLocaleString(
      "en-US",
      { hour: "numeric", hour12: true, minute: "numeric" }
    );

    //Invalid time handling starts
    let timeFrom24 = fromTemp.split(/[ :]/);
    let timeTo24 = toTemp.split(/[ :]/); //now timeTO24 = something like ["2","56","PM"]

    timeFrom24[2] === "AM" && timeFrom24[0] === "12" && (timeFrom24[0] = 0);
    timeTo24[2] === "AM" && timeTo24[0] === "12" && (timeTo24[0] = 0);

    timeFrom24[2] === "PM" &&
      timeFrom24[0] != "12" &&
      (timeFrom24[0] = `${parseInt(timeFrom24[0]) + 12}`);
    timeTo24[2] === "PM" &&
      timeTo24[0] != "12" &&
      (timeTo24[0] = `${parseInt(timeTo24[0]) + 12}`);

    if (
      (timeTo24[0] === timeFrom24[0] && timeTo24[1] - timeFrom24[1] >= 30) ||
      (timeTo24[0] - timeFrom24[0] === 1 &&
        60 + Number(timeTo24[1]) - Number(timeFrom24[1]) >= 30) ||
      timeTo24[0] - timeFrom24[0] > 1
    ) {
      setTimeSlot(() => {
        return {
          from: fromTemp,
          to: toTemp,
        };
      });
      setTimeSlot((timeSlot) => {
        timeSlotTemp.from = timeSlot.from;
        timeSlotTemp.to = timeSlot.to;
        return { ...timeSlot };
      });
      handleAddSlot(timeSlotTemp);
    } else {
      InvalidTimeScheduleToast({
        message: `INVALID Time Schedule <br/> Do: Please select schedule between(12:00AM - 11:59PM) & gap >= 30 minutes.<br/> Don't: FROM(PM) & TO(AM)`,
        duration: 5000,
        position: "top",
        cssClass: "custom-toast",
        buttons: [
          {
            text: "Dismiss",
            role: "cancel",
          },
        ],
      });
    }
    console.log(timeFrom24[0], timeTo24[0]);
    //Invalid time handling ends
  }

  function dismiss(e) {
    setTimePicker({ ...timePicker, visible: false });
  }

  //useEffect(() => {}, [timeSlot]);

  return (
    <IonModal
      ref={modal}
      keepContentsMounted={true}
      showBackdrop="true"
      backdropDismiss="true"
      initialBreakpoint={1.0}
      breakpoints={[1.0]}
      isOpen={timePicker.visible}
      onDidDismiss={() => setTimePicker({ ...timePicker, visible: false })}
    >
      <IonContent className="timePickerModalContent">
        <IonToolbar>
          <IonTitle>Pick time slot</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={(e) => dismiss(e)}>
              <IonIcon icon={closeOutline} size="large"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>

        <IonGrid className="timePicker-Grid">
          <IonRow>
            <IonCol>
              <IonLabel>From </IonLabel>
              <IonDatetime
                ref={scheduleFromTimeRef}
                size="small"
                hourCycle="h12"
                presentation="time"
                key="from"
                showDefaultTitle={true}
                onIonChange={(ev) => handleTimeSlotChange(ev, "from")}
              ></IonDatetime>
            </IonCol>
            <IonCol>
              <IonLabel>To</IonLabel>
              <IonDatetime
                ref={scheduleToTimeRef}
                size="small"
                hourCycle="h12"
                presentation="time"
                key="to"
                showDefaultTitle={true}
                onIonChange={(ev) => handleTimeSlotChange(ev, "to")}
              ></IonDatetime>
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol>
              <IonButton
                onClick={() => {
                  handleSaveTimeSlot();
                  setTimePicker({ ...timePicker, visible: false });
                }}
              >
                <IonLabel>Save Time Slot</IonLabel>
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonModal>
  );
};

export default TimePicker;
