import {IonSearchbar,  IonLabel, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonText, IonTitle, IonToolbar,
  useIonViewWillEnter, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonItem, useIonViewDidEnter, useIonViewDidLeave
 } from '@ionic/react';
 import './Profile.css';
 import { Header } from "../components/Header";
import React,{ useEffect, useRef, useState } from 'react';
import useFetch from '../hooks/useFetch';

import { useRouteMatch,useParams , useLocation} from 'react-router-dom';


const Profile = () => {
  const pageRef = useRef();
  const auth_token=localStorage.getItem("auth_token");
  const {get,loading}=useFetch("http://localhost:5151/api/v1/");
  const [profile,setProfile]=useState([]);

  const params = useParams();
  const match =useRouteMatch();
  const location = useLocation();
  const [isVisible,setIsVisible]=useState(true);

  const [counter,setCounter]=useState(0);


  console.log("param.id - ",{counter, id:params.id,time:new Date()});


  useEffect(()=>{
    setCounter(counter+1);

    console.log("Hello",counter);

    get("user/"+params.id,{"auth_token":auth_token})
    .then(data=>{
        console.log(data);
        setProfile(data.body);
    })

  },[])

  useIonViewDidEnter(()=>{
    setIsVisible(true);
  });
  useIonViewDidLeave(()=>{
    setIsVisible(false);
  });

  
  

  if (!isVisible) return null;
  

  return (
    <IonPage ref={ pageRef }>
      <IonContent fullscreen className='ion-padding'>

        <IonGrid className="ion-padding-start ion-padding-end extra-padding ion-padding-bottom ion-margin-bottom">
         
          <IonRow>
            <IonCol size="12">
                   
            {profile.fname} 
            {profile.lname}

            </IonCol>

          </IonRow>

         
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default  Profile;
