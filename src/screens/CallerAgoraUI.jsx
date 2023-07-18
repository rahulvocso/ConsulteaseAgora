import React, {useEffect, useRef, useState} from 'react';
import AgoraUIKit from 'agora-rn-uikit';
import {StyleSheet, Dimensions, Image, Text, TouchableOpacity, View} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import Utils from '../utils';
import Timer from './Timer';
import AvatarSample from '../assets/images/AvatarSample.png';


import useFetch from '../hooks/useFetch';

const CallerAgoraUI = () => {
    const { get, post } = useFetch('https://callingserver.onrender.com/api/v1/');

    const dispatch = useDispatch();
    const navigation = useNavigation();
    const calleeDetails = useSelector(state => state.webview.calleeDetails)
    const socketId = useSelector((state) => state.webview.socket.id);
    const calleeSocketId = useSelector((state)=> state.webview.calleeSocketId);
    const consulteaseUserProfileData = useSelector((state) => state.webview.consulteaseUserProfileData)

    const [videoCall, setVideoCall] = useState(true);
    const [userCount, setUserCount] = useState(0);
    const [channelJoined, setChannelJoined] = useState(false);
    const agoraUIKitRef = useRef(null);

    const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
    const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;
    const timerLimit = 305; //in seconds
    const callId = '#CallID0000000000000';

    const connectionData = {
        appId: 'f917fce6942947b69d5623487404d8cf',
        channel: 'test123',
        tokenUrl : 'https://agora-token-server-r79c.onrender.com'
        
    };

    const rtcCallbacks = {
        EndCall: () => {
            // if (agoraUIKitRef.current) {
            //     agoraUIKitRef.current.rtcEngine().leaveChannel();
            //     agoraUIKitRef.current = null;
            // }
            setVideoCall(()=>false);
            navigation.navigate('WebView');
        },
        onJoinChannelSuccess: handleJoinChannelSuccess,
        onUsersJoined: () => {
            console.log('Users joined videocall');
            setUserCount((prevCount) => prevCount + 1);
        },
        // onUsersOffline: () => {
        //     setUserCount((prevCount) => prevCount - 1);
        // },
    };

    const handleJoinChannelSuccess = () => {
        setChannelJoined(true);
    }

    useEffect(() => {
        console.log(
          "calleeDetails inside VideoCallerPrompt",
          "calleeDetails.user_id",
          calleeDetails && calleeDetails.user_id
        )
        if (socketId) {
          if (
            Object.keys(consulteaseUserProfileData).length !== 0 &&
            consulteaseUserProfileData.auth_token &&
            consulteaseUserProfileData._id &&
            calleeDetails &&
            calleeDetails.callCategory
          ) {
            getCalleeSocket() //get callee socket data    
          } 
        }
    }, [consulteaseUserProfileData, calleeDetails]);

    useEffect(() => {
        (calleeSocketId && calleeSocketId !== 'null') ? initCall() : null; // get initial call instance data
    },[calleeSocketId])


    const getCalleeSocket = async () => {
        // get callee user socket_id related data
        get(`user/getSocket?&user_id=${calleeDetails.user_id}`, {
          auth_token: consulteaseUserProfileData.auth_token,
        })
        .then((data) => {
            console.log('********* getCalleeSocket() CallerAgoraUI.js, data', data.status, data);
            if (data.status == 200) {
                data.body.status === 'Online' &&
                    (data.body.socket_id !== (null || undefined || '')) &&
                    (
                    dispatch({ type: 'SET_CALLEE_SOCKET_ID', payload: data.body.socket_id }),
                    dispatch({ type: 'SET_PEER_SOCKET_ID', payload: data.body.socket_id })
                    )
                console.log(
                    '****** Successful  CallerAgoraUI.js  getSocket() socket_id Get req 200 ******* data.body',
                    data.body._id,
                );
            } else {
                console.log(
                    '****** Unsuccessfull  CallerAgoraUI.js  getSocket() socket_id Get req ******* data',
                    data.body,
                );
            }
        })
        .catch((error) => {
            console.error('Error occurred during API call: CallerAgoraUI.js 186 getSocket.js',error);
        });
    };

    const initCall = async () => {
        await post(
            'call/init',
            {
                from_user: consulteaseUserProfileData._id, //caller user_id
                to_user: calleeDetails.user_id, // callee user id,
                category: calleeDetails.callCategory,
            },
            {   
                auth_token: consulteaseUserProfileData.auth_token
            },
        )
        .then((data) => {
            console.log('postSocket.js, data', data);
            if (data.status == 200) {
                dispatch({ type: 'SET_CALL_INSTANCE_DATA', payload: data.body });
                dispatch({ type: 'meeting-key', value: data.body._id });
                data.body._id ? dispatch({ type: 'meeting-errors-clear' }) : null;
                // send message to callee call init
                if (socketId && Utils.socket) {
                (consulteaseUserProfileData && calleeDetails) ? (
                    Utils.socket.emit("callMessage",
                        {
                            type: 'incomingVideoCall',
                            from: socketId,
                            to: calleeSocketId,
                            callInstanceData: data.body,
                            callerDetails: {
                            name: `${consulteaseUserProfileData.fname} ${consulteaseUserProfileData.lname}`,
                            callCategory: calleeDetails.callCategory,
                            photo: consulteaseUserProfileData.photo,
                            },
                        }
                ),
                console.log('****callMessage for call initiation sent to callee')
                ) : null;
                console.log('log below -> call started message event by private-socket-message')
                }
                //
                console.log(
                '******Successful  CallerAgoraUI.js  initcall() call init POST req 200      *******',
                data.body,
                ' data.body._id',
                data.body._id,
                );
            } else {
                console.log(
                '******Unsuccessfull  CallerAgoraUI.js  initcall()  call init  POST req       *******',
                );
            }
        })
        .catch((error) => {
            console.error('Error occurred during API call: CallerAgoraUI.js during initcall fetchData() line~167',error);
        });
    };

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
        callPromptInitiatingCall: {
            marginTop: 15,
            fontSize: 15,
            color: 'black',
            marginBottom: 5, 
        }
    })
    

    // useEffect(()=>{
    //     return(
    //         rtcCallbacks.EndCall()  
    //     )
    // },[])

    return (
        <View style={styles.container}>
            {console.log("calleeDetails in agoraUI",calleeDetails)}
            {/* {videoCall ? */}
                <>
                    <AgoraUIKit
                        ref={agoraUIKitRef}
                        styleProps={styleProps}
                        connectionData={connectionData}
                        rtcCallbacks={rtcCallbacks}
                    />
                    {   
                        userCount ? 
                        <Timer timerLimit={timerLimit} callId = {callId}/>
                        :
                        null
                    }
                    { (userCount <= 0) ?
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
                            {
                                !channelJoined && 
                                <Text style={styles.callPromptInitiatingCall}>initiating call, just a moment...</Text>
                            }
                        </View> : null
                    }
                </>
            {/* //     :
            //     (
            //     <TouchableOpacity style={styles.startCall}>
            //         <Text onPress={() => setVideoCall(()=>(true))}>Start Call</Text>
            //     </TouchableOpacity>
            //     )
            // } */}
        </View>
    )

}


export default CallerAgoraUI;