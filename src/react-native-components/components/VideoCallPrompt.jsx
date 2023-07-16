import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Section,
  TouchableOpacity,
  StyleSheet,
  useWindowDimensions,
  Dimensions,
  ScrollView,
} from 'react-native';
import {
  RTCView,
  MediaStream,
  mediaDevices,
  MediaStreamTrack,
  getUserMedia,
} from 'react-native-webrtc';
import {
  checkMultiple,
  request,
  PERMISSIONS,
  RESULTS,
} from 'react-native-permissions';

import SvgUri from 'react-native-svg-uri';

//import RNFetchBlob from 'rn-fetch-blob';
import notifee, {AndroidImportance} from '@notifee/react-native';

import CameraStream from './CameraStream';

const VideoCallPrompt = ({isCallViewOn, setIsCallViewOn}) => {
  const [cameraFacing, setCameraFacing] = useState('user');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [stream, setStream] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [callPromptView, setCallPromptView] = useState(false);
  const [videoCallStatus, setVideoCallStatus] = useState(false);
  const rtcRef = useRef(null);

  const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
  const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;

  // useEffect(() => {
  //   checkPermissions();
  // }, []);

  const checkPermissions = () => {
    checkMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ]).then(statuses => {
      if (
        statuses[PERMISSIONS.ANDROID.CAMERA] === RESULTS.DENIED ||
        statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] === RESULTS.DENIED
      ) {
        requestMultiplePermissions();
      } else if (
        statuses[PERMISSIONS.ANDROID.CAMERA] === RESULTS.BLOCKED ||
        statuses[PERMISSIONS.ANDROID.RECORD_AUDIO] === RESULTS.BLOCKED
      ) {
        console.log(
          'Camera and Audio permissions are blocked. Please enable them in app settings.',
        );
      } else {
        startCameraStream();
      }
    });
  };

  const requestMultiplePermissions = () => {
    request(PERMISSIONS.ANDROID.CAMERA).then(result => {
      if (result === RESULTS.GRANTED) {
        request(PERMISSIONS.ANDROID.RECORD_AUDIO).then(result => {
          if (result === RESULTS.GRANTED) {
            startCameraStream();
          } else {
            console.log('Record audio permission denied');
          }
        });
      } else {
        console.log('Camera permission denied');
      }
    });
  };

  const startCameraStream = async () => {
    console.log('Inside startCameraStream');
    setStreaming(true);
    // const constraints = {
    //   audio: true,
    //   video: {
    //     facingMode,
    //     width: 640,
    //     height: 480,
    //   },
    const constraints = {
      audio: true,
      video: {
        facingMode: cameraFacing, //cameraFacing === 'user' ? 'environment' : 'user',
        mandatory: {
          minWidth: 500,
          minHeight: 300,
          minFrameRate: 30,
        },
      },
    };
    //const mediaStream =
    await mediaDevices.getUserMedia(constraints).then(stream => {
      setStream(stream);
      //console.log(stream);
      rtcRef.current.setStreaming(true);
    });
    // setStream(mediaStream);
    // rtcRef.current.setStreaming(true);
  };
  const returnToWebview = () => {
    setIsCallViewOn(false);
  };

  const stopCameraStream = () => {
    if (stream && stream._tracks.length > 0) {
      stream._tracks.forEach(track => {
        track.stop();
      });
    }
    setStream(null);
    setStreaming(false);
  };

  const toggleRecording = async () => {
    if (recording) {
      try {
        await notifee.stopForegroundService();
      } catch (err) {
        // Handle Error
        console(
          'Inside toggleRecording to stop recording screen, **ERR**:',
          err,
        );
      }
      setRecording(false);
      setVideoUrl('');
    }
    //
    else {
      try {
        const channelId = await notifee.createChannel({
          id: 'screen_capture',
          name: 'Screen Capture',
          lights: false,
          vibration: false,
          importance: AndroidImportance.DEFAULT,
        });

        await notifee.displayNotification({
          title: 'Screen Capture',
          body: 'This notification will be here until you stop capturing.',
          android: {
            channelId,
            asForegroundService: true,
          },
        });
      } catch (err) {
        // Handle Error
        console('Inside toggleRecording to record screen, **ERR**: ', err);
      }
      setRecording(true);
    }
  };

  // const saveRecording = async data => {
  //   const dirs = RNFetchBlob.fs.dirs;
  //   const filePath = `${dirs.CacheDir}/recorded_video.mp4`;
  //   await RNFetchBlob.fs.writeFile(filePath, data, 'base64');
  //   setVideoUrl(`file://${filePath}`);
  //   // C:\Users\Yadavendra-Yadav\Desktop\CallngAppRahul\RNTests\CamRNwebRTC\0VideoRecordings
  // };

  // const onNewFrame = data => {
  //   if (recording) {
  //     saveRecording(data);
  //   }
  // };

  const handleCameraSwitch = () => {
    cameraFacing === 'user'
      ? setCameraFacing('environment')
      : setCameraFacing('user');
    stream.getVideoTracks().forEach(track => {
      track._switchCamera();
    });
  };

  const handleMicOnOff = () => {
    // rtcRef.current.getAudioTracks().forEach(track => {
    //   track.enabled = !isMicOn;
    // });
    stream.getAudioTracks().forEach(track => {
      track.enabled = !isMicOn;
    });
    setIsMicOn(!isMicOn);
  };

  const handleCameraOnOff = () => {
    // rtcRef.current.getVideoTracks().forEach(track => {
    //   track.enabled = !isCameraOn;
    // });
    stream.getVideoTracks().forEach(track => {
      track.enabled = !isCameraOn;
    });
    setIsCameraOn(!isCameraOn);
  };

  const styles = StyleSheet.create({});

  return (
    <View style={styles.callPromptContainer}>
      {!callPromptView ? (
        <TouchableOpacity
          style={styles.callPromptButton}
          onPress={() => {
            setCallPromptView(true);
            checkPermissions();
          }}>
          <Text style={styles.callPromptButtonText}>Start Camera Stream</Text>
        </TouchableOpacity>
      ) : (
        <>
          {videoCallStatus ? (
            <CameraStream
              isCallOn={isCallViewOn}
              setIsCallOn={setIsCallViewOn}
            />
          ) : (
            <View>
              <RTCView
                ref={rtcRef}
                streamURL={stream?.toURL()} //'http://localhost:3005'
                style={styles.callPromptRTCView}
                zOrder={20}
                objectFit={'cover'}
                mirror={true}
              />
              <View style={styles.callPromptAvatar}>
                <Image
                  style={{width: 100, height: 100}}
                  source={require('../assets/AvatarSample.png')}
                />
                <Text style={styles.callPromptCallingName}>Someone</Text>
                <Text style={styles.callPromptCalling}>Calling</Text>
                <Text style={styles.callPromptCallCategory}>
                  {' '}
                  Call category{' '}
                </Text>
              </View>
              <View style={styles.callPromptBottomContainer}>
                <TouchableOpacity onPress={returnToWebview}>
                  <SvgUri
                    width="60"
                    height="60"
                    fill="red"
                    source={require('../assets/CallDisconnect.svg')}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    setVideoCallStatus(true);
                  }}>
                  <SvgUri
                    width="60"
                    height="60"
                    fill="green"
                    source={require('../assets/CallGreen.svg')}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </View>
  );
};

export default VideoCallPrompt;

//
//
//
//
//

//   //     ) : (
//   //       <View style={styles.noStreamView}>
//   //         <Text style={styles.noStreamText}>No Stream</Text>
//   //       </View>

//   return (
//     <View style={styles.container}>
//       {stream ? (
//         <View style={styles.buttonContainer}>
//           <Button title="Start Camera Stream" onPress={startStream} />
//         </View>
//       ) : (
//         <View style={styles.videoContainer}>
//           <RTCView style={styles.rtcView} streamURL={stream.toURL()} />
//           <View style={styles.controlBar}>
//             <TouchableOpacity onPress={toggleRecording}>
//               <Text style={styles.controlText}>
//                 {isRecording ? 'Stop Recording' : 'Start Recording'}
//               </Text>
//             </TouchableOpacity>
//             <TouchableOpacity onPress={stopStream}>
//               <Text style={styles.controlText}>Stop Stream</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       )}
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   rtcView: {
//     flex: 1,
//     width: '100%',
//     backgroundColor: '#000',
//   },
//   buttonContainer: {
//     flexDirection: 'row',
//     justifyContent: 'space-around',
//     alignItems: 'center',
//     position: 'absolute',
//     bottom: 0,
//     left: 0,
//     right: 0,
//     height: 80,
//     backgroundColor: '#000',
//   },
//   button: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     height: 60,
//     width: 60,
//     borderRadius: 30,
//     backgroundColor: '#fff',
//   },/

//
