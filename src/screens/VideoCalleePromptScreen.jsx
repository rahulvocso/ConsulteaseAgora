import React, {useState, useRef, useEffect, useLayoutEffect} from 'react';
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
import { RTCView, MediaStream, mediaDevices } from 'react-native-webrtc';
import {Colors} from 'react-native/Libraries/NewAppScreen';
// import {
//   RTCView,
//   MediaStream,
//   mediaDevices,
//   MediaStreamTrack,
//   getUserMedia,
// } from 'react-native-webrtc';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import Sound from 'react-native-sound';
import InCallManager from 'react-native-incall-manager';

import {SvgUri , SvgXml} from 'react-native-svg';
import notifee, {AndroidImportance} from '@notifee/react-native';

// import Actions from '../../actions';
// import Theme from '../../theme';
import Utils from '../utils';

const acceptCallIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(61, 178, 113, 1);transform: ;msFilter:;"><path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"></path><path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a1 1 0 0 0-.086-1.391l-4.064-3.696z"></path></svg>'
const rejectCallIcon = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(219, 19, 19, 1);transform: ;msFilter:;"><path d="M20 10.999h2C22 5.869 18.127 2 12.99 2v2C17.052 4 20 6.943 20 10.999z"></path><path d="M13 8c2.103 0 3 .897 3 3h2c0-3.225-1.775-5-5-5v2zm3.422 5.443a1.001 1.001 0 0 0-1.391.043l-2.393 2.461c-.576-.11-1.734-.471-2.926-1.66-1.192-1.193-1.553-2.354-1.66-2.926l2.459-2.394a1 1 0 0 0 .043-1.391L6.859 3.513a1 1 0 0 0-1.391-.087l-2.17 1.861a1 1 0 0 0-.29.649c-.015.25-.301 6.172 4.291 10.766C11.305 20.707 16.323 21 17.705 21c.202 0 .326-.006.359-.008a.992.992 0 0 0 .648-.291l1.86-2.171a1 1 0 0 0-.086-1.391l-4.064-3.696z"></path></svg>'
import AvatarSample from '../assets/images/AvatarSample.png';
import CallAccept from '../assets/images/CallAccept.svg';
import CallReject from '../assets/images/CallReject.svg';


