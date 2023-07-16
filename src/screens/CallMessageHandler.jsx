import React, {useState, useEffect} from 'react';


const CallMessageHandler = () => {
useEffect(() => {
    socketId !== null || undefined
      ? Utils.socket.on('messageDirectPrivate', (messageData) => {
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



  return null;
}