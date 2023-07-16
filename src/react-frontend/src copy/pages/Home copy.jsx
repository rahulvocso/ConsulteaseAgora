import {IonSearchbar,  IonLabel, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonText, IonTitle, IonToolbar } from '@ionic/react';
import { personOutline,walletOutline } from 'ionicons/icons';
import { useStoreState } from 'pullstate';
import { TalkStore } from '../store';
import { getTalks } from '../store/Selectors';
import './Home.css';

import { ProCard } from "../components/ProCard";
import { useEffect, useRef } from 'react';
import useFetch from '../hooks/useFetch';

const Home = () => {

  const pageRef = useRef();
  const talks = useStoreState(TalkStore, getTalks);
  const {get,loading}=useFetch("http://localhost:5151/api/v1/");
  const auth_token=localStorage.getItem("auth_token");

  useEffect(()=>{
    console.log("authtoken header",{"auth_token":auth_token});
    get("user/listProfiles",{"auth_token":auth_token})
    .then(data=>{
        console.log(data);
    })

  },[])


  return (
    <IonPage ref={ pageRef }>
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
      <IonContent fullscreen>

      <IonSearchbar animated placeholder="Search people to talk to..."></IonSearchbar>

        <IonGrid className="ion-padding-start ion-padding-end extra-padding ion-padding-bottom ion-margin-bottom">
         
          <IonRow>
            <IonCol size="12">
              <ProCard upcoming={ true } talk={ talks[0] } pageRef={ pageRef } />
            </IonCol>
          </IonRow>

          

          <IonRow>
            <IonCol size="12">
              { talks.map((talk, talkIndex) => {

                return talkIndex > 0 && <ProCard key={ talkIndex } talk={ talk } pageRef={ pageRef } />;
              })}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
