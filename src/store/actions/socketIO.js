import { io } from 'socket.io-client';
import Utils from '../../utils/index.js';
import config from '../../../config.js';
import useFetch from '../../hooks/useFetch.js';
const { get, post } = useFetch('https://callingserver.onrender.com/api/v1/');
import postSocket from './postSocket.js';

const setupSocket = (consulteaseUserProfileData) => (dispatch) => {
  const profileData = {
    'profileId': consulteaseUserProfileData._id,
    'auth_token': consulteaseUserProfileData.auth_token,
  }
  if(!Utils.socket){
    Utils.socket = io(config.socketServerUrl,
      { 
        transports: ['websocket', 'polling'], // Explicitly set the transports to use WebSocket
        autoConnect: true,
        'Access-Control-Allow-Origin': '*'
      });
    
    console.log('socket-client file code ran, socket =', Utils.socket)

    Utils.socket.on('connect', () => {
      Utils.logger.info('Socket connected SUCCESS !!!');
      dispatch({type: 'SET_SOCKET_ID', payload: Utils.socket.id})
      if(Object.keys(profileData).length !== 0){
        postSocket(profileData, Utils.socket.id, post);
        Utils.socket.emit('consultease_user_profile_data', profileData);
      }
    });

    Utils.socket.on('welcome', ((socketId) => {
      console.log('"Welcome" msg from server, SocketID',socketId)
    }));

    // Error event listeners
    Utils.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
    
    Utils.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
    
    Utils.socket.on('connect_timeout', (timeout) => {
      console.error('Socket connection timeout:', timeout);
    });
    
    Utils.socket.on('reconnect', (attemptNumber) => {
      console.log('Reconnected to the server (attempt', attemptNumber, ')');
      if(Object.keys(profileData).length !== 0){
        Utils.socket.emit('consultease_user_profile_data', profileData);
      }
    });
    
    Utils.socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });
    
    Utils.socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed');
    });

    Utils.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected !!!', reason);
      Utils.socket.
      Utils.socket.connect();
    });
    
    // Automatic reconnection/retry options
    // Utils.socket.io.reconnectionAttempts(5); // Number of attempts to reconnect
    // Utils.socket.io.reconnectionDelay(1000); // Delay in milliseconds between reconnection attempts
    // Utils.socket.io.reconnectionDelayMax(5000); // Maximum delay between reconnection attempts

    const disconnectSocket = () => {
      Utils.socket.disconnect()
    }
  }
}

export default setupSocket;




// import io from 'socket.io-client';
// import Utils from '../../utils';
// import config from '../../../config';
// import store from '../../store';

// const setupSocket = () => (dispatch) => {
//   // Utils.socket && Utils.logger.error('socket connected status', Utils.socket.connected);

//   if (!Utils.socket) {
//     Utils.socket = io(config.url, { autoConnect: false, 'Access-Control-Allow-Origin': '*' }); //transports: ['websocket']

//     Utils.socket.request = (type, data = {}) => {
//       return new Promise((resolve) => {
//         Utils.socket.emit(type, data, resolve);
//       });
//     };

//     Utils.socket.on('welcome', (serverSocketId) => {
//       if (serverSocketId === Utils.socket.id) {
//         Utils.logger.info('socket.io connected', serverSocketId);
//         dispatch({ type: 'socket', id: serverSocketId });
//         dispatch({ type: 'snack', severity: 'success', content: 'connected to server' });
//         const { uuid } = store.getState().media;
//         Utils.socket.emit('uuid', uuid);
//       } else {
//         Utils.logger.error('socket.io ids mismatch', serverSocketId, Utils.socket.id);
//         dispatch({ type: 'snack', severity: 'error', content: 'could not connect to server' });
//       }
//     });

//     Utils.socket.on('reload', () => {
//       window.location.reload();
//     });

//     Utils.socket.on('producer', async (data) => {
//       Utils.logger.info('new producer', data);
//       const { device, transports, uuid } = store.getState().media;
//       const { key } = store.getState().meeting;
//       const params = await Utils.socket.request('consume', {
//         producerId: data.id,
//         uuid,
//         rtpCapabilities: device.rtpCapabilities,
//         key,
//       });
//       const consumer = await transports.consumer.consume(params);
//       const stream = new MediaStream();
//       stream.addTrack(consumer.track);
//       await Utils.socket.request('resume', { consumerId: consumer.id, key });

//       dispatch({
//         type: 'new-producer',
//         producer: data,
//         consumer,
//         stream,
//       });
//     });

//     Utils.socket.on('message', (data) => {
//       const { uuid } = store.getState().media;
//       if (uuid !== data.uuid) {
//         Utils.logger.info('message', data);
//         dispatch({
//           type: 'message',
//           message: data,
//         });
//       }
//     });

//     // added by rahul to sent private message to any socket_id
//     Utils.socket.on('connection', (socket) => {
//       socket.on('private_message', ({ to, messageData }) => {
//         socket.to(to).emit('private_message', { from: socket.id, messageData });
//       });
//     });

//     Utils.socket.on('producer-close', async (data) => {
//       dispatch({
//         type: 'producer-close',
//         uuid: data.uuid,
//         kind: data.kind,
//       });
//     });

//     Utils.socket.on('peers', async (data) => {
//       dispatch({ type: 'peers', peers: data.peers });
//     });

//     Utils.socket.on('connect_error', (e) => {
//       Utils.logger.error('socket.io could not connect to server', e);
//       dispatch({ type: 'snack', severity: 'error', content: 'could not connect to server' });
//     });

//     Utils.socket.connect();
//   }
// };

// export default setupSocket;
