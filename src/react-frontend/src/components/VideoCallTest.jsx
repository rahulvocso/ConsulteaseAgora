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

import React, { useState, useEffect, useRef, createContext } from "react";
import { useHistory, Link } from "react-router-dom";

import { Header } from "./Header";
import "./VideoCall.css";
import CallCategorySelection from "./CallCategorySelection.jsx";
import CallPrompt from "./CallPrompt.jsx";
import VideoCallStart from "./VideoCallStart";

import io from "socket.io-client";

let rtcPeerConnection;
//let videoStream;

const VideoCall = ({ profile }) => {
  const [videoCallViewSwitch, setVideoCallViewSwitch] = useState(
    "enterVideoCallDetails"
  );
  //const videoCallViewSwitch = useRef("enterVideoCallDetails");

  const [videoCallStartModal, setVideoCallStartModal] = useState(true);
  const [roomInputValue, setRoomInputValue] = useState("");
  const videoCallControlsModalRef = useRef(null);

  const [videoStream, setVideoStream] = useState();
  const [promptStream, setPromptStream] = useState();
  const promptStreamRef = useRef();
  //const [rtcPeerConnection, setRtcPeerConnection] = useState();

  const button = useRef(null);
  const lobby = useRef(null);
  const room = useRef(null);
  const roomDiv = useRef(null);

  const video = useRef(null);
  const promptVideoRef = useRef();
  const peer = useRef(null);
  const [peerVideo, setPeerVideo] = useState(peer);
  const [selfVideo, setSelfVideo] = useState(video);

  const divButtonGroup = useRef(null);
  const muteButton = useRef(null);
  const hideCamButton = useRef(null);
  const leaveButton = useRef(null);

  const videoCallTimeRemainingRef = useRef(null);
  const videoCallTimePassedRef = useRef(null);
  const callCategoryName = useRef("");
  // const [callCategoryName, setCallCategoryName] = useState("");
  //const callPrompt = useRef("caller");
  const [callPrompt, setCallPrompt] = useState("caller");
  const [videoCallPromptControlsModal, setVideoCallPromptControlsModal] =
    useState(true);
  const calleeAcceptedCall = useRef();
  const [mySocketId, setMySocketId] = useState("");

  /*
  var divButtonGroup = document.getElementById("btn-group");
  var muteButton = document.getElementById("muteButton");
  var hideCamButton = document.getElementById("hideCamButton");
  var leaveButton = document.getElementById("leaveButton");
  

  var button = document.getElementById("button");
  let lobby = document.getElementById("lobby");
  var room = document.getElementById("room");
  var roomDiv = document.getElementById("roomDiv");
  var video = document.getElementById("video");
  var peer = document.getElementById("peer");
  var creator = true;
  var roomname = "";

  var divButtonGroup = document.getElementById("divButtonGroup");
  var muteButton = document.getElementById("muteButton");
  var hideCamButton = document.getElementById("hideCamButton");
  var leaveButton = document.getElementById("leaveButton");
  */

  //const [videoStream, setVideoStream] = useState();
  const videoCamIcon = useRef({
    state: true,
  });
  const videoMicIcon = useRef({
    state: true,
  });
  const [muteFlag, setMuteFlag] = useState(true);
  const [hideCamFlag, setHideCamFlag] = useState(true); //hideFlag
  const reverseCamera = useRef("user");

  let iceServers = {
    iceServers: [
      { urls: "stun:stun.services.mozilla.com" },
      { urls: "stun:stun2.l.google.com:19302" },
    ],
  };

  // let output;
  // let message = "";
  // let username = "";

  let creator = true;
  let roomname = "";
  let socket;
  // useEffect(() => {
  // const firstRender = useRef(false);
  // let promptStream;
  // function promptStreamFunc() {
  //   navigator.mediaDevices
  //     .getUserMedia({
  //       audio: true,
  //       video: {
  //         // width: 500,
  //         // height: 500,
  //         width: 500,
  //         height: 500,
  //         //facingMode: reverseCamera, //cameraReverse,
  //       },
  //     })
  //     .then(function (stream) {
  //       //roomDiv.current.style = "display:block";
  //       console.log("Created", stream);
  //       videoStream = stream;
  //       video.current.srcObject = stream;

  //       promptVideoRef.current.onloadedmetadata = function (e) {
  //         promptVideoRef.current.play();
  //       };
  //       console.log("VideoStream generating");
  //     })
  //     .catch(function (err) {
  //       console.log(err);
  //     });
  // }

  useEffect(() => {
    socket === undefined &&
      (socket = io.connect("http://localhost:5151", {
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
      }));

    socket.on("created", function (data) {
      creator = true;
      navigator.mediaDevices
        .getUserMedia({
          audio: true,
          video: {
            // width: 500,
            // height: 500,
            width: 500,
            height: 500,
            //facingMode: reverseCamera, //cameraReverse,
          },
        })
        .then(function (stream) {
          //roomDiv.current.style = "display:block";
          console.log("Created", stream);

          // setPromptStream(stream);
          // promptStreamRef.current.srcObject = stream;
          // promptStreamRef.current.onloadedmetadata = function (e) {
          //   promptStreamRef.current.play();
          // };

          //videoStream = stream;
          setVideoStream(stream);
          video.current.srcObject = stream;
          video.current.onloadedmetadata = function (e) {
            video.current.play();
          };
          console.log("VideoStream generating");
        })
        .catch(function (err) {
          console.log(err);
        });
    });
    console.log(socket.connected);
  }, []);

  // }, []);

  useEffect(() => {
    /*Socket code starts */
    // if (socket !== undefined) {

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

    socket.on("mySocketId", function (id) {
      console.log("mySocketId", id);
      //mySocketId && setMySocketId(id);
      console.log(socket.connected);
    });

    socket.on("calleeCallPromptResponse", function (data, roomname) {
      console.log("Received Message from Callee", data);
      setCallPrompt("callee");
      setVideoCallViewSwitch("videoCallPrompt");
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

          //videoStream = stream;
          setVideoStream(() => stream);
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
      setVideoCallViewSwitch("startVideoCall");
    });

    socket.on("full", function (data) {
      console.log(data);
      alert(data + " room is full can't join");
    });

    socket.on("ready", function (data) {
      if (creator === true) {
        console.log("Socket 'ready' event fired", videoStream);
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
        console.log("calleeAcceptedCall", calleeAcceptedCall.current);
        socket.emit("calleeCallPromptResponse", {
          callAccepted: calleeAcceptedCall.current,
        });
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
    // }
  }, []);

  /*socket code ends */

  function handleVideoCallProcess() {
    //setRoomInputValue(() => room.current.value);
    //roomname = "a";
    roomname = room.current.value;
    if (roomname === "") {
      alert("Enter room name");
    } else {
      //setVideoCallViewSwitch("startVideoCall");
      lobby.current.style.display = "none";

      socket.emit("join", roomname) &&
        console.log("room join emit event generated", socket, videoStream);
    }
    // socket.emit("sendingMessage", {
    //   //message: message.value,
    //   //username: username.value,
    // });
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

    videoStream.getTracks()[0].enabled = videoMicIcon.current.state;
  }

  function handleHideCamButton() {
    //console.log(videoCamIcon.state);
    videoCamIcon.current.state
      ? (videoCamIcon.current = { state: false, videoCamIcon: videocamOff })
      : (videoCamIcon.current = { state: true, videoCamIcon: videocam });

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

  // VideoCall time countdown handling starts
  const [videoCallStartTime, setVideoCallStartTime] = useState();
  videoCallStartTime === undefined &&
    setVideoCallStartTime(new Date().getTime());
  const [videoCallEndTime, setVideoCallEndTime] = useState();
  videoCallEndTime === undefined &&
    setVideoCallEndTime(new Date().getTime() + 10 * 60 * 1000); //10 min video call sample time
  let currentTime = new Date().getTime();

  let callTimePassed = currentTime - videoCallStartTime;
  let videoCallTimeLeft = videoCallEndTime - currentTime; //10 min video call sample time

  function i() {
    //window.clearTimeout();

    videoCallTimeLeft === 0 && console.log(videoCallTimeRemainingRef.current);
    //videoCallTimeLeft === 0 && videoCallTimePassedRef;
  }
  // VideoCall time countdown handling ends

  useEffect(() => {
    let a;
    peer.current =
      undefined &&
      (a = setInterval(() => {
        videoStream !== undefined && i();
      }, 1000));
    !videoCallTimeLeft && clearInterval(a);
  }, []);

  return (
    <div>
      {videoCallViewSwitch === "enterVideoCallDetails" && (
        <div id="lobby" ref={lobby}>
          {console.log(videoCallViewSwitch)}

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
            <CallCategorySelection
              callCategoryName={callCategoryName}
              //setCallCategoryName={setCallCategoryName}
            />
            <IonButton
              ref={button}
              id="button"
              onClick={() => {
                //console.log(room.current.value !== "");
                if (room.current.value !== "") {
                  handleVideoCallProcess();
                  // callCategoryName !== ""
                  //   ? setVideoCallViewSwitch("videoCallPrompt")
                  //   :

                  //setVideoCallViewSwitch("startVideoCall");
                  setVideoCallViewSwitch("videoCallPrompt");
                  //setCallPrompt("callee");
                  //setCallPrompt("callee");
                  // console.log(videoCallViewSwitch, "videoStream", videoStream);
                }

                // callCategoryName === ""
                //   ? setCallPrompt("callee")
                //   : setCallPrompt("caller");
                console.log(
                  "Selected call category:",
                  callCategoryName.current
                );
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
          videoCamIcon={videoCamIcon}
          videoMicIcon={videoMicIcon}
          handleHideCamButton={handleHideCamButton}
          handleMuteButton={handleMuteButton}
          handleStreamSwitch={handleStreamSwitch}
          selfVideo={selfVideo}
          roomDiv={roomDiv}
          callPrompt={callPrompt}
          videoCallPromptControlsModal={videoCallPromptControlsModal}
          setVideoCallPromptControlsModal={setVideoCallPromptControlsModal}
          calleeAcceptedCall={calleeAcceptedCall}
          videoCallViewSwitch={videoCallViewSwitch}
          setVideoCallViewSwitch={setVideoCallViewSwitch}
          handleVideoCallProcess={handleVideoCallProcess}
        />
      )}
      {/* {console.log(videoCallViewSwitch, "536")} */}
      {videoCallViewSwitch === "startVideoCall" && (
        <VideoCallStart
          videoCallViewSwitch={videoCallViewSwitch}
          roomDiv={roomDiv}
          videoCallTimeRemainingRef={videoCallTimeRemainingRef}
          videoCallTimePassedRef={videoCallTimePassedRef}
          handleStreamSwitch={handleStreamSwitch}
          selfVideo={selfVideo}
          peerVideo={peerVideo}
          videoCallControlsModalRef={videoCallControlsModalRef}
          videoCallStartModal={videoCallStartModal}
          setVideoCallStartModal={setVideoCallStartModal}
          divButtonGroup={divButtonGroup}
          handleChat={handleChat}
          reverseCamera={reverseCamera}
          leaveButton={leaveButton}
          handleLeaveButton={handleLeaveButton}
          muteButton={muteButton}
          handleMuteButton={handleMuteButton}
          hideCamButton={hideCamButton}
          handleHideCamButton={handleHideCamButton}
          videoMicIcon={videoMicIcon}
          videoCamIcon={videoCamIcon}
          callTimePassed={callTimePassed}
        >
          {/* {videoCallViewSwitch !== "videoCallPrompt"
            ? setVideoCallPromptControlsModal(false)
            : setVideoCallPromptControlsModal(true)} */}
        </VideoCallStart>
      )}

      {/* {
        <div
          //className="videoCardsHolder"
          onClick={() => {
            //handleStreamSwitch();
            handleVideoCallProcess();
            console.log("waiyuuu");
          }}
        >
          <video ref={promptVideoRef} id="video" className="videoCard1"></video>
        </div>
      } */}
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
