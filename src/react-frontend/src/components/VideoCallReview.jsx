import React, { useState, useEffect } from "react";

import {
  IonPage,
  IonIcon,
  IonButtons,
  IonButton,
  IonTitle,
  IonToolbar,
  IonHeader,
  IonLabel,
  IonInput,
  IonItem,
  IonContent,
} from "@ionic/react";
import { closeOutline, cut, star, starOutline } from "ionicons/icons";
import "./VideoCallReview.css";
import { useStoreState } from "pullstate";
import useFetch from "../hooks/useFetch";

const VideoCallReview = () => {
  const starArray = new Array(5).fill("starOutline");
  const [rating, setRating] = useState(0);
  const [stars, setStars] = useState(0);
  const [firstRender, setFirstRender] = useState(true);
  const { post, loading } = useFetch('https://callingserver.onrender.com/api/v1/');
  const auth_token = localStorage.getItem("auth_token");
  const [consultEaseUserId, setConsultEaseUserId] = useState("");

  if (firstRender) {
    for (let i = 0; i < 5; i++) {
      starArray[i] = "starOutline";
    }
  } else {
    for (let i = 0; i < 5; i++) {
      if (stars >= i) starArray[i] = "star";
      else starArray[i] = "starOutline";
    }
  }

  consultEaseUserId &&
    setConsultEaseUserId(() => localStorage.getItem("consultEaseUserId"));

  function handleSubmitReview() {
    console.log(consultEaseUserId);
    post(
      `call/rate?from_user=${consultEaseUserId}&to_user={}&call_id=" "&stars=${rating}`,
      {
        auth_token: auth_token,
      }
    ).then((data) => {
      console.log(data);
      // setInbox(data.body);
      // setInbox([...inbox, data.body.data]);
      // setInbox(inbox.concat(data.body.data));
      // setPage({
      //   pageNumber: data.body.pageNumber,
      //   pageCount: data.body.pageCount,
      //   recordCount: data.body.recordCount,
      // });
      // console.log(
      //   data.body,
      //   "consultEaseUserId",
      //   consultEaseUserId,
      //   data.body.pageCount
      // );
    });
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar></IonToolbar>
      </IonHeader>
      <div className="videoCallReview">
        <h3>
          Please take a moment to provide the call feedback, <br />
          Thank You.
        </h3>
        <div className="reviewStars">
          {starArray.map((value, index, array) => {
            return value === "starOutline" ? (
              <IonIcon
                key={index}
                icon={starOutline}
                color="primary"
                size="large"
                onClick={() => {
                  setStars((preState) => index);
                  console.log(index + 1);
                  setRating(index + 1);
                  setFirstRender(false);
                }}
              ></IonIcon>
            ) : (
              <IonIcon
                key={index}
                icon={star}
                color="primary"
                size="large"
                onClick={() => {
                  setStars((preState) => index);
                  console.log(index + 1);
                  setRating(index + 1);
                  setFirstRender(false);
                }}
              ></IonIcon>
            );
          })}
        </div>
        <IonItem className="feedbackBox">
          <IonLabel position="floating">Enter Feedback here</IonLabel>
          <IonInput placeholder="Enter text" inputMode="text"></IonInput>
        </IonItem>
        <div className="submitButtons">
          <IonButton href="/profile" color="light">
            <IonLabel>Close</IonLabel>
          </IonButton>
          <IonButton
            onclick={() => {
              handleSubmitReview();
            }}
            href="/profile"
          >
            <IonLabel>Done</IonLabel>
          </IonButton>
        </div>
      </div>
    </IonPage>
  );
};

export default VideoCallReview;