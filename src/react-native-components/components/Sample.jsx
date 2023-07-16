

import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

const TwoButtonsComponent = () => {
  const handleButton1Press = () => {
    console.log('Button 1 pressed!');
    // Add your custom logic here for Button 1
  };

  const handleButton2Press = () => {
    console.log('Button 2 pressed!');
    // Add your custom logic here for Button 2
  };

  return (
    <View style={styles.container}>
      <Button title="Button 1" onPress={handleButton1Press} />
      <Button title="Button 2" onPress={handleButton2Press} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TwoButtonsComponent;
