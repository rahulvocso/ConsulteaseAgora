import {
  IonButton,
  IonButtons,
  IonCardSubtitle,
  IonIcon,
  IonInput,
  IonModal,
  IonToolbar,
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
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import endCall from "../theme/assets/end-call-icon.svg";
import muteMicrophone from "../theme/assets/microphone-slash-icon.svg";

const VideoCallStart = ({
  videoCallViewSwitch,
  roomDiv,
  videoCallTimeRemainingRef,
  videoCallTimePassedRef,
  handleStreamSwitch,
  selfVideo,
  peerVideo,
  videoCallControlsModalRef,
  videoCallStartModal,
  setVideoCallStartModal,
  divButtonGroup,
  handleChat,
  reverseCamera,
  setReverseCamera,
  leaveButton,
  handleLeaveButton,
  muteButton,
  handleMuteButton,
  hideCamButton,
  handleHideCamButton,
  videoMicIcon,
  videoCamIcon,
  callTimePassed,
}) => {
  const [camIcon, setCamIcon] = useState(videocam);
  const [micIcon, setMicIcon] = useState(mic);

  // const [reverseCamera, setReverseCamera] = useState("user");

  return (
    //videoCallViewSwitch === "startVideoCall" &&
    //calleeAcceptedCall &&
    <div ref={roomDiv} id="roomDiv">
      <div className="videoCardsHolder">
        <div className="videoCallTopRow">
          <IonCardSubtitle ref={videoCallTimeRemainingRef} color="light">
            04:56 remaining{callTimePassed}
          </IonCardSubtitle>
          <IonCardSubtitle ref={videoCallTimePassedRef} color="light">
            05:04 passed
          </IonCardSubtitle>
          <IonCardSubtitle color="light">Call_Id#7653</IonCardSubtitle>
        </div>
        <div className="customStyle">
          <IonButton
            onClick={() => console.log("Modal/Background View controls")}
          >
            Click for background view control check
          </IonButton>
        </div>
        <div onClick={() => handleStreamSwitch()}>
          <video ref={peerVideo} id="peer" className="videoCard1"></video>
        </div>

        <div onClick={() => handleStreamSwitch()}>
          <video ref={selfVideo} id="video" className="videoCard2"></video>
        </div>
      </div>

      <div>
        {/* style={{ pointerEvents: "auto" }} */}
        <IonModal
          ref={videoCallControlsModalRef}
          id="videoCallControlsRef"
          style={{ pointerEvents: "none" }}
          showBackdrop="true"
          backdropDismiss="false"
          initialBreakpoint={0.085}
          breakpoints={[0.085, 0.02, 0.25, 0.5, 1]}
          isOpen={videoCallStartModal}
          onDidDismiss={""}
          ionModalDidPresent={() => {
            console.log("VideoCall buttons-modal will present");
          }}
          className="videoCallModal"
        >
          <div className="videoCallModalDiv">
            <IonToolbar>
              <div
                ref={divButtonGroup}
                id="divButtonGroup"
                className="videoCallControls"
              >
                <IonButtons slot="start">
                  <IonButton
                    onClick={() => {
                      divButtonGroup.current.display = "none";
                      setVideoCallStartModal(false);
                    }}
                  >
                    <Link to="/profile">
                      <IonIcon
                        color="light"
                        size="small"
                        icon={arrowBackOutline}
                      />
                    </Link>
                  </IonButton>

                  <IonButton
                    onClick={handleChat}
                    className=""
                    shape="round"
                    size="small"
                  >
                    <IonIcon color="light" size="large" icon={chatbox} />
                  </IonButton>

                  <IonButton
                    // onClick={(cameraReverse) => {
                    //   reverseCamera === "user"
                    //     ? setReverseCamera(() => "environment")
                    //     : setReverseCamera(() => "user");
                    // }}
                    className=""
                    shape="round"
                  >
                    <IonIcon color="light" size="large" icon={cameraReverse} />
                  </IonButton>

                  <IonButton
                    ref={muteButton}
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
                    ref={hideCamButton}
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
                    ref={leaveButton}
                    href="/videocallreview"
                    onClick={() => handleLeaveButton()}
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
    </div>
  );
};

export default VideoCallStart;
