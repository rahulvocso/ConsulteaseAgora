import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  SafeAreaView,
  Text,
  Image,
  Section,
  TouchableOpacity,
  StyleSheet,
  useColorScheme,
  useWindowDimensions,
  Dimensions,
  ScrollView,
} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
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

import notifee, {AndroidImportance} from '@notifee/react-native';

const CameraStream = ({isCallViewOn, calleeDetails, setIsCallViewOn}) => {
  const [cameraFacing, setCameraFacing] = useState('user');
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isMicOn, setIsMicOn] = useState(true);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState('');
  const [stream, setStream] = useState(null);
  const [streaming, setStreaming] = useState(false);
  const [callPromptView, setCallPromptView] = useState(true);

  const rtcRef = useRef(null);
  const rtcRef2 = useRef(null);
  const [rtcRefSwitch, setRTCRefSwitch] = useState(true);

  const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
  const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };
  useEffect(() => {
    checkPermissions();
  }, []);

  const checkPermissions = () => {
    checkMultiple([
      PERMISSIONS.ANDROID.CAMERA,
      PERMISSIONS.ANDROID.RECORD_AUDIO,
    ])
      .then(statuses => {
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
      })
      .catch(() => {
        console.log(
          'Error while checking permissions; checkPermissions() line:75',
        );
      });
  };

  const requestMultiplePermissions = () => {
    request(PERMISSIONS.ANDROID.CAMERA)
      .then(result => {
        if (result === RESULTS.GRANTED) {
          request(PERMISSIONS.ANDROID.RECORD_AUDIO)
            .then(result => {
              if (result === RESULTS.GRANTED) {
                startCameraStream();
              } else {
                console.log('Record audio permission denied');
              }
            })
            .catch(() => {
              console.log(
                'Error while asking AUDIO permissions: CameraStream.jsx',
              );
            });
        } else {
          console.log('Camera permission denied');
        }
      })
      .catch(() => {
        console.log(
          'Error while asking camera, audio permissions: CameraStream.jsx',
        );
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
    await mediaDevices
      .getUserMedia(constraints)
      .then(stream => {
        setStream(stream);
        //console.log(stream);
        rtcRef.current.setStreaming(true);
        //rtcRef2.current.setStreaming(true);
      })
      .catch(() => {
        console.log(
          'Error while await mediaDevices.getUserMedia; CameraStream.jsx Line:135 ',
        );
      });
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

  const handleStreamContainerSwitch = () => {
    // const rtcViewStyleTemp = styles.rtcView;
    // styles.rtcView = styles.rtcView2;
    // styles.rtcView2 = styles.rtcView;
    setRTCRefSwitch(!rtcRefSwitch);
    // rtcRef2.current.streamURL === stream?.toURL()
    //   ? (rtcRef2.current.streamURL = stream?.toURL())
    //   : (rtcRef2.current.streamURL = '');
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
      height: deviceHeight,
      width: deviceWidth,
    },
    button: {
      //backgroundColor: 'blue',
      backgroundColor: '#61DAFB',
      padding: 10,
      borderRadius: 5,
      margin: 10,
    },
    buttonText: {
      //color: '#fff',
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
    },

    rtcView: {
      flex: 1,
      // width: '100%',
      // height: '100%',
      height: deviceHeight,
      width: deviceWidth,
      // position: 'absolute',
      // top: 0,
      // left: 0,
    },
    callPromptContainer: {
      height: deviceHeight,
      width: deviceWidth,
      position: 'absolute',
      top: 0,
      flex: 1,
      flexDirection: 'column',
      flexWrap: 'wrap',
    },
    callPromptAvatar: {
      width: deviceWidth,
      // height: deviceHeight / 8,
      position: 'absolute',
      top: 90,
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      // marginLeft: deviceWidth / 20,
      // marginRight: deviceWidth / 20,
    },
    callPromptCallingName: {
      top: 10,
      fontSize: 25,
    },
    callPromptCalling: {
      top: 10,
      fontSize: 15,
    },
    callPromptCallCategory: {
      top: 10,
      marginTop: 10,
      fontSize: 25,
    },
    callPromptButton: {
      //backgroundColor: 'blue',
      backgroundColor: '#61DAFB',
      padding: 10,
      borderRadius: 5,
      margin: 10,
    },
    callPromptButtonText: {
      //color: '#fff',
      color: 'black',
      fontWeight: 'bold',
      textAlign: 'center',
    },

    callPromptBottomContainer: {
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      // backgroundColor: '#ffffff1a',
      alignItems: 'center',
      position: 'absolute',
      bottom: 0,
      // borderWidth: 2,
      // borderColor: 'red',
      width: deviceWidth,
      height: deviceHeight / 4,
      //backgroundColor: '#435a6433',
      //backgroundColor: '#075e54',
    },
    callViewContainer: {
      flex: 1,
      height: deviceHeight,
      width: deviceWidth,
      // flexDirection: 'column',
      // flexWrap: 'wrap',
      //backgroundColor: '#fff',
      // alignContent: 'flex-start',
      // justifyContent: 'center',

      position: 'absolute',
      top: 0,
      height: deviceHeight,
      width: deviceWidth,
      position: 'absolute',
      flex: 1,
      flexDirection: 'column',
      flexWrap: 'wrap',
    },
    topProgressBar: {
      flex: 1,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      backgroundColor: '#ffffff1a',
      //backgroundColor: 'blue',
      width: deviceWidth,
      height: deviceHeight / 25,
      position: 'absolute',
      top: 1,
      margin: 0,
      borderRadius: 25,
      //backgroundColor: !isDarkMode ? Colors.darker : Colors.lighter,
    },
    topProgressBarText: {
      paddingTop: 0,
      color: '#fff',
      //backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    },
    callViewBottomContainer: {
      position: 'absolute',
      bottom: 0,
    },
    controlButtonsContainer: {
      position: 'absolute',
      bottom: 0,
      flex: 1,
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-evenly',
      backgroundColor: '#ffffff1a',
      alignItems: 'center',
      width: deviceWidth,
      height: deviceHeight / 12,
      backgroundColor: '#435a6433',
      backgroundColor: '#075e54',
      paddingTop: 12,
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
    },

    rtcView2Container: {
      flex: 1,
      width: deviceWidth / 3,
      height: deviceHeight / 6,
      position: 'absolute',
      bottom: deviceHeight / 8,
      right: deviceWidth / 20,
      backgroundColor: 'white',
      borderRadius: 15,
      //aspectRatio: 20,
    },
    rtcView2: {
      //flex: 1,
      width: deviceWidth / 3,
      height: deviceHeight / 6,
      // position: 'absolute',
      // bottom: deviceHeight / 8,
      // right: deviceWidth / 20,
      backgroundColor: 'purple',
      borderRadius: 15,
      //aspectRatio: 20,
    },
  });

  return (
    <View style={styles.container}>
      {streaming && (
        //   <TouchableOpacity style={styles.button} onPress={checkPermissions}>
        //     <Text style={styles.buttonText}>Start Camera Stream</Text>
        //   </TouchableOpacity>
        // ) : (
        <>
          <View>
            <RTCView
              ref={rtcRef}
              streamURL={rtcRefSwitch ? stream?.toURL() : ''} //'http://localhost:3005'
              style={styles.rtcView}
              zOrder={-1}
              objectFit={'cover'}
              mirror={true}
            />

            {callPromptView && (
              <View style={styles.callPromptContainer}>
                <View style={styles.callPromptAvatar}>
                  <Image
                    style={{width: 80, height: 80, borderRadius: 50}}
                    //source={require('../assets/AvatarSample.png')}
                    source={{
                      uri: calleeDetails.photo
                        ? calleeDetails.photo
                        : require('../assets/AvatarSample.png'),
                    }}
                  />

                  <Text style={styles.callPromptCallingName}>
                    {calleeDetails.name}
                  </Text>

                  <Text style={styles.callPromptCalling}>Calling</Text>

                  <Text style={styles.callPromptCallCategory}>
                    {calleeDetails.callCategory}
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
                      setCallPromptView(false);
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

            {!callPromptView && (
              <View style={styles.callViewContainer}>
                <View style={styles.topProgressBar}>
                  <Text style={styles.topProgressBarText}>04:56 remaining</Text>
                  <Text style={styles.topProgressBarText}>05:04 passed</Text>
                  <Text style={styles.topProgressBarText}>#734549503</Text>
                </View>
                <View
                  style={styles.rtcView2Container}
                  onPress={handleStreamContainerSwitch}>
                  <RTCView
                    ref={rtcRef2}
                    streamURL={!rtcRefSwitch ? '' : stream?.toURL()} //'http://localhost:3005'
                    style={styles.rtcView2}
                    zOrder={1}
                    objectFit={'cover'}
                    mirror={true}
                    onPress={handleStreamContainerSwitch}
                  />
                </View>
                <View style={styles.callViewBottomContainer}>
                  <View style={styles.controlButtonsContainer}>
                    <TouchableOpacity onPress={stopCameraStream}>
                      <SvgUri
                        width="25"
                        height="25"
                        fill="white"
                        source={require('../assets/GoBack.svg')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCameraSwitch}>
                      <SvgUri
                        width="35"
                        height="35"
                        fill="white"
                        source={require('../assets/CameraSwitch.svg')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleStreamContainerSwitch}>
                      <SvgUri
                        width="30"
                        height="30"
                        fill="white"
                        source={require('../assets/Monitor.svg')}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleMicOnOff}>
                      <SvgUri
                        width="35"
                        height="35"
                        fill="white"
                        source={
                          isMicOn
                            ? require('../assets/MicOn.svg')
                            : require('../assets/MicOff.svg')
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCameraOnOff}>
                      <SvgUri
                        width="35"
                        height="35"
                        fill="white"
                        // fill="#3DB271"
                        source={
                          isCameraOn
                            ? require('../assets/CameraOn.svg')
                            : require('../assets/CameraOff.svg')
                        }
                      />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={returnToWebview}>
                      <SvgUri
                        width="40"
                        height="40"
                        fill="red"
                        source={require('../assets/CallDisconnect.svg')}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            )}
          </View>
        </>
      )}
    </View>
  );
};

export default CameraStream;
