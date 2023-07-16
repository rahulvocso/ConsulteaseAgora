// import React, {useEffect, useState} from 'react'
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';

// import useFetch from '../hooks/useFetch'

function getSocket(userId, socketId, auth_token, get) {
    // const socketId = useSelector(state => state.socket.id);
    // const consulteaseUserProfileData = useSelector(
    //     (state) => state.webview.consulteaseUserProfileData,
    //   );
    // const [get ] = useFetch('https://callingserver.onrender.com/api/v1/')

    socketId ? get(`user/getSocket?&user_id=${userId}`, {
        // get socketId of user with user_id if available(online)
        auth_token: auth_token,
      }).then(data => {
        console.log("getSocket.js, data", data);
        if (data.status == 200){
            console.log("******Successful        getSocket.js socket_id Get req 200 ******* data.body //n",data.body)
         } else {
            console.log("******Unsuccessfull     getSocket.js socket_id Get req *******", data)
         }
      }).catch((error) => {
        console.error('Error occurred during API call: getSocket.js', error);
        // Handle error here
      })
      :
      null

    return null;
}

export default getSocket;
