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
// import {
//   RTCView,
//   MediaStream,
//   mediaDevices,
//   MediaStreamTrack,
//   getUserMedia,
// } from 'react-native-webrtc';

import { useSelector, useDispatch } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
// import { v4 as uuidv4 } from 'uuid';
// import SvgUri from 'react-native-svg-uri';

// import Actions from '../../actions';
// import Theme from '../../theme';
// import Utils from '../../utils';
import Timer from './Timer';


// import notifee, {AndroidImportance} from '@notifee/react-native';
import GoBack from '../assets/images/GoBack.svg';
import GoBack1 from '../assets/images/GoBack1.svg';
import CameraSwitch from '../assets/images/CameraSwitch.svg';
import Monitor1 from '../assets/images/Monitor1.svg';
import MicOn from '../assets/images/MicOn.svg';
import MicOn1 from '../assets/images/MicOn1.svg';
import MicOff from '../assets/images/MicOff.svg';
import MicOff1 from '../assets/images/MicOff1.svg';
import CameraOn from '../assets/images/CameraOn.svg';
import CameraOff from '../assets/images/CameraOff.svg';
import CallReject from '../assets/images/CallReject.svg';

const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;


const VideoCallScreen = () => {
  const dispatch = useDispatch();
  const navigation = useNavigation();
 

  const [cameraIsFacingUser, setCameraIsFacingUser] = useState('user');
  const video = useSelector((state) => state.media.local.video);
  const audio = useSelector((state) => state.media.local.audio);
  const [isCameraOn, setIsCameraOn] = useState(true); //video
  const [isMicOn, setIsMicOn] = useState(true);

  const key = useSelector((state) => state.meeting.key);
  const active = useSelector((state) => !!state.media.local.video);
  const interfaces = useSelector((state) => state.media.interfaces);
  const filteredInterfaces = interfaces.filter((e) => !hidden.set.has(e.id));
  const joined = useSelector((state) => state.media.joined);
  const ended = useSelector((state) => state.meeting.ended);
  const room = useSelector((state)=>state.meeting.room); 
  const socketId = useSelector((state) => state.socket.id);
  const callId = useSelector((state)=>state.webview.callInstanceData._id);
  const peerSocketId = useSelector((state)=>state.webview.peerSocketId);
  const uuid = useSelector((state) => state.media.uuid);

  
  const [ primaryVideoViewIsPeer, setPrimaryVideoViewIsPeer ] = useState(true)

  const timerLimit = 3660;
  
  useEffect(() => {
    !video ? dispatch(Actions.Media.getLocalVideo()) : null;
    !audio ? dispatch(Actions.Media.getLocalAudio()) : null;
    console.log('****interfaces',interfaces);
    // dispatch(Actions.Media.joinMeeting());
    return () => {
      // dispatch(Actions.Media.releaseLocalVideo());
      // dispatch(Actions.Media.releaseLocalAudio());
      dispatch({ type: 'RESET_WEBVIEW_DERIVED_DATA' });
    }
  }, []);

  useEffect(()=>{
    console.log("****VIDEO****",video);
  },[video])

  useEffect(() => {
    if (ended) {
      // navigation.popToTop();
      console("******CAll ENDED ******returning to webview")
      navigation.navigate('WebView');
      dispatch({type: 'SET_CALL_VIEW_ON', payload: false})
    } else if (!joined) {
      console("******CAll NOT JOINED ******returning to webview")
      // navigation.goBack();
      navigation.navigate('WebView');
    } else {
      dispatch(Actions.Media.joinMeeting());
    }
  }, [joined]);

  // useEffect(() => {
  //   if (socketId && callInstanceState._id) {
  //     room ? null : dispatch(Actions.IO.joinRoom(callInstanceState._id)); // call_id or room_key = callInstanceState._id
  //   }
  // }, [socketId]);

  const handleCallDisconnect = () => {
    //navigation.navigate('CallRating')
    (socketId && Utils.socket) ? (
      Utils.socket.emit("messageDirectPrivate",
      {
        type: 'callResponse',
        from: socketId,
        to: peerSocketId,
        response: 'disconnected',
      }
    )) : null;
    dispatch(Actions.Media.releaseLocalVideo());
    dispatch(Actions.Media.releaseLocalAudio());
    dispatch(Actions.Media.leaveMeeting());
    dispatch({ type: 'SET_CALL_VIEW_ON', payload: false });
    dispatch({ type: 'RESET_WEBVIEW_DERIVED_DATA' });
    navigation.navigate('WebView');
  };

  const handleCameraFacing = () => {
    dispatch(Actions.Media.flipCamera())
    setCameraIsFacingUser((cameraIsFacingUser)=>(!cameraIsFacingUser))
  };

  const handleMicToggle = () => {
    setIsMicOn(!isMicOn);
    isMicOn ? dispatch(Actions.Media.releaseLocalAudio()) : dispatch(Actions.Media.getLocalAudio())
  };

  const handleCameraToggle = () => {
    setIsCameraOn(!isCameraOn);
    isCameraOn ? dispatch(Actions.Media.releaseLocalVideo()) : dispatch(Actions.Media.getLocalVideo())
  };

  const handlePrimaryVideoStreamView = () => {
    setPrimaryVideoViewIsPeer((primaryVideoViewIsPeer)=>(!primaryVideoViewIsPeer))
  };

 

  

  return (
    <View style={styles.container}>
        <View>
            <RTCView
              // ref={rtcRef}
              // streamURL={primaryVideoViewIsPeer ? (" ") : (video && video.stream && video.stream?.toURL()) }
              streamURL={filteredInterfaces[0].video.stream.toURL()}
              style={styles.rtcView}
              zOrder={-1}
              objectFit='cover'
              mirror={true}
            />
            {(interfaces[0].audio)
              ? <RTCView streamURL={filteredInterfaces[0].audio.stream.toURL()} zOrder={-1} />
              : null
            }
            {/* host video */}
            {/* <RTCView
              // mirror={!interfaces[0].screen && peer.facingMode === 'user'}
              objectFit={cover && !peer.screen ? 'cover' : 'contain'}
              streamURL={interfaces[0].video.stream.toURL()}
              zOrder={0}
              // style={{ flex: 1, width: '100%', height: '100%' }}
              style={styles.rtcView}
            /> */}
            {/* <RTCView streamURL={interfaces[0].audio.stream.toURL()} zOrder={0} /> */}
            
            <View style={styles.callViewContainer}>
                <View style={styles.topProgressBar}>        
                    <Timer timerLimit={timerLimit} callId = {callId}/>
                </View>
                <View
                    style={styles.rtcView2Container}
                    // onPress={handleStreamContainerSwitch}
                >
                    <RTCView
                      // ref={rtcRef2}
                      // streamURL={primaryVideoViewIsPeer ? (video && video.stream && video.stream?.toURL()) : ("")
                      // }
                      streamURL={filteredInterfaces[1].video.stream.toURL()}
                      // streamURL={interfaces[1].video.stream.toURL()}
                      style={styles.rtcView2}
                      zOrder={1}
                      objectFit={'cover'}
                      mirror={true}
                    />
                      {(interfaces[0].audio)
                        ? <RTCView streamURL={filteredInterfaces[1].audio.stream.toURL()} zOrder={-1} />
                        : null
                      }
                    {/* <RTCView streamURL={interfaces[1].audio.stream.toURL()} zOrder={1} /> */}
                </View>
                <View style={styles.callViewBottomContainer}>
                    <View style={styles.controlButtonsContainer}>
                    <TouchableOpacity onPress={ ()=>{navigation.goBack()}}>
                        <GoBack1
                          width={30} 
                          height={30}
                          fill="white"
                          // fill="#3DB271"
                        /> 
                        {/* <SvgUri
                        width="25"
                        height="25"
                        fill="white"
                        source={require('../../../android/app/src/main/assets/GoBack.svg')}
                        // source={require('../../assets/images/GoBack.svg')}
                        /> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCameraFacing}>
                        <CameraSwitch
                          width={35} 
                          height={35}
                          fill="white"
                          // fill="#3DB271"
                        />
                        {/* <SvgUri
                        width="35"
                        height="35"
                        fill="white"
                        source={require('../../../android/app/src/main/assets/CameraSwitch.svg')}
                        // source={require('../../assets/images/CameraSwitch.svg')}
                        /> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handlePrimaryVideoStreamView}>
                        <Monitor1
                          width={36} 
                          height={36}
                          fill="white"
                          // fill="#3DB271"
                        />
                        {/* <SvgUri
                        width="30"
                        height="30"
                        fill="white"
                        source={require('../../../android/app/src/main/assets/Monitor.svg')}  
                        // source={require('../../assets/images/Monitor.svg')}
                        /> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleMicToggle}>
                      {
                        isMicOn ? 
                        <MicOn1
                        width={37} 
                        height={37}
                        fill="white"
                        // fill="#3DB271"
                        />
                        :
                        <MicOff1
                        width={35} 
                        height={35}
                        fill="white"
                        // fill="#3DB271"
                      />
                      }
                        {/* <SvgUri
                        width="35"
                        height="35"
                        fill="white"
                        source={
                          isMicOn 
                          ? require('../../../android/app/src/main/assets/MicOn.svg')
                          : require('../../../android/app/src/main/assets/MicOff.svg')
                        }
                        // source={
                        //     isMicOn
                        //     ? require('../../assets/images/MicOn.svg')
                        //     : require('../../assets/images/MicOff.svg')
                        // }
                        /> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCameraToggle}>
                      {
                        isCameraOn ? 
                        <CameraOn
                        width={35} 
                        height={35}
                        fill="white"
                        // fill="#3DB271"
                        />
                        :
                        <CameraOff
                        width={35} 
                        height={35}
                        fill="white"
                        // fill="#3DB271"
                        />
                      }
                        {/* <SvgUri
                        width="35"
                        height="35"
                        fill="white"
                        // fill="#3DB271"
                        source={
                          isCameraOn 
                          ? require('../../../android/app/src/main/assets/CameraOn.svg')
                          : require('../../../android/app/src/main/assets/CameraOff.svg')
                        }
                        // source={
                        //     isCameraOn
                        //     ? require('../../assets/images/CameraOn.svg')
                        //     : require('../../assets/images/CameraOff.svg')
                        // }
                        /> */}
                    </TouchableOpacity>
                    <TouchableOpacity onPress={handleCallDisconnect}>
                      <CallReject
                        width={40} 
                        height={40}
                        fill="red"
                      />
                    </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    </View>
  );
};

export default VideoCallScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    height: deviceHeight,
    width: deviceWidth,
  },
  rtcView: {
    flex: 1,
    // width: '100%',
    // height: '100%',
    height: deviceHeight,
    width: deviceWidth,
    backgroundColor: "#000000"
    // position: 'absolute',
    // top: 0,
    // left: 0,
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
  callViewContainer: {
    flex: 1,
    flexDirection: 'column',
    flexWrap: 'wrap',
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
    top: 0,
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
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },

  rtcView2Container: {
    flex: 1,
    width: deviceWidth / 3,
    height: deviceHeight / 6,
    position: 'absolute',
    bottom: deviceHeight / 8,
    right: deviceWidth / 20,
    backgroundColor: '#075e54',
    // borderWidth: 2,
    // borderColor: "#075e54",
    // borderRadius: 15,
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
    borderWidth: 2,
    borderColor: "white",
    borderRadius: 15,
    //aspectRatio: 20,
  },
});