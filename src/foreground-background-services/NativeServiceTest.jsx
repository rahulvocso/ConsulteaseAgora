// // import React, { useEffect } from 'react';
// // import BackgroundFetch from 'react-native-background-fetch';
// // import BackgroundActions from 'react-native-background-actions';
// // import NetInfo from '@react-native-community/netinfo';
// // import { View, Text, TouchableOpacity } from 'react-native';

// // const TASK_ID = 'internetCheckTask';

// // const options = {
// //   taskName: 'Internet Check Task',
// //   taskTitle: 'Internet Check Task',
// //   taskDesc: 'Checking internet connection every 10 seconds',
// //   taskIcon: {
// //     name: 'ic_launcher',
// //     type: 'mipmap',
// //   },
// //   color: '#ffffff',
// //   parameters: {
// //     delay: 10000, // 10 seconds
// //   },
// // };


// // //component
// // const NativeServiceTest = () => {

// //   // useEffect(() => {
// //   //   BackgroundFetch.registerHeadlessTask(internetCheckTask);
// //   //   startForegroundService();
// //   // }, []);

// //   const internetCheckTask = async (taskData) => {
// //     const isConnected = await NetInfo.isConnected.fetch();
// //     if (isConnected) {
// //       // App is connected to internet, wake the app in the background
// //       BackgroundActions.stop(TASK_ID);
// //       // You can use a custom event name and handle it in your app
// //       BackgroundFetch.finish(taskData.taskId);
// //     }
// //   };

// //   const startForegroundService = async () => {
// //     const isBackgroundActionsAvailable = await BackgroundActions.isAvailable();
// //     if (isBackgroundActionsAvailable) {
// //       try {
// //         await BackgroundActions.start(options, internetCheckTask);
// //         console.log('Foreground service started successfully.');
// //         // api post request to update socket id
// //       } catch (e) {
// //         console.log('Error starting foreground service: ', e);
// //       }
// //     } else {
// //       console.log('BackgroundActions is not available.');
// //     }
// //   };

// //   return(
// //     <View>
// //       <TouchableOpacity  
// //         onPress={()=>{
// //           BackgroundFetch.registerHeadlessTask(internetCheckTask);
// //           startForegroundService();
// //         }}
// //         style={{flex:1, justifyContent: 'center'}}
// //       >
// //         <Text 
// //           style={{
// //             backgroundColor: 'blue',
// //             // height: 30,
// //             top: 50,
// //             padding: 10,
// //             paddingBottom: 10,
// //             textAlign: 'center',
// //             borderRadius: 20,
// //           }}
        
// //         >
// //           Start
// //         </Text>
// //       </TouchableOpacity>
// //     </View>
// //   );
// // }

// // export default NativeServiceTest;



// import React, { useEffect } from 'react';
// import BackgroundFetch from 'react-native-background-fetch';
// import BackgroundActions from 'react-native-background-actions';
// import NetInfo from '@react-native-community/netinfo';
// import { View, Text, TouchableOpacity, NativeModules, AppState, Platform } from 'react-native';

// const TASK_ID = 'internetCheckTask';
// const BG_FETCH_TASK = 'backgroundFetchTask';

// const options = {
//   taskName: 'Internet Check Task',
//   taskTitle: 'Internet Check Task',
//   taskDesc: 'Checking internet connection every 10 seconds',
//   taskIcon: {
//     name: 'ic_launcher',
//     type: 'mipmap',
//   },
//   color: '#ffffff',
//   parameters: {
//     delay: 10000, // 10 seconds
//   },
// };

// const { DeviceEventManager } = NativeModules;

// //component
// const NativeServiceTest = () => {

//   const internetCheckTask = async (taskData) => {
//     const isConnected = await NetInfo.isConnected.fetch();
//     if (isConnected) {
//       // App is connected to internet, wake the app in the background
//       BackgroundActions.stop(TASK_ID);
//       // You can use a custom event name and handle it in your app
//       BackgroundFetch.finish(taskData.taskId);
//     }
//   };

//   const startForegroundService = async () => {
//     const isBackgroundActionsAvailable = await BackgroundActions.isAvailable();
//     if (isBackgroundActionsAvailable) {
//       try {
//         await BackgroundActions.start(options, internetCheckTask);
//         console.log('Foreground service started successfully.');
//       } catch (e) {
//         console.log('Error starting foreground service: ', e);
//       }
//     } else {
//       console.log('BackgroundActions is not available.');
//     }
//   };

//   useEffect(() => {
//     BackgroundFetch.configure(
//       {
//         minimumFetchInterval: 15, // 15 minutes
//         stopOnTerminate: false,
//         enableHeadless: true,
//         forceAlarmManager: false,
//         startOnBoot: true,
//         requiredNetworkType: BackgroundFetch.NETWORK_TYPE_ANY,
//       },
//       async (taskId) => {
//         if (taskId === BG_FETCH_TASK) {
//           await internetCheckTask({ taskId });
//           BackgroundFetch.finish(taskId);
//         }
//       },
//       (error) => console.log('Error configuring background fetch: ', error)
//     );

//     // Register a task to execute when the app is not running (headless task).
//     BackgroundFetch.registerHeadlessTask(BG_FETCH_TASK);

//     // Start the foreground service when the component mounts.
//     startForegroundService();

//     // Add an event listener to start the foreground service when the device is rebooted.
//     DeviceEventManager.addListener('OnBootCompleted', async () => {
//       await startForegroundService();
//     });

//     // Handle app state changes to make sure the service is always running in the background.
//     const handleAppStateChange = (nextAppState) => {
//       if (nextAppState === 'active') {
//         startForegroundService();
//       }
//     };

//     AppState.addEventListener('change', handleAppStateChange);

//     return () => {
//       AppState.removeEventListener('change', handleAppStateChange);
//     };
//   }, []);

//   return(
//     <View>
//       <TouchableOpacity  
//         onPress={startForegroundService}
//         style={{flex:1, justifyContent: 'center'}}
//       >
//         <Text 
//           style={{
//             backgroundColor: 'blue',
//             top: 50,
//             padding: 10,
//             paddingBottom: 10,
//             textAlign: 'center',
//             borderRadius: 20,
//           }}
//         >
//           Start
//         </Text>
//       </TouchableOpacity>
//     </View>
//   );
// }

// export default NativeServiceTest;

