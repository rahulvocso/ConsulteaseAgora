import useFetch from '../hooks/useFetch';

export default function initCallDetailsGetRoom(from_user, to_user, auth_token, callCategory) {
  const callInstanceDetails = {};
  const [post] = useFetch('https://callingserver.onrender.com/api/v1/');

  post(
    'call/init',
    {
      from_user: from_user, //caller user_id
      to_user: to_user, // callee user id,
      category: callCategory,
    },
    { auth_token: auth_token },
  )
    .then((data) => {
      console.log('postSocket.js, data', data);
      if (data.status == 200) {
        //single call detail which will use _id as callid/roomid in that specific call (read bottom last comments for more)
        callInstanceDetails = data.body;
        console.log(
          '******Successful  initCallDetailsGetRoom.js call init POST req 200      *******',
        );
      } else {
        console.log(
          '******Unsuccessfull  initCallDetailsGetRoom.js  call init  POST req       *******',
        );
      }
    })
    .catch((error) => {
      console.error('Error occurred during API call: initCallDetailsGetRoom.js', error);
      // Handle error here
    });

  return callInstanceDetails;
}

// above post response example use _id as callId / roomId

// {
//   "status": 200,
//   "message": "Call initialized",
//   "body": {
//       "from_user": "639854af79cea626807688ba",
//       "to_user": "63d1112ff28107ce0b5e3343",
//       "type": "Audio",
//       "duration": 0,
//       "status": "Initiated",
//       "deleted": false,
//       "_id": "644cd8feeb9d97c21423a260"
//   }
// }
