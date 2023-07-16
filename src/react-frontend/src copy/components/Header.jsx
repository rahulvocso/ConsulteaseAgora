import { IonHeader,IonToolbar,IonTitle,IonButtons,IonButton, IonLabel, IonIcon, IonModal, IonNote, IonRow, useIonModal } from "@ionic/react";
import { useEffect, useState } from "react";
import { walletOutline } from 'ionicons/icons';
import styles from "./Header.css";

export const Header = ({ profile, pageRef }) => {

   

	return (
    <>
  <IonHeader>
        <IonToolbar>
          <IonTitle>ConsultEase</IonTitle>

          <IonButtons slot="end">
            <IonButton>
              <IonLabel>₹4,500</IonLabel>
              <IonIcon icon={ walletOutline } />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

    </>
	);
}