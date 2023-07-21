import React, {useEffect, useRef, useState} from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import {StyleSheet, Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Timer from './Timer';
import AvatarSample from '../assets/images/AvatarSample.png';

const CalleeAgoraUI = () => {
    const dispatch = useDispatch()
    const navigation = useNavigation();
    const calleeDetails = useSelector(state => state.webview.calleeDetails)
    const [videoCall, setVideoCall] = useState(false);
    const [userCount, setUserCount] = useState(0);
    const agoraUIKitRef = useRef(null);
    const agoraChannel = useSelector((state)=> state.webview.agoraChannel)
    const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
    const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;
    const timerLimit = 305; //in seconds
    const callID = useSelector((state) => state.webview.callID);

    const connectionData = {
        appId: 'f917fce6942947b69d5623487404d8cf',
        channel: agoraChannel,
        tokenUrl : 'https://agora-token-server-r79c.onrender.com'
        
    };
// https://agora-token-server-r79c.onrender.com/rtc/MyChannel/1/uid/0/?expiry=300
    const rtcCallbacks = {
        EndCall: () => {
            // if (agoraUIKitRef.current) {
            //     agoraUIKitRef.current.rtcEngine().leaveChannel();
            //     agoraUIKitRef.current = null;
            // }
            setVideoCall(()=>false);
            navigation.navigate('WebView');
        },
        onJoinChannelSuccess: () => {
            setChannelJoined(true);
        },
        // onUsersJoined: () => {
        //     console.log('Users joined videocall');
        //     setUserCount((prevCount) => prevCount + 1);
        // },
        userJoined: (user) => {
            setUserCount(prevUsers => prevUsers + 1);
        },
        userOffline: (user) => {
            setUserCount(prevUsers => prevUsers - 1);
        }
        // onUsersOffline: () => {
        //     setUserCount((prevCount) => prevCount - 1);
        // },
    };

    useEffect(()=>{
        return(()=>{
            dispatch({ type: 'SET_CALL_VIEW_ON', payload: false });
            dispatch({ type: 'RESET_WEBVIEW_DERIVED_DATA' });
        })
    },[])


    // CSS
    const btnStyle = {
        borderRadius: 50,
        width: 50,
        height: 50,
        backgroundColor: '#3DB271',
        borderWidth: 0,
    };
    const remoteBtnStyle = '#3DB271';
    const styleProps = {
    //     UIKitContainer: {
    //         height: '100%',
    //         width: '100%',
    //     },
    //     iconSize: 30,
    //     theme: '#ffffffee', //#3DB271
    // //   videoMode: {
    // //     max: VideoRenderMode.Hidden,
    // //     min: VideoRenderMode.Hidden,
    // //   },
    //     overlayContainer: {
    //     backgroundColor: '#2edb8533',
    //     opacity: 1,
    //     },
        localBtnStyles: {
            muteLocalVideo: btnStyle,
            muteLocalAudio: btnStyle,
            switchCamera: btnStyle,
            endCall: {
                //borderRadius: 50,
                width: 50,
                height: 50,
                backgroundColor: '#fe0000',
                //borderWidth: 0,
            },
        },
    //     localBtnContainer: {
    //         backgroundColor: '#fff',
    //         bottom: 0,
    //         paddingVertical: 10,
    //         borderWidth: 4,
    //         borderColor: '#2edb85',
    //         height: 80,
    //     },
    //     maxViewRemoteBtnContainer: {
    //         top: 0,
    //         alignSelf: 'flex-end',
    //         },
    //         remoteBtnStyles: {
    //         muteRemoteAudio: remoteBtnStyle,
    //         muteRemoteVideo: remoteBtnStyle,
    //         remoteSwap: remoteBtnStyle,
    //         minCloseBtnStyles: remoteBtnStyle,
    //     },
        minViewContainer: {
            // bottom: 80,
            // top: 0,
            // backgroundColor: '#3DB271',
           //borderColor: '#3DB271',
            //borderWidth: 1,
            //height: '15%',
        },
    //     minViewStyles: {
    //         height: '100%',
    //     },
    //     maxViewStyles: {
    //         height: '64%',
    //     },
    //     UIKitContainer: {height: '100%'},
    }

    const styles = StyleSheet.create({
        container : {
            flex: 1,
            height: '90%',
            borderColor: 'black',
        },
        // agoraUIKit: {
        //     flex: 1,
        //     backgroundColor: '#3DB271',
        // },
        startCall: {
            backgroundColor: '#3DB271',
            padding: 10,
            textAlign: 'center',
            width: '10'
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
    })


    return (
        <View style={styles.container}>
            {console.log("calleeDetails in agoraUI",calleeDetails)}
            {agoraChannel &&
                <>
                    <AgoraUIKit
                        // sref={agoraUIKitRef}
                        styleProps={styleProps}
                        connectionData={connectionData}
                        rtcCallbacks={rtcCallbacks}
                    />
                    <Timer timerLimit={timerLimit} callId = {callID}/> 
                    {/* implement sending call data back to server after call has ended*/}
                    {/* {(userCount === 0 && !channelJoined) ?
                        <View style={styles.callPromptAvatar }>
                            <Image
                                style={{width: 80, height: 80, borderRadius: 50, objectFit: "contain"}}
                                // source={AvatarSample}
                                source={ calleeDetails.length!= 0 &&
                                    calleeDetails.photo ? {uri: calleeDetails.photo} : AvatarSample
                            }    
                            />
                            <Text style={styles.callPromptCallingName}>
                                {Object.keys(calleeDetails).length !== 0 && calleeDetails.name ? calleeDetails.name :"Name Unavailable"}
                            </Text>

                            <Text style={styles.callPromptCalling}>Calling</Text>

                            <Text style={styles.callPromptCallCategory}>
                                {Object.keys(calleeDetails).length !== 0 && calleeDetails.callCategory ? calleeDetails.callCategory : "Call Category Unavailable"}
                            </Text>
                        </View> : null
                    } */}
                </>
            }
        </View>
    )
}

export default CalleeAgoraUI;