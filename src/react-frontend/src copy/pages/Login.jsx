import { IonModal,IonBackdrop,IonButton, IonContent, IonHeader, IonPage, IonRouterLink, IonTitle, IonToolbar } from '@ionic/react';
import { IonImg,IonItem,IonLabel,IonInput, IonRow,IonCol,IonIcon} from '@ionic/react';
import appLogo from '../theme/assets/app-logo.svg';
import security_c from '../theme/assets/security.svg';

import React, {Link, useState } from 'react';
import Home from './Home';
import {useHistory} from "react-router-dom"; 
import OTPModal from "../components/OTPModal";

 
import './Login.css';

const Login = () => {

  const [mobile,setMobile] =useState("");

  const [otpModalVisible, setOtpModalVisible]=useState(false);

  const handleOTPModal=()=>{
    setOtpModalVisible(!otpModalVisible);
  };

 

  return (
     <IonPage >
      <IonContent>
        <IonRow>
          <IonCol className="login-box">
              <IonImg className="app-logo" src={appLogo} />

              <h3 >Welcome to<br/>ConsultEase</h3>

              <IonItem>
                <IonLabel position="floating"> 
                {localStorage.getItem("auth_token")}
                Enter mobile number (without +91)</IonLabel>
                 <IonInput
                 onIonChange={(event)=>setMobile(event.target.value)} 
                  maxLength={10}
                  type="number"
                  placeholder={mobile} 
                  >
                </IonInput>

              </IonItem>
              <a href="/home">Home</a>
               <IonButton expand="block" onClick={handleOTPModal}  color="dark">
                <IonIcon slot="start" icon={security_c}></IonIcon>Continue Securely</IonButton>


              <IonLabel>
              By continuing, I accept the <IonRouterLink href="#">terms & conditions</IonRouterLink>
              </IonLabel>

          </IonCol>
        </IonRow>
      </IonContent>

      <OTPModal mobile={mobile} modalVisible={otpModalVisible}  />

    </IonPage>

      

     
  );
};

export default Login;