const VideoCalleePromptScreen = () => {
  const navigation = useNavigation();

  const isCallViewOn = useSelector(state => state.webview.isCallViewOn);
  const calleeDetails = useSelector(state => state.webview.calleeDetails);
  const callerDetails = useSelector(state => state.webview.callerDetails);
  const incomingCallDetails = useSelector((state) => state.webview.incomingCallDetails);
  const consulteaseUserProfileData = useSelector((state) =>
  state.webview.consulteaseUserProfileData ? state.webview.consulteaseUserProfileData : {},
  );
  const callInstanceData = useSelector((state)=> state.webview.callInstanceData);
  const proceedToJoinCall = useSelector((state)=> state.webview.proceedToJoinCall);

  const dispatch = useDispatch();
  const socketId = useSelector((state) => state.webview.socket.id);
  const peerSocketID = useSelector((state) => state.webview.peerSocketID);
  const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
  const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;

  // ringtone playing code states
  const [ringtone, setRingtone] = useState(false);
  const [ringtoneOnSpeaker, setRingtoneOnSpeaker] = useState(false);
  const [shouldComponentUnmount, setShouldComponentUnmount] = useState(false);
  const componentUnmountTimeoutRef =  useRef();
  const soundTimeoutRef = useRef();
  const [incomingCallAnswer, setIncomingCallAnswer]  = useState();
  const sound = useRef(null)
  const [localStream, setLocalStream] = useState(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await mediaDevices.getUserMedia({ video: true, audio: false });
        // localStream.current = stream;
        setLocalStream(stream);
      } catch (error) {
        console.error('Error accessing camera:', error);
      }
    };

    startCamera();

    // Clean up the stream on unmount
    return () => {
      if (localStream) {
        localStream.release();
        console.log('VideoCalleePromptScreen localstream value:', localStream);
      }
    };
  }, []);

  const maxDuration = 40000; //40sec = 40000 mili sec
    let audioDuration;
    // InCallManager.setForceSpeakerphoneOn(true);
    // InCallManager.start();
    function loadSound(){
      sound.current = new Sound('instagram_videocall_ringtone.mp3', Sound.MAIN_BUNDLE , error => {
        if (error) {
          console.log('******Failed to load the .current', error);
        } else {
          console.log('******Ringtone set', error ? error : '');
          //.current.play();
          audioDuration = (sound.current.getDuration() * 1000);
          sound.current.setNumberOfLoops(-1);
          sound.current.setVolume(1.0);
          // sound.setLooping(true); // Set the audio to play in a loop
          setRingtone(sound.current);
        }
      });
    }

  useEffect(() => {
    console.log('callerDetails inside VideoCalleePromptScreen',callerDetails)
    console.log('callerDetails.photo inside VideoCalleePromptScreen', callerDetails.photo)

    !ringtone ? loadSound() : null;
    
    const ringtoneDuration = audioDuration <= maxDuration ? (sound.getDuration() * 1000) : maxDuration;

    let timeoutId;
    // InCallManager.setForceSpeakerphoneOn(true);
    const playAudioInLoop = () => {
      // InCallManager.setForceSpeakerphoneOn(true);
      sound.current.play();
      sound.current.setNumberOfLoops(-1);
      sound.current.setVolume(1.0);
      soundTimeoutRef.current = setTimeout(playAudioInLoop, audioDuration);
    };

    !ringtone ? playAudioInLoop() : null;

    //component unmount code starts
    componentUnmountTimeoutRef.current = setTimeout(() => {
      if(sound.current){
        sound.current.stop();
        // InCallManager.stop();
        sound.current.release();
      }
      clearTimeout(soundTimeoutRef.current);
      !proceedToJoinCall && clearTimeout(componentUnmountTimeoutRef.current);
      setShouldComponentUnmount(true);
    }, maxDuration);

    return () => {
      if(sound.current){
        sound.current.stop();
        InCallManager.stop();
        sound.current.release();
      }
      localStream && localStream.release();
      clearTimeout(soundTimeoutRef.current);
      !proceedToJoinCall && clearTimeout(componentUnmountTimeoutRef.current);
    }
  }, []);

  useEffect(()=>{
    shouldComponentUnmount && 
    (()=>{
      console.log("******Navigating to webview, component_mount/call_prompt duration completed, call not answered by callee!!"),
      Utils.socket.emit("callMessage",
      {
          type: 'calleeResponse',
          from: socketId,
          to: incomingCallDetails.from,
          response: 'notAnswered',
      });
      localStream && localStream.release();
      dispatch({ type: 'PROCEED_TO_JOIN_CALL', payload: false });
      dispatch({ type: 'SET_CALL_VIEW_ON', payload: false });
      dispatch({ type: 'RESET_WEBVIEW_DERIVED_DATA' });
      navigation.navigate('WebView');
    })()
  },[shouldComponentUnmount])

  function handleCallAccept(){
    clearTimeout(componentUnmountTimeoutRef.current);
    dispatch({ type: 'PROCEED_TO_JOIN_CALL', payload: true })
    if (socketId) {
      (socketId && Utils.socket) ? (
        Utils.socket.emit("callMessage",{
          type: 'calleeResponse',
          from: socketId,
          to: incomingCallDetails.from,
          response: 'accepted'
      })) : null;
      console.log('handleCallAccept() VideoCalleePromptScreen sending call accept message to caller');
      if(sound.current){
        sound.current.stop();
        sound.current.release();
      }
      localStream && localStream.release();
      navigation.navigate('CalleeAgoraUI');
    }  
  }

  function handleCallReject(){
    if (socketId) {
      (socketId && Utils.socket) ? (
        Utils.socket.emit("callMessage",
        {
          type: 'calleeResponse',
          from: socketId,
          to: incomingCallDetails.from,
          response: 'rejected',
        }
      )) : null;
    }
    if(sound.current){
      sound.current.stop();
      sound.current.release();
    }
    localStream && localStream.release();
    dispatch({ type: 'PROCEED_TO_JOIN_CALL', payload: false }),
    dispatch({ type: 'SET_CALL_VIEW_ON', payload: false });
    dispatch({ type: 'RESET_WEBVIEW_DERIVED_DATA' });
    navigation.navigate('WebView');
  }

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'red',
      backgroundColor: 'transparent',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
      // height: deviceHeight,
      // width: deviceWidth,
    },
    callPromptContainer: {
      height: deviceHeight,
      width: deviceWidth,
      position: 'absolute',
      top: 0,
      flex: 1,
      flexDirection: 'column',
      flexWrap: 'wrap',
      borderWidth: 2,
      // borderColor: 'red',
    },
    callPromptAvatar: {
      width: deviceWidth,
      // height: deviceHeight / 8,
      position: 'absolute',
      top: '10%',
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      // borderColor: 'red',
      // borderWidth: 2,
      backgroundColor: '#3DB271F1',
      opacity: 0.95,
      paddingTop: 0,
      paddingBottom: 5,
      borderRadius: 30
      // marginLeft: deviceWidth / 20,
      // marginRight: deviceWidth / 20,
  },
  callPromptCallingName: {
      top: 10,
      fontSize: 25,
      // color: "#cccccc",
  },
  callPromptCalling: {
      top: 10,
      fontSize: 15,
      // color: "#cccccc",
  },
  callPromptCallCategory: {
      top: 10,
      marginTop: 10,
      fontSize: 25,
      marginBottom: 10,
      // color: "#cccccc",
  },
    // callPromptAvatar: {
    //   width: deviceWidth,
    //   height: 'auto',
    //   position: 'absolute',
    //   top: 90,
    //   flex: 1,
    //   flexDirection: 'column',
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   borderColor: 'red',
    //   borderWidth: 2,
    //   // paddingBottom: 10,
    //   // marginLeft: deviceWidth / 20,
    //   // marginRight: deviceWidth / 20,
    // },
    // callPromptCallingName: {
    //   top: 10,
    //   fontSize: 25,
    //   color: '#cccccc',
    // },
    // callPromptCalling: {
    //   top: 10,
    //   fontSize: 15,
    //   color: '#cccccc'
    // },
    // callPromptCallCategory: {
    //   top: 10,
    //   marginTop: 10,
    //   fontSize: 25,
    //   color: '#cccccc',
    //   marginBottom: 5,
    // },
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
      alignItems: 'center', //to lower call buttons
      alignContent: 'center',
      position: 'absolute',
      bottom: 22,
      // borderWidth: 2,
      // borderColor: 'red',
      width: deviceWidth,
      height: deviceHeight / 4,
      //backgroundColor: '#435a6433',
      //backgroundColor: '#075e54',
    },

  });


  return (
    <View style={styles.container}>
      <View>
        {
        console.log('CAMERA STREAM',localStream)
        }
        {localStream  && (
          <RTCView
            streamURL={localStream.toURL()}
            style={{ flex: 1, width: deviceWidth, height: deviceHeight,}}// backgroundColor: 'transparent' }}
            zOrder={-1}
            objectFit='cover'
            mirror={true}
          />
        )}
        
        <View style={styles.callPromptContainer}>
            <View style={styles.callPromptAvatar}>
                <Image
                  style={{width: 80, height: 80, borderRadius: 50, objectFit: "contain"}}
                  source={ callerDetails.length!= 0 && callerDetails.photo ? 
                    {uri: callerDetails.photo} :
                    AvatarSample
                  }
                />

                <Text style={styles.callPromptCallingName}>
                  {Object.keys(callerDetails).length !== 0 && callerDetails.name ? callerDetails.name :"Name Unavailable"}
                </Text>

                <Text style={styles.callPromptCalling}>Calling</Text>

                <Text style={styles.callPromptCallCategory}>
                  {Object.keys(callerDetails).length !== 0 && callerDetails.callCategory ? callerDetails.callCategory : "Call Category Unavailable"}
                </Text>
            </View>

            <View style={styles.callPromptBottomContainer}>
                  <TouchableOpacity onPress={()=>{handleCallReject()}}>
                    <SvgXml xml={rejectCallIcon} width="70" height="70" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                        handleCallAccept();
                        setIncomingCallAnswer(true);
                    }}
                  >
                  <SvgXml xml={acceptCallIcon} width="70" height="70" />
                </TouchableOpacity>
            </View>
        </View> 
      </View>
    </View>
  );
};

export default VideoCalleePromptScreen;
