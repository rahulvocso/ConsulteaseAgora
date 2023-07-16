import {
  IonImg,
  IonContent,
  IonNote,
  IonPage,
  IonAvatar,
  IonNavLink,
} from "@ionic/react";
import {
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonRow,
  IonCol,
  IonIcon,
  useIonToast,
} from "@ionic/react";
import appLogo from "../theme/assets/app-logo.svg";
import security_c from "../theme/assets/security.svg";

import {
  cameraOutline,
  personOutline,
  callOutline,
  checkmarkCircleOutline,
  warningOutline,
} from "ionicons/icons";

import React, { Link, useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { Header } from "../components/Header";
import useFetch from "../hooks/useFetch";
import Avatar from "react-avatar";
import "./PersonalInfo.css";
import { takePhoto } from "../utils/camera";

const PersonalInfo = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [data, setData] = useState({
    fname: "",
    lname: "",
    photo: "",
    mobile: "",
  });

  const { get, post, loading } = useFetch('https://callingserver.onrender.com/api/v1/');

  useEffect(() => {
    // fetch current personal info
    get("user/", { auth_token: localStorage.getItem("auth_token") }).then(
      (data) => {
        // populate info in form
        setData({
          fname: data.body.fname,
          lname: data.body.lname,
          photo: data.body.photo,
          mobile: data.body.mobile,
        });
      }
    );
  }, []);

  const handleChange = (e) => {
    const newData = { ...data };
    newData[e.target.id] = e.target.value;
    setData(newData);
    //console.log(newData);
  };

  // upload to server and save in db if new image is selected...
  const handlePhotoChange = async (e) => {
    let photo = await takePhoto();
    const newData = { ...data };
    console.log(photo);
    newData["photo"] = photo;
    setData(newData);
    handleUpload(photo);
  };

  // Perform the upload of image
  const handleUpload = (photo) => {
    try {
      const s3URL = post(
        "user/uploadImage",
        {
          image: photo,
          imageName: "",
          type: "jpeg",
        },
        { auth_token: localStorage.getItem("auth_token") }
      ).then((response) => {
        console.log(response);
        const newData = { ...data };
        newData["photo"] = response.imageUrl;
        setData(newData);
      });
    } catch (error) {
      presentToast({
        message: error,
        icon: checkmarkCircleOutline,
        tramslucent: true,
        duration: 2000,
        color: "primary",
      });
    }
  };

  const handleSave = (res) => {
    //console.log("Call the Update User API",localStorage.getItem("auth_token"))

    post(
      "user/updatePersonalInfo",
      { fname: data.fname, lname: data.lname },
      { auth_token: localStorage.getItem("auth_token") }
    ).then((data) => {
      //console.log(data);
      if (data.status == 200)
        presentToast({
          message: data.message,
          icon: checkmarkCircleOutline,
          tramslucent: true,
          duration: 2000,
          color: "primary",
        });
      else
        presentToast({
          message: data.message,
          duration: 4000,
          icon: warningOutline,
          color: "danger",
        });
    });
    history.push("/profile");
  };

  const handleClose = (res) => {
    history.push("/profile");
  };

  return (
    <IonPage>
      <Header
        type="account"
        title="Basic Info"
        handleLeft={handleClose}
        handleRight={handleSave}
      />

      <IonContent>
        <IonRow>
          <IonCol className="personalInfo-form">
            <IonAvatar className="ProfileAvatar">
              <Avatar
                align="center"
                size="100"
                round="100px"
                name={data.fname}
                src={data.photo}
              />
              <IonButton
                onClick={() => handlePhotoChange()}
                shape="round"
                size="small"
                color="light"
              >
                <IonIcon size="small" icon={cameraOutline} />
              </IonButton>
            </IonAvatar>

            <IonNote>
              Note: make sure to enter your name correctly as you're not advised
              to change it later. You may need to produce valid id proof when
              recovering your account.
            </IonNote>

            <IonItem>
              <IonLabel>
                <IonIcon color="dark" size="small" icon={personOutline} />
                First name
              </IonLabel>
              <IonInput
                id="fname"
                value={data.fname}
                onIonChange={(e) => handleChange(e)}
                minlength={3}
                maxLength={30}
                type="text"
              ></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel>
                <IonIcon color="dark" size="small" icon={personOutline} />
                Last name
              </IonLabel>
              <IonInput
                id="lname"
                value={data.lname}
                onIonChange={(e) => handleChange(e)}
                minlength={3}
                maxLength={30}
                type="text"
              ></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel>
                <IonIcon color="dark" size="small" icon={callOutline} />
                Mobile
              </IonLabel>
              <IonInput
                id="mobile"
                value={data.mobile}
                type="number"
                disabled={true}
              ></IonInput>
            </IonItem>
          </IonCol>
        </IonRow>
      </IonContent>
    </IonPage>
  );
};

export default PersonalInfo;
