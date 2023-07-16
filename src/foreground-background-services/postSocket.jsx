// import {useEffect, useState} from 'react'
// import { useSelector, useDispatch } from 'react-redux';
// import { useNavigation } from '@react-navigation/native';

// import useFetch from '../hooks/useFetch'

export default function PostSocket (consulteaseUserProfileData, socketId, post) {
    // const socketId = useSelector(state => state.socket.id);
    // const consulteaseUserProfileData = useSelector(
    //     (state) => state.webview.consulteaseUserProfileData,
    //   );
    
    // const [get, post] = useFetch('https://callingserver.onrender.com/api/v1/')

    socketId ? post(
        'user/setSocket',
        {
          'user_id': consulteaseUserProfileData._id, //user_id received from webview
          'socket_id': socketId, //socketId fetched from redux store
        },
        { auth_token: consulteaseUserProfileData.auth_token },
      ).then(data => {
        console.log("postSocket.js, data", data);
        if (data.status == 200){
            console.log("******Successful     postSocket.js socket_id POST req 200      *******")
         } else {
            console.log("******Unsuccessfull    postSocket.js socket_id POST req        *******")
         }
      }).catch((error) => {
        console.error('Error occurred during API call: initCallDetailsGetRoom.js', error);
        // Handle error here
      })
      :
      null
    
}















// post(
//     'user/updateUserMeta',
//     {
//       key: e.target.field,
//       value: e.target.checked,
//     },
//     {auth_token: localStorage.getItem('auth_token')},
//   ).then(data => {
//     //console.log(data);
//     if (data.status == 200)
//       presentToast({
//         message: data.message,
//         icon: checkmarkCircleOutline,
//         tramslucent: true,
//         duration: 2000,
//         color: 'primary',
//       });
//     else
//       presentToast({
//         message: data.message,
//         duration: 4000,
//         icon: warningOutline,
//         color: 'danger',
//       });
//   });