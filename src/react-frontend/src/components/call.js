// import io from "socket.io-client"; //socket.io-client
// //const socket=io.connect("http://localhost:5052");
// //import VideoCall from "../components/VideoCall";
// const socket = io("http://localhost:3000");
// let output;
// const creator = true;
// const roomname = "";
// const muteFlag = false;
// const hideFlag = false;

// let rtcPeerConnection;

// let videoStream;

// const iceServers = {
//   iceServers: [
//     { urls: "stun:stun.services.mozilla.com" },
//     { urls: "stun:stun2.l.google.com:19302" },
//   ],
// };

// /*

// var button = document.getElementById("enterRoom");
// var lobby = document.getElementById("lobby");
// var room = document.getElementById("room");
// var roomDiv = document.getElementById("roomDiv");
// var video = document.getElementById("video");
// var peer = document.getElementById("peer");
// var creator = true;
// var roomname = "";

// var divButtonGroup = document.getElementById("btn-group");
// var muteButton = document.getElementById("muteButton");
// var hideCamButton = document.getElementById("hideCamButton");
// var leaveButton = document.getElementById("leaveButton");

// var muteFlag = false;
// var hideFlag = false;

// var rtcPeerConnection;

// var videoStream;

// var iceServers = {
//   iceServers: [
//     { urls: "stun:stun.services.mozilla.com" },
//     { urls: "stun:stun2.l.google.com:19302" },
//   ],
// };

// button.addEventListener("click", function () {
//   roomname = room.value;

//   if (roomname == "") {
//     alert("Enter room name");
//   } else {
//     lobby.style = "display:none";
//     socket.emit("join", roomname);
//   }
//   socket.emit("sendingMessage", {
//     message: message.value,
//     username: username.value,
//   });
//   console.log(`Sending Message ${message.value}`);
// });

// muteButton.addEventListener("click", function () {
//   console.log(muteButton.value);
//   muteFlag = !muteFlag;
//   if (muteFlag) {
//     muteButton.textContent = "Unmute";
//   } else muteButton.textContent = "Mute";
//   videoStream.getTracks()[0].enabled = !muteFlag;
// });

// hideButton.addEventListener("click", function () {
//   hideFlag = !hideFlag;
//   if (hideFlag) {
//     hideButton.textContent = "Show Cam";
//   } else hideButton.textContent = "Hide Cam";
//   videoStream.getTracks()[1].enabled = !hideFlag;
// });

// leaveButton.addEventListener("click", function () {
//   console.log(roomname);
//   socket.emit("leave", roomname);

//   roomDiv.style = "display:none";
//   lobby.style = "display:block";

//   if (video.srcObject) {
//     video.srcObject.getTracks()[0].stop();
//     video.srcObject.getTracks()[1].stop();
//   }
//   if (peer.srcObject) {
//     peer.srcObject.getTracks()[0].stop();
//     peer.srcObject.getTracks()[1].stop();
//   }

//   if (rtcPeerConnection) {
//     rtcPeerConnection.ontrack = null;
//     rtcPeerConnection.onicecandidate = null;
//     rtcPeerConnection.close();
//     rtcPeerConnection = null;
//   }
// });

// */
// export default function callSocket(peer, video, roomDiv) {
//   socket.on("leave", function () {
//     // creator=true;

//     if (peer.srcObject) {
//       peer.srcObject.getTracks()[0].stop();
//       peer.srcObject.getTracks()[1].stop();
//     }

//     if (rtcPeerConnection) {
//       rtcPeerConnection.ontrack = null;
//       rtcPeerConnection.onicecandidate = null;
//       rtcPeerConnection.close();
//       rtcPeerConnection = null;
//     }
//   });

//   socket.on("broadcastMessage", function (data) {
//     console.log("Broadcasting Message", data.value);

//     output.innerHTML +=
//       "<p><strong>" +
//       data.username +
//       "</strong>" +
//       data.message +
//       "</strong></p>";
//   });

//   socket.on("created", function (data) {
//     creator = true;

//     navigator.mediaDevices
//       .getUserMedia({
//         audio: true,
//         video: {
//           width: 500,
//           height: 500,
//         },
//       })
//       .then(function (stream) {
//         roomDiv.style = "display:block";

//         videoStream = stream;
//         video.srcObject = stream;
//         video.onloadedmetadata = function (e) {
//           video.play();
//         };
//       })
//       .catch(function (err) {
//         console.log(err);
//       });
//   });
//   socket.on("joined", function (data) {
//     creator = false;
//     navigator.mediaDevices
//       .getUserMedia({
//         audio: true,
//         video: {
//           width: 500,
//           height: 500,
//         },
//       })
//       .then(function (stream) {
//         roomDiv.style = "display:block";

//         videoStream = stream;

//         video.srcObject = stream;
//         video.onloadedmetadata = function (e) {
//           video.play();
//         };
//         socket.emit("ready", roomname);
//       })
//       .catch(function (err) {
//         console.log(err);
//       });
//   });
//   socket.on("full", function (data) {
//     console.log(data);
//     alert(data + " room is full can't join");
//   });
//   socket.on("ready", function (data) {
//     if (creator == true) {
//       rtcPeerConnection = new RTCPeerConnection(iceServers);
//       rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
//       rtcPeerConnection.ontrack = OnTrackFunction;
//       rtcPeerConnection.addTrack(videoStream.getTracks()[0], videoStream);
//       rtcPeerConnection.addTrack(videoStream.getTracks()[1], videoStream);

//       /*rtcPeerConnection.createOffer(function(offer){
//             rtcPeerConnection.setLocalDescription(offer);
//             socket.emit("offer",offer,roomname);

//         }, function(error){
//             console.log(error);
//         });*/

//       rtcPeerConnection
//         .createOffer()
//         .then((offer) => {
//           rtcPeerConnection.setLocalDescription(offer);
//           socket.emit("offer", offer, roomname);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   });

//   socket.on("candidate", function (candidate, roomname) {
//     var icecandidate = new RTCIceCandidate(candidate);
//     console.log(candidate);
//     rtcPeerConnection.addIceCandidate(icecandidate);
//   });

//   socket.on("offer", function (offer) {
//     if (!creator) {
//       rtcPeerConnection = new RTCPeerConnection(iceServers);
//       rtcPeerConnection.onicecandidate = OnIceCandidateFunction;
//       rtcPeerConnection.ontrack = OnTrackFunction;
//       rtcPeerConnection.addTrack(videoStream.getTracks()[0], videoStream);
//       rtcPeerConnection.addTrack(videoStream.getTracks()[1], videoStream);

//       rtcPeerConnection.setRemoteDescription(offer);

//       rtcPeerConnection
//         .createAnswer()
//         .then((answer) => {
//           rtcPeerConnection.setLocalDescription(answer);
//           socket.emit("answer", answer, roomname);
//         })
//         .catch((error) => {
//           console.log(error);
//         });
//     }
//   });
//   socket.on("answer", function (answer) {
//     rtcPeerConnection.setRemoteDescription(answer);
//   });

//   function OnIceCandidateFunction(event) {
//     if (event.candidate) {
//       socket.emit("candidate", event.candidate, roomname);
//     }
//   }

//   function OnTrackFunction(event) {
//     peer.srcObject = event.streams[0];
//     peer.onloadedmetadata = function (e) {
//       peer.play();
//     };
//   }
// }
