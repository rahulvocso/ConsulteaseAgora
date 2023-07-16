import React, {useState, useRef, useEffect} from 'react';

import {
  IonButton,
  IonCardSubtitle,
  IonInput,
  IonItem,
  IonLabel,
  IonRadio,
  IonRadioGroup,
  useIonToast,
} from '@ionic/react';
import Header from './Header';
import CallCategorySelection from './CallCategorySelection';
import './VideoCall.css';

import {useHistory} from 'react-router';

import useFetch from '../hooks/useFetch';

const InputVideoCallDetails = () => {
  // const { get } = useFetch('https://callingserver.onrender.com/api/v1/');
  // const history = useHistory();
  const [callCategorySubmitToast] = useIonToast();
  let  [callCategoryName, setCallCategoryName] = useState('');
  const [consulteaseUserProfileData, setConsulteaseUserProfileData] = useState(JSON.parse(localStorage.getItem('consulteaseUserProfileData')))
  // const [calleeSocketId, setCalleeSocketId] = useState('');

  let profile = JSON.parse(localStorage.getItem('currentProfileInView'));

  const calleeDetails = profile && {
    name: profile.fname
      ? `${profile.fname + ' ' + (profile.lname ? `${profile.lname}` : '')}`
      : 'name unavailable',
    photo: profile.photo,
    callCategory: callCategoryName,
    user_id: profile._id,
  };

  // useEffect(()=>{
  //   // get callee user socket_id related data
  //   if(consulteaseUserProfileData.auth_token && profile._id){
  //     !calleeSocketId && get(`user/getSocket?&user_id=${profile._id}`, {
  //       auth_token: consulteaseUserProfileData.auth_token,
  //     })
  //       .then((data) => {
  //         console.log('getSocket.js, data', data);
  //         if(data.status === 200 &&
  //           data.body.status === 'Online' &&
  //           data.body.socket_id !== (null || undefined || '')
  //           )
  //           {
  //           setCalleeSocketId(data.body.socket_id);
  //           console.log(
  //             '****** Successful  InputVideoCallDetails.js  getSocket() socket_id Get req 200 ******* data.body',
  //             data.body._id,
  //           );
  //         } else {
  //           console.log(
  //             '****** Unsuccessfull  InputVideoCallDetails.js  getSocket() socket_id Get req ******* data.body',
  //             data.status,
  //             data.body,
  //           );
  //         }
  //       })
  //       .catch((error) => {
  //         console.error(
  //           'Error occurred during API call: VideoCallerPromptScreen.js 186 getSocket.js',
  //           error,
  //         );
  //       });
  //   }
  // },[consulteaseUserProfileData.auth_token, profile._id])

  function handleVideoCallProcess() {
    console.log('in handleVideocallProcess() InputVideoCallDetails.js');
    if (profile._id === consulteaseUserProfileData._id){
      console.log("You cannot call yourself!!!");
      callCategorySubmitToast({
        message: "Oops, you can't call yourself. Please choose someone else",
        duration: 3000,
        position: 'top',
        cssClass: 'custom-toast',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel',
          },
        ],
      });
      return;
    }
    if (callCategoryName === '') { 
      // alert('"Oops!, you forgot to select call category. Please enter call category in order to proceed !!!');
      callCategorySubmitToast({
        message: 'Oops!, you forgot to select call category, please select call category in order to proceed !!!',
        duration: 3000,
        position: 'top',
        cssClass: 'custom-toast',
        buttons: [
          {
            text: 'Dismiss',
            role: 'cancel',
          },
        ],
      });
      return;
    }
    if(callCategoryName !== '' && profile && profile._id !== consulteaseUserProfileData._id){
      console.log('ConsultEase videocall room join emit event generated from InputVideoCallDetails Component(webview endpoint)',calleeDetails);
        // best case
        if(profile ){ //&& calleeSocketId !== ''){
          (window.ReactNativeWebView.postMessage(
          `${JSON.stringify({
            messageType: 'calleeDetails',
            messageData: {
              ...calleeDetails,
              callCategory: callCategoryName,
              // calleeSocketId: calleeSocketId,
            }
            })}`
          ));
          console.log({
            messageType: 'calleeDetails',
            messageData: {
              ...calleeDetails,
              callCategory: callCategoryName,
              // calleeSocketId: calleeSocketId,
            }
          }, 'calleeDetails')
        }
        // if calleeSocketId could not be fetched or fetched after clicking submit button
        // if(profile && calleeSocketId === ''){
        //   callResolution = true;
        //   history.goBack();
        //   callCategorySubmitToast({
        //     message: 'SERVER ERROR!!!, Please click video call button again or try after some time',
        //     duration: 3000,
        //     position: 'top',
        //     cssClass: 'custom-toast',
        //     buttons: [
        //       {
        //         text: 'Dismiss',
        //         role: 'cancel',
        //       },
        //     ],
        //   });
        // }
      //
    }
    // if(!callResolution){
    //   handleVideoCallProcess() 
    // } else if(callResolution) {
    //   return
    // }
  }
  return (
    <div id="lobby">
      <Header type="videoCall" handleRight={''} title="Video Call" />
      <div className="videoCallRoomDetails">
        <div className="callCategory">
          <IonCardSubtitle color={'primary'}>
            Please select call category:
          </IonCardSubtitle>

          <IonRadioGroup
            value={callCategoryName}
            onIonChange={e => (setCallCategoryName(e.target.value === undefined ? '' : e.target.value))}
            allowEmptySelection={true}>
            {profile.profile.categories.map((category, index) => (
              <IonItem key={`${category.name}${index}`}>
                <IonLabel>{category.name}</IonLabel>
                <IonRadio
                  slot="end"
                  value={category.name}
                  disabled={false}></IonRadio>
              </IonItem>
            ))}
          </IonRadioGroup>
        </div>
        <IonButton
          //ref={button}
          // fill={ callCategoryName ? 'solid' : 'outline'}
          color={ callCategoryName ? 'primary' : 'dark'}
          id="button"
          onClick={() => {
            handleVideoCallProcess();
            console.log('Selected call category:', callCategoryName);
            //console.log("Oops! you forgot to select call category");
          }}>
          Submit
        </IonButton>
      </div>
    </div>
  );
};

export default InputVideoCallDetails;
