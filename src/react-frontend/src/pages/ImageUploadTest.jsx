import { IonImg, IonContent,IonNote,   IonPage,  IonAvatar, IonNavLink } from '@ionic/react';
import { IonButton, IonItem,IonLabel,IonInput, IonRow,IonCol,IonIcon,useIonToast} from '@ionic/react';
import appLogo from '../theme/assets/app-logo.svg';
import security_c from '../theme/assets/security.svg';

import React, {Link, useState,useEffect } from 'react';
import {useHistory} from "react-router-dom"; 
import { Header } from "../components/Header";
import useFetch from "../hooks/useFetch";
import Avatar from 'react-avatar'; 
import './PersonalInfo.css';
import {takePhoto} from "../utils/camera"


const ImageUploadTest = () => {
  const [image,setImage]=useState("");
  const {get,post,loading}=useFetch("http://localhost:5151/api/v1/");

 
  const convertToBase64 = (file) => {
      return new Promise(resolve => {
          const reader = new FileReader();
          reader.readAsDataURL(file);
          reader.onload = () => {
              resolve(reader.result);
          }
      })
  }

  const onSelectFile = async (event) => {
   
    const file = event.target.files[0];
    const convertedFile = await convertToBase64(file);
    const s3URL = post(
        'user/uploadImage',
        {
            image: convertedFile,
            imageName: file.name,
            type:"jpeg"

        },{"auth_token":localStorage.getItem("auth_token")}
    ).then(response=>{
        console.log(response)
        setImage(response.link);
    });
}


  return (
      <div>
        <input type="file" accept="image/*" onChange={onSelectFile}/>
        <img src={image}/>
        </div>

  )
}
export default ImageUploadTest;