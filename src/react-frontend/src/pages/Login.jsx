import {
  IonModal,
  IonBackdrop,
  IonButton,
  IonContent,
  IonHeader,
  IonPage,
  IonRouterLink,
  IonTitle,
  IonToolbar,
  IonRefresher,
  IonRefresherContent,
} from "@ionic/react";
import {
  IonImg,
  IonItem,
  IonLabel,
  IonInput,
  IonRow,
  IonCol,
  IonIcon,
} from "@ionic/react";
import appLogo from "../theme/assets/app-logo.svg";
import security_c from "../theme/assets/security.svg";

import React, { Link, useEffect, useState } from "react";
import Home from "./Home";
import { useHistory } from "react-router-dom";
import OTPModal from "../components/OTPModal";
import PreviewSlides from "./PreviewSlides";

import "./Login.css";
import { home, partlySunnySharp, roseOutline } from "ionicons/icons";

const Login = ({ hideTabBar }) => {
  const [mobile, setMobile] = useState("");

  const history = useHistory();

  const [otpModalVisible, setOtpModalVisible] = useState(false);

  const handleOTPModal = () => {
    setOtpModalVisible(!otpModalVisible);
  };

  

  return (
    <IonPage>
      <IonContent className="loginIonContent">
        {/* <IonRefresher slot="fixed" ionRefresh={handleRefresh(e)}>
        <IonRefresherContent
                pullingIcon="chevron-down-circle-outline"
                pullingText="Pull to refresh"
                refreshingSpinner="circles"
                refreshingText="Refreshing...">
              </IonRefresherContent>
        </IonRefresher> */}
        <IonRow>
          <IonCol className="login-box">
            <IonImg className="app-logo" src={appLogo} />
            <h3>
              Welcome to
              <br />
              ConsultEase
            </h3>
            <IonItem>
              <IonLabel position="floating">
                Enter mobile number (without +91)
              </IonLabel>
              <IonInput
                onIonChange={(event) => setMobile(event.target.value)}
                maxLength={10}
                type="number"
                placeholder={mobile}
              ></IonInput>
            </IonItem>
            <IonButton expand="block" onClick={handleOTPModal} color="dark">
              <IonIcon slot="start" icon={security_c}></IonIcon>Continue
              Securely
            </IonButton>

            <IonLabel>
              By continuing, I accept the{" "}
              <IonRouterLink href="#">terms & conditions</IonRouterLink>
            </IonLabel>

            {/* <IonButton
              expand="block"
              onClick={() => {
                history.push("/home");
              }}
              color="dark"
            >
              <IonIcon slot="start" icon={home}></IonIcon>
              /home(temporary)
            </IonButton> */}
          </IonCol>
        </IonRow>
      </IonContent>

      <OTPModal
        mobile={mobile}
        setModalVisible={setOtpModalVisible}
        modalVisible={otpModalVisible}
        handleOTPModal={handleOTPModal}
      />
    </IonPage>
  );
};

export default Login;
