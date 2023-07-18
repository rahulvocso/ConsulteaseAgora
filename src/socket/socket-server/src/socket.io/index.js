import { Server } from 'socket.io';
import useFetch from '../hooks/useFetch.js';
const { get, post } = useFetch('https://callingserver.onrender.com/api/v1/');
import postSocket from '../hooks/postSocket.js';
import callMessage from './callMessage';
import Utils from '../utils';


let previousSocketId;
const init = ({ httpServer }) => {
  Utils.io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  // Utils.io = io;

  Utils.io.on('connection', (socket) => {
    let profileDATA = {};

    Utils.logger.info(`User connected, SocketId: ${socket.id}`);
    socket.emit('welcome', socket.id);

    // callMessage propagation from peer1 to peer2
    socket.on('callMessage', (data) => callMessage({ socket, data}));

    // this function runs only one time to set previousSocketId.
    function myFunction() {
      if (!myFunction.initialized) {
        previousSocketId = socket.id;
        myFunction.initialized = true;
      }
    }
    myFunction.initialized = false;

    // periodically check for changes in socket.id
    myFunction.initialized && setInterval(() => {
      if (socket.id !== previousSocketId) {
        previousSocketId = socket.id;
        Utils.io.to(data.to).emit(
          'socketIdChanged',
        );
        if(Object.keys(profileDATA).length !== 0) {
          postSocket(profileDATA, socket.id, post);
        } else{
          Utils.logger.info(`Socket ID changed but not updated on DB`);
        }
        Utils.logger.info(`Socket ID changed: ${socket.id}`);
      }
    }, 3000);
  
    socket.on('consultease_user_profile_data', (profileData) => {
      console.log('\nReceived consultease profile data:', profileData,'\n');
      profileDATA = profileData
      if(Object.keys(profileData).length !== 0) {
        postSocket(profileData, socket.id, post);
      }
    });



    socket.on('disconnect', () => {
      console.log('profileDATA', profileDATA);
      postSocket(profileDATA, 'null', post);    //second arg is socketId set to empty '' when user is offline.
      Utils.logger.info(`User Disconnected, SocketId: ${socket.id} ${Object.keys(profileDATA).length}`);
      profileDATA = {}
    });

    socket.on('connection', () => {
      if (socket.id !== previousId) {
        if(Object.keys(profileDATA).length !== 0) {
          postSocket(profileDATA, socket.id, post);
        }
        console.log(`Socket ID changed from ${previousId} to ${socket.id}`);
      }
    });

    // Error event listeners
    socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
    });
  
    socket.on('connect_timeout', () => {
      console.error('Socket connection timeout');
    });


  });

  setTimeout(() => {
    Utils.io.emit('reload');
  }, 1000);

  Utils.logger.info('socket.io listening for events');
};

const getIO = () => {
  return Utils.io;
};

const SocketIO = {
  init,
  getIO,
};

export default SocketIO;



// const express = require('express');
// const http = require('http');
// const socketIO = require('socket.io');
// const cors = require('cors');
// const dotEnv=require("dotenv").config();

// const app = express();
// const server = http.createServer(app);
// const io = socketIO(server,  {
//   cors: {
//     origin: '*',
//   },
// });

// Enable CORS for all origins
// app.use(cors());  //added when socket connection wasn't successful 


//   io.on('connection', (socket) => {
//     console.log('Client socket connected with socket.id:', socket.id);
  
//     // socket.on('check_profile_id', (profileData) => {
//     //   if (socketMapping[profileData]) {
//     //     const socketId = socketMapping[profileData];
//     //     // Send the 'socketId' as a response
//     //     socket.emit('profile_id_found', socketId);
//     //   } else {
//     //     // Send 'user not in socket database' as a response
//     //     socket.emit('profile_id_not_found', 'user not in socket database');
//     //   }
//     // });

//     // socket.on('disconnect', () => {
//     //   console.log('Socket disconnected:', socket.id);
//     // });
  
//     // // Error event listeners
//     // socket.on('connect_error', (error) => {
//     //   console.error('Socket connection error:', error);
//     // });
  
//     // socket.on('connect_timeout', () => {
//     //   console.error('Socket connection timeout');
//     // });
  
  
//   });

// // Error handling
// io.on('error', (error) => {
//   console.error('Socket error io:', error);
// });

// io.on('connect_error', (error) => {
//   console.error('Socket connection error io:', error);
// });

// io.on('connect_timeout', (timeout) => {
//   console.error('Socket connection timeout io:', timeout);
// });

// // Start the server
// server.listen(process.env.PORT || 3002, () => {
//   console.log('Socket server running on port ',process.env.PORT);
// });



