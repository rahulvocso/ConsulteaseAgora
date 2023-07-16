import {
  View,
  Text,
  KeyboardAvoidingView,
} from 'react-native';
import { NativeModules } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Utils from './src/utils';
import Actions from './src/store/actions';

import io from 'socket.io-client';

import Sample from './src/react-native-components/components/Sample'
import CallerAgoraUI from './src/screens/CallerAgoraUI';
import CalleeAgoraUI from './src/screens/CalleeAgoraUI';

import VideoCalleePromptScreen from './src/screens/VideoCalleePromptScreen';
import VideoCallerPromptScreen from './src/screens/VideoCallerPromptScreen';
import VideoCallScreen from './src/screens/VideoCallScreen';
import CallRatingScreen from './src/screens/CallRatingScreen';
import ConsultEaseWebview from './src/react-native-components/components/ConsultEaseWebview';
import useFetch from './src/hooks/useFetch';

import setupSocket from './src/socket/socket-client/setupSocket.js'; //socket

// import { disconnectSocket } from './src/socket/socket-client/index.mjs';

const Stack = createNativeStackNavigator();

// APP COMPONENT
function App() {
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const socketId = useSelector((state) => state.webview.socket.id); 
  const consulteaseUserProfileData = useSelector((state) => state.webview.consulteaseUserProfileData)
  // const device = useSelector((state) => state.media.device);
  // const isCallViewOn = useSelector((state) => state.webview.isCallViewOn);
  // const calleeDetails = useSelector((state) => state.webview.calleeDetails);
  // const amICallSetter = useSelector((state) => state.webview.amICallSetter);
  // const callInstanceData = useSelector((state) => state.webview.callInstanceData);

  const { get, post } = useFetch('https://callingserver.onrender.com/api/v1/');

  // const consulteaseUserProfileData = {
  //     // _id: '639854af79cea626807688ba',
  //     _id: 'test-profile-id',
  //     auth_token:
  //       'eyJhbGciOiJIUzI1NiJ9.NjM5ODU0YWY3OWNlYTYyNjgwNzY4OGJh.Z9xf4J2JpqUEb_2-5ObYFLrCbRRe8IeJZ3NDwXltKkE',
  //   };

  useEffect(() => {
    if (!socketId && Object.keys(consulteaseUserProfileData).length !== 0) {
      // setupSocket(consulteaseUserProfileData);
      dispatch(Actions.setupSocket(consulteaseUserProfileData));
    }
    return(()=>{
      // Utils.socket = null
      // dispatch({type: 'SET_SOCKET_ID', payload: null})
    })
  }, [consulteaseUserProfileData, socketId]);

  // useEffect(() => {
  //   consulteaseUserProfileData.auth_token && socketId
  //     ? (postSocket(consulteaseUserProfileData, socketId, post),
  //       console.log('**SOCKET ID changed**', socketId, 'in Container App.js UseEffect'))
  //     : null;
  // }, [socketId, consulteaseUserProfileData.auth_token]);



  useEffect(() => {
    socketId !== null || undefined
      ? Utils.socket.on('callMessage', (messageData) => {
          // const data = xss(JSON.parse(messageData).content);
          const message = messageData.content;
          console.log(
            '************ Incoming messageDirectPrivate received App.js useEffect line~359********',
            message.type,
            message,
          );
          console.log('***current navigation screen', navigation.getCurrentRoute().name);

          // incoming call message from peer
          if (message.type === 'incomingVideoCall') {
            console.log(
              'user busy status',
              ['VideoCallerPrompt', 'VideoCalleePrompt', 'VideoCall'].includes(
                navigation.getCurrentRoute().name,
              ),
              `['VideoCallerPrompt', 'VideoCalleePrompt', 'VideoCall'].includes(
                navigation.getCurrentRoute().name,
              )`,
            );
            if (
              ['VideoCallerPrompt', 'VideoCalleePrompt', 'VideoCall'].includes(
                navigation.getCurrentRoute().name,
              ) === false //checks if user is on another call by checking current navigation screen
            ) {
              dispatch({
                type: 'SET_CALLER_DETAILS',
                payload: message.callerDetails,
              });
              dispatch({ type: 'SET_INCOMING_CALL_DETAILS', payload: message });
              dispatch({ type: 'SET_CALL_INSTANCE_DATA', payload: message.callInstanceData });
              dispatch({ type: 'SET_PEER_SOCKET_ID', payload: message.from });
              dispatch({ type: 'meeting-key', value: xss(message.callInstanceData._id) });
              message.callInstanceData._id ? dispatch({ type: 'meeting-errors-clear' }) : null;
              console.log(
                'Call ************ Incoming "videocall" messageDirectPrivate received App.js useEffect line~359********',
                message,
                JSON.stringify(message),
              );
              navigation.navigate('VideoCalleePrompt');
            } else {
              // response if callee is busy on another call
              Utils.socket.emit('messageDirectPrivate', {
                type: 'calleeResponse',
                from: socketId,
                to: message.from,
                response: 'busy',
              });
            }
          }

          // outgoing call back/response message from peer
          else if (message.type === 'calleeResponse') {
            console.log(
              'Call-Response ************ Incoming "callResponse" messageDirectPrivate received App.js useEffect line~366********',
              message,
              JSON.stringify(message),
            );
            message.response === 'accepted'
              ? (dispatch({ type: 'PROCEED_TO_JOIN_CALL', payload: true }),
                navigation.navigate('Meeting'))
              : null;
            message.response === 'rejected'
              ? (dispatch(Actions.Media.leaveMeeting()),
                dispatch({ type: 'PROCEED_TO_JOIN_CALL', payload: false }),
                dispatch({ type: 'SET_CALL_VIEW_ON', payload: false }),
                dispatch({ type: 'RESET_WEBVIEW_DERIVED_DATA' }),
                navigation.navigate('WebView'))
              : null;
            message.response === 'busy'
              ? (navigation.navigate('WebView'), console.log('user is busy on another call')) // pending: add a popup to display user is busy or play some sound
              : null;
            // message.response === 'disconnected'  // pending: implement this logic in videocall component to reduce code redundancy for both caller and callee
            //   ?
            //   :
          } else if (message.type === 'callerResponse') {
            message.response === 'disconnectedByCallerBeforeCalleeResponse'
              ? (dispatch(Actions.Media.leaveMeeting()),
                dispatch({ type: 'SET_CALL_VIEW_ON', payload: false }),
                dispatch({ type: 'RESET_WEBVIEW_DERIVED_DATA' }),
                navigation.navigate('WebView'))
              : null;
          } else if (message.type === 'callResponse') {
            message.response === 'disconnected'
              ? (dispatch(Actions.Media.leaveMeeting()),
                dispatch({ type: 'SET_CALL_VIEW_ON', payload: false }),
                dispatch({ type: 'RESET_WEBVIEW_DERIVED_DATA' }),
                navigation.navigate('WebView'))
              : null;
          }
        })
      : null;
    return () => {
      Utils.socket.off('messageDirectPrivate');
    };
  }, [socketId]);



  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Stack.Navigator
        screenOptions={{
          header: ()=>(null),
        }}
      >
          {/* <Stack.Screen name="WebView" component={ConsultEaseWebview} /> */}
          <Stack.Screen name="CallerAgoraUI" component={CallerAgoraUI}/>
          {/* <Stack.Screen name="CalleeAgoraUI" component={CalleeAgoraUI}/> */}
          <Stack.Screen name="VideoCallerPrompt" component={VideoCallerPromptScreen} />
          <Stack.Screen name="VideoCalleePrompt" component={VideoCalleePromptScreen} />
          <Stack.Screen name="CallRating" component={CallRatingScreen} />
      </Stack.Navigator>
    </SafeAreaView>
  );
}

export default App;
