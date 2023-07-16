import {
  IonPage,
  IonCard,
  IonHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonContent,
  IonItem,
  IonIcon,
  IonLabel,
  IonInput,
  IonToolbar,
  IonButtons,
  IonButton,
  IonRouterLink,
  IonModal,
  IonRow,
} from "@ionic/react";

import {
  arrowBackOutline,
  attach,
  camera,
  cameraReverse,
  chatbox,
  mic,
  micOff,
  pin,
  send,
  text,
  videocam,
  videocamOff,
  videocamOffOutline,
} from "ionicons/icons";

import React, { useState, useEffect, useRef } from "react";
import { useHistory, Link } from "react-router-dom";

import { Header } from "./Header";
import "./VideoCall.css";
import CallCategorySelection from "./CallCategorySelection.jsx";
import CallPrompt from "./CallPrompt.jsx";

import endCall from "../theme/assets/end-call-icon.svg";
import muteMicrophone from "../theme/assets/microphone-slash-icon.svg";

import io from "socket.io-client"; //socket.io-client

// const cors = require("cors");
// const express = require("express");
// const app = express();
// app.use(cors());
let rtcPeerConnection;
let videoStream;
const VideoCall = ({ profile }) => {
  const [videoCallViewSwitch, setVideoCallViewSwitch] = useState(
    "enterVideoCallDetails"
  ); // enterVideoCallDetails , startVideoCall
  //const [videoCam, setVideoCam] = useState(true);

  const [videoCallStartModal, setVideoCallStartModal] = useState(true);
  const [roomInputValue, setRoomInputValue] = useState("");
  const videoCallControlsModalRef = useRef(null);

  const button = useRef(null);
  const lobby = useRef(null);
  const room = useRef(null);
  const roomDiv = useRef(null);

  const video = useRef(null);
  const peer = useRef(null);
  const [peerVideo, setPeerVideo] = useState(peer);
  const [selfVideo, setSelfVideo] = useState(video);
  let selfVideoInPrompt = selfVideo;

  const divButtonGroup = useRef(null);
  const muteButton = useRef(null);
  const hideCamButton = useRef(null);
  const leaveButton = useRef(null);

  const videoCallTimeRemainingRef = useRef(null);
  const videoCallTimePassedRef = useRef(null);
  //const [callCategoryName, setCallCategoryName] = useState("");
  const callCategoryName = useRef();
  const [callPrompt, setCallPrompt] = useState("caller");
  const [videoCallPromptControlsModal, setVideoCallPromptControlsModal] =
    useState(true);
  const [calleeAcceptedCall, setCalleeAcceptedCall] = useState();

  /*
  var divButtonGroup = document.getElementById("btn-group");
  var muteButton = document.getElementById("muteButton");
  var hideCamButton = document.getElementById("hideCamButton");
  var leaveButton = document.getElementById("leaveButton");
  */

  // var button = document.getElementById("button");
  // let lobby = document.getElementById("lobby");
  // var room = document.getElementById("room");
  // var roomDiv = document.getElementById("roomDiv");
  // var video = document.getElementById("video");
  // var peer = document.getElementById("peer");
  // var creator = true;
  // var roomname = "";

  // var divButtonGroup = document.getElementById("divButtonGroup");
  // var muteButton = document.getElementById("muteButton");
  // var hideCamButton = document.getElementById("hideCamButton");
  // var leaveButton = document.getElementById("leaveButton");

  //const [videoStream, setVideoStream]= useState();
  const videoCamIcon = useRef({
    state: true,
    //videoCamIcon: videocam,
  });
  //const [videoMic, setVideoMic] = useState(true);
  const videoMicIcon = useRef({
    state: true,
    //videoMicIcon: mic,
  });
  const [muteFlag, setMuteFlag] = useState(true);
  const [hideCamFlag, setHideCamFlag] = useState(true); //hideFlag
  const [reverseCamera, setReverseCamera] = useState("user");

  let iceServers = {
    iceServers: [
      { urls: "stun:stun.services.mozilla.com" },
      { urls: "stun:stun2.l.google.com:19302" },
    ],
  };

  // const customStyles = {
  //   content: {
  //     top: "50%",
  //     left: "50%",
  //     right: "auto",
  //     bottom: "auto",
  //     marginRight: "-50%",
  //     transform: "translate(-50%, -50%)",
  //     background: "transparent",
  //     border: "none",
  //   },
  //   overlay: {
  //     background: "rgba(0, 0, 0, 0.5)",
  //   },
  // };

  // let output;
  // let message = "";
  // let username = "";

  let creator = true;
  let roomname = "";

  const socket = io.connect("http://localhost:5151", {
    //"Access-Control_allow_origin": "*",
    //"force new connection": true,
    //reconnectionAttempts: "Infinity",
    //timeout: 1000,
    transports: ["websocket", "polling", "flashsocket"],
    // cors: {
    //   origin: "https://localhost:3000",
    //   methods: ["GET", "POST"],
    //   credentials: true,
    // },
  });

  useEffect(() => {
    /*Socket code starts */
    socket.on("leave", function () {
      creator = true;
      if (peer.current.srcObject) {
        peer.current.srcObject.getTracks()[0].stop();
        peer.current.srcObject.getTracks()[1].stop();
      }
      if (rtcPeerConnection) {
        rtcPeerConnection.ontrack = null;
        rtcPeerConnection.onicecandidate = null;
        rtcPeerConnection.close();
        rtcPeerConnection = null;
      }
    });

    socket.on("broadcastMessage", function (data) {
      console.log("Broadcasting Message", data);
      // output.innerHTML +=
      //   "<p><strong>" +
      //   data.username +
      //   "</strong>" +
      //   data.message +
      //   "</strong></p>";
    });

    socket.on("sendingMessage", function (data) {
      console.log("Received Message", data);
    });

    socket.on("created", function (data) {
      creator = true;
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            // width: 500,
            // height: 500,
            width: 500,
            height: 4000,
            facingMode: reverseCamera, //cameraReverse,
          },
        })
        .then(function (stream) {
          roomDiv.current.style = "display:block";

          videoStream = stream;
          video.current.srcObject = stream;

          video.current.onloadedmetadata = function (e) {
            video.current.play();
          };
        })
        .catch(function (err) {
          console.log(err);
        });
    });

    socket.on("joined", function (data) {
      creator = false;
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            width: 500,
            height: 4000,
          },
        })
        .then(function (stream) {
          roomDiv.current.style = "display:block";

          videoStream = stream;
          video.current.srcObject = stream;

          video.current.onloadedmetadata = function (e) {
            video.current.play();
          };
          socket.emit("ready", roomname);
        })
        .catch(function (err) {
          console.log(err);
        });
      //setCallPrompt("callee");
      //callPrompt === "callee" && setVideoCallViewSwitch("startVideoCall");
      console.log("calleeAcceptedCall", calleeAcceptedCall);
      socket.emit("sendingMessage", {
        callAccepted: calleeAcceptedCall,
      });
    });

    socket.on("full", function (data) {
      console.log(data);
      alert(data + " room is full can't join");
    });

    socket.on("ready", function (data) {
      if (creator === true) {
        console.log(
          "videoStream socket.on('ready')",
          videoStream,
          "videostrem end"
        );
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = OnTrackFunction;
        rtcPeerConnection.addTrack(videoStream.getTracks()[0], videoStream);
        rtcPeerConnection.addTrack(videoStream.getTracks()[1], videoStream);
        /*rtcPeerConnection.createOffer(function(offer){
                  rtcPeerConnection.setLocalDescription(offer);
                  socket.emit("offer",offer,roomname);
               
      
              }, function(error){
                  console.log(error);
              });*/
        rtcPeerConnection
          .createOffer()
          .then((offer) => {
            rtcPeerConnection.setLocalDescription(offer);
            socket.emit("offer", offer, roomname);
          })
          .catch((error) => {
            console.log(error);
          });
        //setVideoCallViewSwitch("startVideoCall");
      }
    });

    socket.on("candidate", function (candidate, roomname) {
      var icecandidate = new RTCIceCandidate(candidate);
      console.log(candidate);
      rtcPeerConnection.addIceCandidate(icecandidate);
    });

    socket.on("offer", function (offer) {
      if (!creator) {
        rtcPeerConnection = new RTCPeerConnection(iceServers);
        rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
        rtcPeerConnection.ontrack = OnTrackFunction;
        rtcPeerConnection.addTrack(videoStream.getTracks()[0], videoStream);
        rtcPeerConnection.addTrack(videoStream.getTracks()[1], videoStream);

        rtcPeerConnection.setRemoteDescription(offer);

        rtcPeerConnection
          .createAnswer()
          .then((answer) => {
            rtcPeerConnection.setLocalDescription(answer);
            socket.emit("answer", answer, roomname);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    });

    socket.on("answer", function (answer) {
      rtcPeerConnection.setRemoteDescription(answer);
    });

    function OnIceCandidateFunction(event) {
      if (event.candidate) {
        socket.emit("candidate", event.candidate, roomname);
      }
    }

    function OnTrackFunction(event) {
      peer.current.srcObject = event.streams[0];
      peer.current.onloadedmetadata = function (e) {
        peer.current.play();
      };
    }
    /*socket code ends */
  }, []);

  function handleVideoCallProcess() {
    //setRoomInputValue(() => room.current.value);
    //roomname = "a";
    roomname = room.current.value;
    if (roomname === "") {
      alert("Enter room name");
    } else {
      //setVideoCallViewSwitch("startVideoCall");
      lobby.current.style.display = "none";
      socket.emit("join", roomname);
    }
    socket.emit("sendingMessage", {
      //message: message.value,
      //username: username.value,
    });
    console.log(`in handleVideocallProcess`);
  }

  function handleChat() {
    videoCallControlsModalRef.current.setCurrentBreakpoint(0.25);
  }

  function handleMuteButton() {
    //console.log(muteButton.current.value);
    videoMicIcon.current.state
      ? (videoMicIcon.current = { state: false, videoMicIcon: micOff })
      : (videoMicIcon.current = { state: true, videoMicIcon: mic });

    //console.log(videoMicIcon.state, "mid");
    videoStream.getTracks()[0].enabled = videoMicIcon.current.state;
  }

  function handleHideCamButton() {
    //console.log(videoCamIcon.state);
    videoCamIcon.current.state
      ? (videoCamIcon.current = { state: false, videoCamIcon: videocamOff })
      : (videoCamIcon.current = { state: true, videoCamIcon: videocam });

    //console.log(videoCamIcon.state, "mid");
    videoStream.getTracks()[1].enabled = videoCamIcon.current.state;

    //console.log(videoCamIcon.state);
  }

  function handleLeaveButton() {
    console.log(roomname);
    socket.emit("leave", roomname);

    videoCallControlsModalRef.current.style = "display:none";
    roomDiv.current.style = "display:none";
    lobby.current.style = "display:block";

    if (video.current.srcObject) {
      video.current.srcObject.getTracks()[0].stop();
      video.current.srcObject.getTracks()[1].stop();
    }
    if (peer.current.srcObject) {
      peer.current.srcObject.getTracks()[0].stop();
      peer.current.srcObject.getTracks()[1].stop();
    }

    if (rtcPeerConnection) {
      rtcPeerConnection.ontrack = null;
      rtcPeerConnection.onicecandidate = null;
      rtcPeerConnection.close();
      rtcPeerConnection = null;
    }
  }

  function handleStreamSwitch(ev) {
    //selfVideo.current.addEventListener("click", function () {
    selfVideo.current === video ? setSelfVideo(peer) : setSelfVideo(video);
    peerVideo.current === peer ? setPeerVideo(video) : setPeerVideo(peer);
    //});
  }

  function callbackCallPrompt(
    calleeAcceptedCall = calleeAcceptedCall,
    videoCallPromptControlsModal = true,
    videoCallViewSwitch = "videoCallPrompt"
  ) {
    setVideoCallPromptControlsModal(videoCallPromptControlsModal);
    setCalleeAcceptedCall(calleeAcceptedCall);
    setVideoCallViewSwitch(videoCallViewSwitch);
  }

  // useEffect(() => {
  //   if (videoCallViewSwitch !== "videoCallPrompt") {
  //     setCallPrompt("");
  //   }
  // }, [videoCallViewSwitch]);

  // useEffect(() => {
  //   if (videoCallViewSwitch !== "videoCallPrompt" || callPrompt !== "callee") {
  //     setVideoCallPromptControlsModal(false);
  //   }
  // }, [videoCallViewSwitch, callPrompt]);

  // useEffect(() => {
  //   if (callDisconnected) {
  //     setVideoCallViewSwitch("enterVideoCallDetails");
  //     setCallPrompt(false);
  //     setVideoCallPromptControlsModal(false);
  //   }
  // }, [callDisconnected]);

  //VideoCall time countdown handling starts
  //const [videoCallStartTime, setVideoCallStartTime] = useState();
  // const [videoCallEndTime, setVideoCallEndTime] = useState();
  // setVideoCallEndTime(new Date().getTime() + 10 * 60 * 1000); //10 min video call sample time
  // let currentTime = new Date().getTime();
  // //console.log(videoCallEndTime);
  // let videoCallTimeLeft = videoCallEndTime - currentTime; //10 min video call sample time
  // videocallMinutesLeft = function i() {
  //   //window.clearTimeout();

  //   videoCallTimeLeft === 0 && console.log(videoCallTimeRemainingRef.current);
  //   //videoCallTimeLeft === 0 && videoCallTimePassedRef;
  // };
  // //VideoCall time countdown handling ends

  // //useEffect(() => {
  // let a = setInterval(() => {
  //   videoStream !== undefined && i();
  // }, 1000);
  // videoCallTimeLeft && clearInterval(a);
  // //}, []);

  return (
    <div>
      {videoCallViewSwitch === "enterVideoCallDetails" && (
        // callPrompt === false &&
        <div id="lobby" ref={lobby}>
          <Header type="videoCall" handleRight={""} title="Video Call" />
          <div className="videoCallRoomDetails">
            <IonItem className="roomInput">
              <IonCardSubtitle className="text">
                Video Call Room :
              </IonCardSubtitle>
              <IonInput
                ref={room}
                id="room"
                type="text"
                //value={roomInputValue}
                placeholder="room name"
              ></IonInput>
            </IonItem>
            <CallCategorySelection callCategoryName={callCategoryName} />
            <IonButton
              ref={button}
              id="button"
              onClick={() => {
                console.log(room.current.value !== "");
                if (room.current.value !== "") {
                  handleVideoCallProcess();
                  // callCategoryName !== ""
                  //   ? setVideoCallViewSwitch("videoCallPrompt")
                  //   :
                  setVideoCallViewSwitch("startVideoCall");
                }

                // callCategoryName === ""
                //   ? setCallPrompt("callee")
                //   : setCallPrompt("caller");
                console.log("Selected call category:", typeof callCategoryName);
                //console.log("Oops! you forgot to select call category");
              }}
            >
              Submit
            </IonButton>
          </div>
        </div>
      )}

      {videoCallViewSwitch === "videoCallPrompt" && (
        <CallPrompt
          callCategoryName={callCategoryName}
          videoCamIcon={videoCamIcon.videoCamIcon}
          videoMicIcon={videoMicIcon.videoMicIcon}
          handleHideCamButton={handleHideCamButton}
          handleMuteButton={handleMuteButton}
          handleStreamSwitch={handleStreamSwitch}
          selfVideo={selfVideo}
          //roomDiv={roomDiv}
          callPrompt={callPrompt}
          videoCallPromptControlsModal={videoCallPromptControlsModal}
          callbackCallPrompt={callbackCallPrompt}
        />
      )}
      {/* {videoCallViewSwitch === "startVideoCall" &&
        setVideoCallPromptControlsModal(false)} */}
      {videoCallViewSwitch === "startVideoCall" && ( //calleeAcceptedCall &&
        <div ref={roomDiv} id="roomDiv">
          <div className="videoCardsHolder">
            <div className="videoCallTopRow">
              <IonCardSubtitle ref={videoCallTimeRemainingRef} color="light">
                04:56 remaining
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
                Click to Modal/Background View Control
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
                        onClick={(cameraReverse) => {
                          reverseCamera === "user"
                            ? setReverseCamera(() => "environment")
                            : setReverseCamera(() => "user");
                          handleStreamSwitch();
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
                        ref={muteButton}
                        onClick={() => handleMuteButton()}
                        className=""
                        shape="round"
                        size="small"
                      >
                        <IonIcon
                          color="light"
                          size="large"
                          icon={videoMicIcon.videoMicIcon}
                          //icon={mic}
                        />
                      </IonButton>

                      <IonButton
                        ref={hideCamButton}
                        onClick={() => handleHideCamButton()}
                        className=""
                        shape="round"
                        size="small"
                      >
                        <IonIcon
                          color="light"
                          size="large"
                          icon={videoCamIcon.videoCamIcon}
                          //icon={videocamOff}
                        />
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
      )}
    </div>
  );
};

export default VideoCall;

// camera reverse

// facingMode: {ideal: cameraReverse}    //below video constraints width,height

// onClick={(cameraReverse) => {
//   cameraReverse === "user"
//     ? setCameraReverse(()=>"environment")
//     : setCameraReverse(()=>"user");
// }}

// //camera button click handler
