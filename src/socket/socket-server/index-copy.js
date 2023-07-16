
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

// // Enable CORS for all origins
// app.use(cors());  //added when socket connection wasn't successful 

// const useFetch = require('./hooks/useFetch');
// const { get, post } = useFetch('https://callingserver.onrender.com/api/v1/');
// const postSocket = require('./hooks/postSocket');

//   io.on('connection', (socket) => {
//     console.log('Client socket connected with socket.id:', socket.id);

//     socket.on('disconnect', () => {
//       console.log('Socket disconnected:', socket.id);
//       //postSocket(profileData, '', post);    //second arg is socketId set to empty '' when user is offline.
//     });

//     socket.on('consultease_profile_data', (profileData) => {
//       console.log('Received consultease profile ID:', profileData);
  
//       if(profileData.profileID !== null && profileData !== undefined && profileData !== ""){
//         //postSocket(profileData, socket.id, post);
//       } else{
//         console.log(`consultease_profile_id ${profileData} not sent/set to database for socketID:`,socket.id)
//       }
//     });
  
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


