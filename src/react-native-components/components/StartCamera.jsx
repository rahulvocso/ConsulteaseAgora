import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import CameraStream from './CameraStream';

const StartCamera = ({isCameraViewOn, setIsCameraViewOn}) => {
  const [isCamOn, setIsCamOn] = useState(false);

  return (
    <View>
      {/* <Text>Inside ./src/StartCamera.js h1 element top</Text> */}
      {!isCamOn ? (
        <TouchableOpacity
          onPress={() => {
            setIsCamOn(!isCamOn);
          }}
          style={{
            padding: 20,
            width: 400,
            backgroundColor: '#6751ff',
            alignItems: 'center',
          }}>
          <Text style={{fontSize: 20, color: 'white'}}>StartCamera temp</Text>
        </TouchableOpacity>
      ) : (
        <CameraStream
          isCameraViewOn={isCameraViewOn}
          setIsCameraViewOn={setIsCameraViewOn}
        />
      )}
    </View>
  );
};

export default StartCamera;
