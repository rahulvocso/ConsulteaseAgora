import { useState, useEffect } from "react";
import {
  IonButtons,
  IonList,
  IonIcon,
  IonToggle,
  IonButton,
  IonItem,
  IonLabel,
} from "@ionic/react";
import {
  IonDatetime,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from "@ionic/react";
import { closeOutline, addCircleOutline, addOutline } from "ionicons/icons";
import styles from "./DayCard.css";

const DayCard = ({
  day,
  daykey,
  handleSetDayAvailable,
  handleShowTimePicker,
  handleDeleteSlot,
}) => {
  const handleCardVisible = (e) => {
    handleSetDayAvailable(e, day, daykey);
  };

  return (
    <IonCard key={day.code} className="dayCard">
      <IonCardHeader>
        <IonToggle
          checked={day.isAvailable}
          onClick={(e) => handleCardVisible(e)}
        />

        <IonCardSubtitle>
          {day.name}
          {!day.isAvailable && <IonLabel color="medium"> / Off </IonLabel>}
        </IonCardSubtitle>
      </IonCardHeader>
      {day.isAvailable && (
        <IonCardContent>
          <IonList>
            {day.slots &&
              day.slots.map((slot, key) => (
                <IonItem key={key}>
                  <IonLabel>
                    {slot.from} to {slot.to}{" "}
                  </IonLabel>
                  {day.slots.length > 1 && (
                    <IonIcon
                      onClick={(e) => handleDeleteSlot(e, day.code, key)}
                      icon={closeOutline}
                    ></IonIcon>
                  )}
                </IonItem>
              ))}

            {day.slots && day.slots.length < 3 && (
              <IonButtons>
                <IonButton
                  color="primary"
                  onClick={(e) => handleShowTimePicker(e, day, daykey)}
                  size="small"
                  disabled={!day.isAvailable}
                >
                  <IonIcon icon={addOutline}></IonIcon>
                  <IonLabel>Add time slot</IonLabel>
                </IonButton>
              </IonButtons>
            )}
          </IonList>
        </IonCardContent>
      )}
    </IonCard>
  );
};

export default DayCard;
