import {
  IonButton,
  IonButtons,
  IonIcon,
  IonInput,
  IonModal,
  IonTitle,
  IonToolbar,
  useIonViewWillLeave,
} from "@ionic/react";
import {
  arrowBackOutline,
  attach,
  camera,
  cameraReverse,
  chatbox,
  mic,
  micOff,
  send,
  videocam,
  videocamOff,
} from "ionicons/icons";
import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";

import "./VideoCall.css";
import endCall from "../theme/assets/end-call-icon.svg";
import acceptCall from "../theme/assets/acceptCall.svg";

import Avatar from "react-avatar";

const CallPrompt = ({
  callCategoryName,
  videoCamIcon,
  videoMicIcon,
  handleHideCamButton,
  handleMuteButton,
  handleStreamSwitch,
  selfVideoInPrompt,
  selfVideo,
  roomDiv,
  callPrompt,
  videoCallPromptControlsModal,
  setVideoCallPromptControlsModal,
  calleeAcceptedCall,
  videoCallViewSwitch,
  setVideoCallViewSwitch,
  selfvideo,
  handleVideoCallProcess,
}) => {
  const [reverseCamera, setReverseCamera] = useState("user");
  const videoCallPromptModalRef = useRef();

  const [camIcon, setCamIcon] = useState(videocam);
  const [micIcon, setMicIcon] = useState(mic);

  let profile = JSON.parse(localStorage.getItem("currentProfileInView"));
  //console.log(profile);
  //console.log(JSON.parse(localStorage.getItem("currentProfileInView")));
  console.log(callPrompt);

  useIonViewWillLeave(() => {
    setVideoCallPromptControlsModal(false);
  });
  return (
    <div>
      {callPrompt === "callee" && (
        <div
          className="videoCallPrompt-Container"
          // style={{ display: callPrompt==="callee" ? "block" : "none" }}
        >
          {profile && (
            <div className="videoCallPrompt-AvatarContainer">
              <Avatar
                size="20vw"
                round="50%"
                name={profile.fname}
                src={profile.photo}
                alt="Counsellor profile"
              />
              <IonTitle>
                {profile.fname} {profile.lname}
              </IonTitle>
              <p>Calling</p>
              <IonTitle className="videoCallPromptCategoryName">
                {callCategoryName.current}
              </IonTitle>
            </div>
          )}

          <div className="calleeCallPromptControls">
            <img
              src={endCall}
              className="calleeCallPromptControls-Decline"
              onClick={() => {
                console.log("Call Reject");
                calleeAcceptedCall.current = false;
                // videoCallViewSwitch.current = "enterVideoCallDetails";
              }}
            />
            <img
              src={acceptCall}
              className="calleeCallPromptControls-Accept"
              onClick={() => {
                console.log("Call Accept");
                //callbackCallPrompt(true, undefined, "startVideoCall");
                calleeAcceptedCall.current = true;
                // videoCallViewSwitch.current = "startVideoCall";
              }}
            />
          </div>
        </div>
      )}
      {/* videoCallViewSwitch === "videoCallPrompt" &&  */}
      {callPrompt === "caller" && callCategoryName !== "" && (
        <div className="videoCallPrompt-Container">
          <div id="videoCardsHolder">
            <video
              ref={selfVideo}
              id="video"
              className="videoCard1"
              onClick={() => handleStreamSwitch()}
            ></video>
            {/* {console.log(promptVideoRef.current.srcObject)} */}
          </div>
          {profile && (
            <div className="videoCallPrompt-AvatarContainer">
              <Avatar
                size="20vw"
                round="50%"
                name={profile.fname}
                src={profile.photo}
                alt="Counsellor profile"
              />
              <IonTitle>
                {profile.fname} {profile.lname}
              </IonTitle>
              <p>Calling</p>
              <IonTitle className="videoCallPromptCategoryName">
                {callCategoryName.current}
              </IonTitle>
            </div>
          )}
          {/* {callPrompt !== "caller"&&
          setVideoCallPromptControlsModal(false) &&
          videoCallPromptModalRef.current.dismiss()} */}

          <IonModal
            ref={videoCallPromptModalRef}
            id="videoCallControlsRef"
            showBackdrop="true"
            backdropDismiss="false"
            initialBreakpoint={0.09}
            breakpoints={[0.09, 0.25, 0.5, 1]}
            isOpen={videoCallPromptControlsModal}
            onDismiss={() => setVideoCallPromptControlsModal(false)}
            ionModalDidPresent={() => {
              console.log("VideoCall buttons-modal will present");
            }}
            className="videoCallModal"
          >
            <div className="videoCallModalDiv">
              <IonToolbar>
                <div
                  //ref={divButtonGroup}
                  id="divButtonGroup"
                  className="videoCallControls"
                >
                  <IonButtons slot="start">
                    <IonButton>
                      {/* onClick={() => setVideoCallStartModal(false)} */}
                      <Link to="/profile">
                        <IonIcon
                          color="light"
                          size="small"
                          icon={arrowBackOutline}
                        />
                      </Link>
                      rCalr
                    </IonButton>

                    <IonButton
                      onClick={() => {
                        setVideoCallViewSwitch("startVideoCall");
                        //handleVideoCallProcess();
                      }} //{handleChat}
                      className=""
                      shape="round"
                      size="small"
                    >
                      <IonIcon color="light" size="large" icon={chatbox} />
                    </IonButton>

                    <IonButton
                      onClick={(cameraReverse) => {
                        reverseCamera === "user"
                          ? setReverseCamera(() => "environment")
                          : setReverseCamera(() => "user");
                      }}
                      className=""
                      shape="round"
                    >
                      <IonIcon
                        color="light"
                        size="large"
                        icon={cameraReverse}
                      />
                    </IonButton>

                    <IonButton
                      //ref={muteButton}
                      onClick={() => {
                        handleMuteButton();
                        micIcon === mic ? setMicIcon(micOff) : setMicIcon(mic);
                      }}
                      className=""
                      shape="round"
                      size="small"
                    >
                      <IonIcon color="light" size="large" icon={micIcon} />
                    </IonButton>

                    <IonButton
                      //ref={hideCamButton}
                      onClick={() => {
                        handleHideCamButton();
                        camIcon === videocam
                          ? setCamIcon(videocamOff)
                          : setCamIcon(videocam);
                      }}
                      className=""
                      shape="round"
                      size="small"
                    >
                      <IonIcon color="light" size="large" icon={camIcon} />
                    </IonButton>

                    <IonButton
                      //ref={leaveButton}
                      href="/videocallreview"
                      //onClick={() => handleLeaveButton()}
                      className=""
                      shape="round"
                      size="large"
                    >
                      <IonIcon color="dark" size="large" icon={endCall} />
                    </IonButton>
                  </IonButtons>
                </div>
              </IonToolbar>

              <div className="chatBox">
                <div className="chatControls">
                  <IonInput className="chatInput" placeholder="input text">
                    <div className="chatInputIcons">
                      <IonIcon icon={attach}></IonIcon>
                      <IonIcon icon={camera}></IonIcon>
                    </div>
                  </IonInput>
                  <IonIcon icon={send} className="send"></IonIcon>
                </div>
                <p>typed text</p>
              </div>
            </div>
          </IonModal>
        </div>
      )}
    </div>
  );
};

export default CallPrompt;
