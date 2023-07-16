import {  useEffect, useState } from "react";
import {IonToggle,IonLabel,IonCard,IonCardContent,IonCardHeader,IonCardTitle,IonCardSubtitle,useIonToast} from '@ionic/react';
import {IonRow,IonCol,IonContent} from '@ionic/react';
import useFetch from "../hooks/useFetch";
import {checkmarkCircleOutline,warningOutline } from 'ionicons/icons';

export const VacationMode = ({ profile }) => {
  const [vacationMode, setVacationMode]=useState(false);
  const [overrideSchedule, setOverrideSchedule]=useState(false);
  const [alwaysOnMode, setAlwaysOnMode]=useState(false);

  const [presentToast]=useIonToast();

  const {get,post,loading}=useFetch("http://localhost:5151/api/v1/");

  useEffect(() =>{
      get("user/",{"auth_token":localStorage.getItem("auth_token")})
      .then(data=>{
        setVacationMode(data.body.profile.vacation);
        setOverrideSchedule(data.body.profile.overrideSchedule);
        setAlwaysOnMode(data.body.profile.alwaysAvailable);
      })
  },[]);
// for updating 
  // vacation 
  // call me anytime settings...
  const handleModeUpdate=(e)=>{

    if (e.target.field=="profile.vacation")
     setVacationMode(e.target.checked);
    else if (e.target.field=="profile.overrideSchedule")
      setOverrideSchedule(e.target.checked);

     else if (e.target.field=="profile.alwaysAvailable")
     setAlwaysOnMode(e.target.checked);


   console.log("Key ",e.target.field,e.target.checked);
   post("user/updateUserMeta",
   {
     key:e.target.field,
     value:e.target.checked,
   },
   {"auth_token":localStorage.getItem("auth_token")})
 .then(data=>{
     //console.log(data);
     if(data.status==200)
       presentToast({
         message:data.message,
         icon:checkmarkCircleOutline,
         tramslucent:true,
         duration:2000,
         color:"primary"
       });
     else
     presentToast({
       message:data.message,
       duration: 4000,
       icon:warningOutline,
       color: "danger"
     });
     
 })

 } 

	return (
    <div  className="availabilityMode">
      <IonCard color={alwaysOnMode ? "":"light"}>   
            <IonCardHeader>


            <IonRow>
              <IonCol className="widecol">
                <IonCardTitle>
                   {alwaysOnMode ? "Available for calls" : "Not available for calls" }
                </IonCardTitle>
              </IonCol>
              <IonCol>             
                <IonToggle  checked={alwaysOnMode} onIonChange={(e)=>handleModeUpdate(e)} key="alwaysAvailable" field="profile.alwaysAvailable" />
</IonCol>
            </IonRow>

            <IonRow>
              <IonCol  className="widecol">
                <IonCardTitle>
                {overrideSchedule ? "Overrides my schedule" : "Do not override schedule" }
                </IonCardTitle>
              </IonCol>
              <IonCol>             
              <IonToggle   checked={overrideSchedule} onIonChange={(e)=>handleModeUpdate(e)} key="overrideSchedule" field="profile.overrideSchedule" />
</IonCol>
            </IonRow>
                
            </IonCardHeader>
            
            <IonCardContent  >


            {
              !alwaysOnMode && !overrideSchedule &&  
              <IonLabel>Choose this if you are not available to take calls. 
              </IonLabel>
              }
              {
              alwaysOnMode && overrideSchedule &&  
              <IonLabel>You won't get any calls. Switch it back when you're ready to take calls.
              </IonLabel>
              }

            </IonCardContent>

      </IonCard>
    </div>
	);
}