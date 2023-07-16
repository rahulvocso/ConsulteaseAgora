import React, {useState, useEffect} from 'react';
import {
  IonContent,
  IonList,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonCard,
  IonCardSubtitle,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  IonButton,
} from '@ionic/react';

import './VideoCall.css';

const CallPrompt = ({callCategoryName, setCallCategoryName}) => {
  let profile = JSON.parse(localStorage.getItem('currentProfileInView'));

  return (
    <div className="callCategory">
      <IonCardSubtitle color={callCategoryName && 'primary'}>
        Please select call category:
      </IonCardSubtitle>

      <IonRadioGroup
        value={callCategoryName}
        onIonChange={e => (callCategoryName.current = e.target.value)}
        //onIonChange={(e) => setCallCategoryName(e.target.value)}
        allowEmptySelection={true}>
        {profile.profile.categories.map((category, index) => (
          <IonItem key={`${category.name}${index}`}>
            <IonLabel>{category.name}</IonLabel>
            <IonRadio
              slot="end"
              value={category.name}
              disabled={false}></IonRadio>
          </IonItem>
        ))}
      </IonRadioGroup>
    </div>
  );
};

export default CallPrompt;
