import React, {useState, useRef, useEffect} from 'react';
import {
  AppRegistry,
  Platform,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Dimensions,
  useWindowDimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { WebView } from 'react-native-webview';
import ConsultaseLogo from '../../assets/images/app-logo.png';
import NetworkStatus from './NetworkStatus'


function ConsultEaseWebview({setIsCallViewOn, setCalleeDetails}) {
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const deviceWidth = Dimensions.get('window').width; //useWindowDimensions().width;
  const deviceHeight = Dimensions.get('window').height; //useWindowDimensions().height;

  const [isNetConnected, setIsNetConnected] = useState(false)
  const [renderedOnce, setRenderedOnce] = useState(false);
  const webviewRef = useRef();
  const unsubscribeRef = useRef(null);
  const isDarkMode = useColorScheme() === 'dark';

  const isCallViewOn = useSelector(state => state.webview.isCallViewOn);


  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  function alert(arg0) {
    throw new Error('Function not implemented.');
  }

  // handles msg received from webview components

  function handleWebViewMessage(event){
    const message = JSON.parse(event.nativeEvent.data);
    const messageType = message.messageType;
    const messageData = message.messageData;
    console.log("message received" ,message ,messageType)
    // Use the messageType to distinguish between messages from different components
    switch (messageType) {
      case 'calleeDetails':
        {
          console.log(
            'Message received to turn camera On from ConsultEase(InputVideoCallDetails.jsx)!!!',
            "**message type**", messageType,
            "**message data**", messageData,
          );
          dispatch({ type: 'SET_CALL_VIEW_ON', payload: true });
          dispatch({ type: 'SET_CALLEE_DETAILS', payload: messageData })
          // navigation.navigate('VideoCallerPrompt');
          navigation.navigate('CallerAgoraUI')
          // dispatch({ type: 'SET_CALLEE_SOCKET_ID' ,payload: messageData.calleeSocketId})
        }
        break;
      case 'consulteaseUserProfileData':
        {
          console.log('Message received to set consulteaseUserProfileData from ConsultEase(InputVideoCallDetails.jsx)!!! \n',
            "**message type**", messageType,);
          console.log("\n**message data** \n", messageData)
          if (messageData) {
            dispatch({ type: 'SET_CONSULTEASE_USER_PROFILE_DATA', payload: messageData })
          }
        }
        break;
      default:
        // Handle messages from unknown components
        break;
    }
  }

  // useEffect(()=>{
  //   NetInfo.fetch().then((state) => {
  //     if (state.isConnected) {
  //       // webviewRef.current.reload();
  //       setIsNetConnected(true)
  //       console.log('Netconnected in Webview',true)
  //     } 
  //     else if(!state.isConnected){
  //       setIsNetConnected(false)
  //     }

  //     unsubscribeRef.current = NetInfo.addEventListener((state) => {
  //       if (state.isConnected) {
  //         webviewRef.current.reload();
  //         setIsNetConnected(true)
  //       } 
  //       else if(!state.isConnected){
  //         setIsNetConnected(false)
  //       }
  //     });
  //   })
  //   return(()=>{
  //     unsubscribeRef.current();
  //   })
  // },[])
  
  // const sendMessageToWebview = `
  //   import {useHistory} from 'react-router';
  //   const lastRoutes = ['videocall','/videocall'];
  //   const history = useHistory();
  //   console.log('****injeting js in webview to change route from videocall to profile')
  //   lastRoutes.includes(history.location.pathname) && history.push('profile');
  // `;

  // const runScript = `
  // // document.body.style.backgroundColor = 'red';
  // // setTimeout(function() { window.alert('hi') }, 2000);
  // true; // note: this is required, or you'll sometimes get silent failures
  // `;

  // const sendMessageToWebview = () => {
  //   const message = 'webview in view checking last screen if its /videocall';
  //   const runCode = `window.postMessage('${message}', '*');`;
  //   webviewRef.current.injectJavaScript(runCode);
  // };


  // useEffect(() => {
  //   webviewRef.current.postMessage(`window.postMessage('${'messageFromWebviewContainer'}', '*');`);
  // }, []);

  const styles = StyleSheet.create({
    webview: {
      flex: 1,
    },
    noConnectionPage: {
      position: 'absolute',
      color: 'white',
      border: 2,
      borderColor: 'red',
      height: deviceHeight,
      width: deviceWidth,
      // top: '40%',
      // backgroundColor: '#3DB271',
    },
    noConnectionContainer: {
      flex: 1,
      justifyContent : 'center',
      alignItems: 'center',
      backgroundColor: '#3DB271',
      width: '100%',
      border: 2,
      borderColor: 'red',
    },
    consulteaseLogo: {
      width: deviceWidth/2,
      height: deviceHeight/4,
      objectFit: "contain",
      marginBottom: 10,
    },
    noConnectionText1: {
      fontSize: 25,
      marginBottom: 10
    },
    noConnectionText2: {
      fontSize: 15,
      marginBottom: 50,
    },
    sectionContainer: {
      marginTop: 32,
      paddingHorizontal: 24,
    },
    sectionTitle: {
      fontSize: 24,
      fontWeight: '600',
    },
    sectionDescription: {
      marginTop: 8,
      fontSize: 18,
      fontWeight: '400',
    },
    highlight: {
      fontWeight: '700',
    },
  });


  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center', justifyContent: 'center',
        // width: useWindowDimensions().width,backgroundColor: '#3DB271',
        // height: useWindowDimensions().height,
        backgroundColor: isDarkMode ? (isNetConnected ? Colors.black : '#3DB271') : Colors.white,
      }}>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        //injectedJavaScript={runScript}
        source={
          // renderedOnce
          //   ? 
          {
            // uri: 'http://10.0.2.2:3056',
            // uri: 'http://192.168.0.138:3056',
            // uri: 'https://vocso.com',
            // uri: 'https://super-cajeta-000cea.netlify.app'
            uri: 'https://consultease-webview.netlify.app'
            // uri: 'https://consultease.netlify.app' // https://consultease-webview.netlify.app
          }
            // : undefined
        }
        style={{ 
          flex: 1,
          minWidth: useWindowDimensions().width,
          maxHeight: useWindowDimensions().height,
          borderRadius: 1,
          borderBottomColor: '#396967',
        }}
        allowsBackForwardNavigationGestures
        allowsInlineMediaPlayback
        allowFileAccess={true}
        allowUniversalAccessFromFileURLs={true}
        allowFileAccessFromFileURLs={true}
        allowsFullscreenVideo
        domStorageEnabled={true}
        javaScriptEnabled
        javaScriptEnabledAndroid={true}
        // onError={(syntheticEvent) => {
        //   const { nativeEvent } = syntheticEvent;
        //   console.warn('WebView error: ', nativeEvent);
        //   reloadWebviewOnConnectionChange();
        // }}
        // onLoad={updateSource}
        onMessage={ (event) => handleWebViewMessage(event) }
        scalesPageToFit={true}
        scrollEnabled={true}
        showsHorizontalScrollIndicator={false}
      />
      { !!!isNetConnected
        ?
        // no internet connection screen view
        <View style={styles.noConnectionPage}>
          <View style={styles.noConnectionContainer}>
            <Image
              style={styles.consulteaseLogo}
              source={ConsultaseLogo}
            />
            <Text style={styles.noConnectionText1}>
              Oops!!! looks like you're not connected to internet &#127760; 
            </Text>
            <Text style={styles.noConnectionText2}>
              Please check your internet connection 
            </Text>
          </View>
        </View>
        :null
      }
      <NetworkStatus
        isNetConnected={isNetConnected}
        setIsNetConnected={setIsNetConnected}
        webviewRef ={webviewRef}
      />
    </View>
  );
}

export default ConsultEaseWebview;
