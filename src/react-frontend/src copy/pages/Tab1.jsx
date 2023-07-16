import { setupIonicReact,
  IonButton,
  IonContent, 
  IonHeader,
  IonInfiniteScroll, 
  IonInfiniteScrollContent, 
  IonItem,
  IonLabel,
  IonList,  
  IonPage, 
  IonTitle, 
  IonToolbar,
  useIonViewWillEnter
} from '@ionic/react';
import { useEffect, useState } from 'react';

function Tab1() {

  const [data, setData] = useState([]);
  const [isInfiniteDisabled, setInfiniteDisabled] = useState(false);
  
  const pushData = () => {
    console.log("5")
    const max = data.length + 10;
    const min = max -10;
    const newData = [];
    for (let i = min; i < max; i++) {
      newData.push('Item' + i);
    }
    
    setData([
      ...data,
      ...newData
    ]);
  }
  const loadData = (ev) => {
      console.log("1")
    
      pushData();
      console.log('Loaded data');
      ev.target.complete();
      if (data.length > 1000) {
        setInfiniteDisabled(true);
      }
    
    console.log("2")
  }  
  useEffect(()=>{
    console.log("initial data load");
   // pushData();
  },[]);
  
  useIonViewWillEnter((ev) => {
      console.log("3")
      pushData();
    console.log("4")
  });
  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>dskjsjkdjskd</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
      
        <IonButton onClick={() => setInfiniteDisabled(!isInfiniteDisabled)} expand="block">
          Toggle Infinite Scroll
        </IonButton>

        <IonInfiniteScroll
          onIonInfinite={loadData}
          threshold="90px"
          disabled={isInfiniteDisabled}
        >
          <IonInfiniteScrollContent
            loadingSpinner="bubbles"
            loadingText="Loading more data..."
          ></IonInfiniteScrollContent>
        </IonInfiniteScroll>
        <IonList>aaa
          {data.length}aaa
          {data.map((item, index) => {
            return (
              <IonItem key={index}>
                <IonLabel>{item}</IonLabel>
              </IonItem>
            )
          })}
        </IonList>
        
       
      </IonContent>
    </IonPage>
  );
};
export default Tab1;