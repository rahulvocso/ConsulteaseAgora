import React, { useEffect, useRef } from "react";

// Swiper slides start
import {
  IonButton,
  IonButtons,
  IonContent,
  IonicSlides,
  IonPage,
  IonLabel,
  IonRouterLink,
  IonItem,
} from "@ionic/react";
import { Swiper, SwiperSlide, useSwiper } from "swiper/react";
import {
  Autoplay,
  //Keyboard,
  Pagination,
  Navigation,
  Scrollbar,
  EffectFade,
} from "swiper";
//./react/swiper-react.js

import "swiper/swiper.min.css";
import "swiper/modules/navigation/navigation.min.css";
import "swiper/modules/autoplay/autoplay.min.css";
import "swiper/modules/keyboard/keyboard.min.css";
import "swiper/modules/pagination/pagination.min.css";
import "swiper/modules/scrollbar/scrollbar.min.css";
import "swiper/modules/zoom/zoom.min.css";
import "@ionic/react/css/ionic-swiper.css";
//Swiper slides end

import { IonImg, IonIcon } from "@ionic/react";

import "./PreviewSlides.css";
import appLogo from "../theme/assets/app-logo.svg";
import splashScreen1 from "../theme/assets/splashScreen1.png";
import splashScreen3 from "../theme/assets/splashScreen3.png";
import {
  phoneLandscapeOutline,
  phonePortrait,
  phonePortraitSharp,
} from "ionicons/icons";

const PreviewSlides = () => {
  const swiper = useSwiper();
  const nonSlideElementsRef = useRef(null);
  const sS1Ref = useRef(null);

  function handleFirstSlide() {
    nonSlideElementsRef.current.display = "none";
    document.querySelector(".sS1").style.height = "100vh";
  }

  useEffect(() => {
    if (sS1Ref.current.display != "none") {
      nonSlideElementsRef.current.display = "none";
      console.log(nonSlideElementsRef.current.display);
    }
  }, [sS1Ref]);
  return (
    <IonPage>
      <IonContent className="swiperContainer ion-text-justify">
        <Swiper
          className="isSwiper"
          modules={[
            EffectFade,
            IonicSlides,
            //Keyboard,
            Pagination,
            Scrollbar,
            //Zoom,
            Navigation,
            IonicSlides,
          ]}
          autoplay={{ delay: 500 }}
          keyboard={true}
          pagination
          zoom={true}
          loop
        >
          <SwiperSlide ref={sS1Ref} className="swiperSlide sS1">
            {/*<IonImg src={splashScreen1} />*/}
            <IonImg src={appLogo} />
          </SwiperSlide>
          <SwiperSlide className="swiperSlide sS2">
            <IonImg src={appLogo} />
          </SwiperSlide>
          <SwiperSlide className="swiperSlide sS3">
            <IonImg className="app-logo" src={appLogo} />
            <h2>
              Professional <br />
              advice on the go
            </h2>
            <IonImg
              className="sampleImgPreviewScreen3"
              src={splashScreen3}
            ></IonImg>
          </SwiperSlide>
        </Swiper>
        <div
          ref={nonSlideElementsRef}
          className="nonSlide-elements ion-text-center ion-flex-direction-column"
        >
          <IonButton className="continue-btn" color="dark" href="/login">
            <IonIcon slot="start" color="light" icon={phonePortraitSharp} />{" "}
            <IonLabel>Continue with phone</IonLabel>
          </IonButton>
          <IonLabel className="">
            By continuing, I accept the{" "}
            <IonRouterLink href="#">terms & conditions</IonRouterLink>
            <br />
            &copy; ConsultEase.com 2022
          </IonLabel>
        </div>
      </IonContent>
    </IonPage>
  );
};

export default PreviewSlides;
