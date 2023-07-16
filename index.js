//import 'react-native-gesture-handler';
import { AppRegistry } from 'react-native';
import { Provider } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import notifee from '@notifee/react-native';
import App from './App';
import store from './src/store';
import { name as appName } from './app.json';

notifee.registerForegroundService(() => {
  return new Promise(() => {});
});

function Main() {
  return (
    <NavigationContainer>
        <Provider store={store}>
          <App />
        </Provider>
    </NavigationContainer>
  );
}

AppRegistry.registerComponent(appName, () => Main);
