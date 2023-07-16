/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState, useRef, useEffect, Component} from 'react';
import type {PropsWithChildren} from 'react';
import {
  AppRegistry,
  Platform,
  SafeAreaView,
  ScrollView,
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';

import Immersive from 'react-native-immersive';

import ConsultEaseWebView from './ConsultEaseWebview.jsx';
import CameraStream from './CameraStream.jsx';





// type SectionProps = PropsWithChildren<{
//   title: string;
// }>;

// function Section({children, title}: SectionProps): JSX.Element {
//   const isDarkMode = useColorScheme() === 'dark';
//   return (
//     <View style={styles.sectionContainer}>
//       <Text
//         style={[
//           styles.sectionTitle,
//           {
//             color: isDarkMode ? Colors.white : Colors.black,
//           },
//         ]}>
//         {title}
//       </Text>
//       <Text
//         style={[
//           styles.sectionDescription,
//           {
//             color: isDarkMode ? Colors.light : Colors.dark,
//           },
//         ]}>
//         {children}
//       </Text>
//     </View>
//   );
// }

function WebViewHolder( { setIsCallViewOn } ): JSX.Element {
  const [calleeDetails, setCalleeDetails] = useState();
  const tempCam = useRef(false);
  const webviewRef = useRef();
  // useEffect(() => {
  //   if (isCameraViewOn) {
  //     // Call the Hooks that should only be used when the camera view is on
  //   } else {
  //     // Call the Hooks that should only be used when the camera view is off
  //     setIsCameraViewOn(tempCam.current);
  //   }
  // }, [tempCam.current, isCameraViewOn]);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  // function sendDataToWebView() {
  //   webviewRef.current.postMessage('Data from React Native App');
  // }

//   function alert(arg0: string) {
//     throw new Error('Function not implemented.');
//   }

  useEffect(() => {
    Immersive.on();
    return () => {
      Immersive.off();
    };
  });

  return (
    <SafeAreaView style={backgroundStyle.backgroundColor}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardDismissMode="on-drag"
        nestedScrollEnabled={true}
        overScrollMode="auto"
        style={{
          width: useWindowDimensions().width,
          height: useWindowDimensions().height,
          backgroundColor: isDarkMode ? Colors.black : Colors.white,
        }}>
        {/* <Header /> */}
        <View
          style={{
            flex: 1,
            // width: useWindowDimensions().width,
            // height: useWindowDimensions().height,
            // backgroundColor: isDarkMode ? Colors.black : Colors.white,
          }}>
          {/* {isCallViewOn ? (
            <CameraStream
              calleeDetails={calleeDetails}
              isCallViewOn={isCallViewOn}
              setIsCallViewOn={setIsCallViewOn}
            />
          ) : ( */}
            <ConsultEaseWebView
              setIsCallViewOn={setIsCallViewOn}
              setCalleeDetails={setCalleeDetails}
            />
          {/* )} */}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  webview: {
    flex: 1,
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

export default WebViewHolder;