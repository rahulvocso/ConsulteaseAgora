import {IonSearchbar,  IonLabel, IonButton, IonButtons, IonCol, IonContent, IonGrid, IonHeader, IonIcon, IonPage, IonRow, IonText, IonTitle, IonToolbar,
  useIonViewWillEnter, IonInfiniteScroll, IonInfiniteScrollContent, IonList, IonItem
 } from '@ionic/react';
import { personOutline,walletOutline } from 'ionicons/icons';
import { useStoreState } from 'pullstate';
import { TalkStore } from '../store';
import { getTalks } from '../store/Selectors';
import './Home.css';

import { Header } from "../components/Header";
import { ProCard } from "../components/ProCard";
import { ProCardImportant } from "../components/ProCardImportant";
import React, { useEffect, useRef, useState } from 'react';
import useFetch from '../hooks/useFetch';

const Home = React.memo(() => {

  const pageRef = useRef();
  const auth_token=localStorage.getItem("auth_token");
  const {get,loading}=useFetch("http://localhost:5151/api/v1/");
  const [profiles,setProfiles]=useState([]);
  const [page, setPage] = useState({pageNumber:0});
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  

  console.log("render- ",{time:new Date()});


  const getData = () => {
    get(`user/list?pageNumber=${parseInt(page.pageNumber)+1}&sort=stats.rating_average&sort_type=1`,{"auth_token":auth_token})
    .then(data=>{
     //   console.log(data);
        setProfiles([
          ...profiles,
          ...data.body.data
        ]);
        setPage({pageNumber:data.body.pageNumber,pageCount:data.body.pageCount,recordCount:data.body.recordCount});
    })
//    console.log("Page Data",page);
    
    
  }
  const loadData = (ev) => {
    
      getData();
      ev.target.complete();
      if (page.pageNumber ===page.pageCount ) {
        setInfiniteDisabled(true);
      }
  }  
  useIonViewWillEnter((ev) => {
      getData();
  });


 
  return (
    <IonPage ref={ pageRef }>
      <Header/>
      <IonContent fullscreen>
      <IonSearchbar animated placeholder="Search people to talk to..."></IonSearchbar>

        <IonGrid className="ion-padding-start ion-padding-end extra-padding ion-padding-bottom ion-margin-bottom">
         
          <IonRow>
            <IonCol size="12">
                  <IonInfiniteScroll
                    onIonInfinite={loadData}
                    threshold="100px"
                    disabled={isInfiniteDisabled}
                    >
                    <IonInfiniteScrollContent
                      loadingSpinner="bubbles"
                      loadingText="Loading more data..."
                      >
                    </IonInfiniteScrollContent>
                  </IonInfiniteScroll>

                 
                  {profiles.map((profile, _id) => {
                  return (
                    <ProCard key={ _id } profile={ profile } pageRef={ pageRef } />
                  )
                  })}
                

            </IonCol>

          </IonRow>

         
        </IonGrid>
      </IonContent>
    </IonPage>
  );
},() => true);

export default Home;
