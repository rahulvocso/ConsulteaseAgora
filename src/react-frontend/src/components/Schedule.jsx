import {
  IonToast,
  IonItem,
  IonAvatar,
  IonLabel,
  IonCardSubtitle,
  IonIcon,
  IonModal,
  IonNote,
  IonRow,
  useIonViewWillEnter,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonGrid,
  IonCol,
} from "@ionic/react";
import { call } from "ionicons/icons";

const Schedule = ({ profilebody }) => {
  return (
    <>
      {profilebody &&
        !profilebody.vacation &&
        profilebody.alwaysAvailable == false &&
        profilebody.schedule.map((day, key) => {
          return (
            day.isAvailable && (
              <div key={key}>
                <IonItem detail="false">
                  <IonLabel key={day.code}>
                    <h4>{day.name}</h4>
                    {day.slots &&
                      day.slots.map((slot, key) => (
                        <p key={key}>
                          {slot.from} to {slot.to}
                        </p>
                      ))}
                  </IonLabel>
                </IonItem>
              </div>
            )
          );
        })}
    </>
  );
};

export default Schedule;
