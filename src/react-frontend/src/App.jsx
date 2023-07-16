import React, { useEffect, useState, useRef } from 'react';
import {setupIonicReact} from '@ionic/react';
import {Redirect, Route, useHistory, withRouter} from 'react-router-dom';
import {
  IonApp,
  IonIcon,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  IonContent,
} from '@ionic/react';
import {IonReactRouter} from '@ionic/react-router';

// import {Immersive} from 'react-native-immersive';

import {personCircle, personCircleOutline} from 'ionicons/icons';
import homeOutline_c from './theme/assets/homeNew.svg';
import history_c from './theme/assets/historyOutline.svg';
import wallet_c from './theme/assets/wallet.svg';

import Home from './pages/Home';
import Profile from './pages/Profile';
import Inbox from './pages/Inbox';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import ImageUploadTest from './pages/ImageUploadTest';
import PersonalInfo from './pages/PersonalInfo';
import ProfessionalInfo from './pages/ProfessionalInfo';
import ProfessionalCategories from './pages/ProfessionalCategories';
import ProfessionalSwitch from './pages/ProfessionalSwitch';
import ProfessionalServiceRates from './pages/ProfessionalServiceRates';
import ProfessionalAvailability from './pages/ProfessionalAvailability';
import Login from './pages/Login';
import VideoCall from './components/VideoCall';
import VideoCallTest from './components/VideoCallTest';

import VideoCallReview from './components/VideoCallReview';
import HomeSearchResults from './components/HomeSearchResults';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import './theme/floating-tab-bar.css';
import './theme/common.css';
import InfiniteScrollExample from './pages/InfiniteScrollExample';
import PreviewSlides from './pages/PreviewSlides';

import useFetch from './hooks/useFetch';
import InputVideoCallDetails from './components/InputVideoCallDetails';
// import CameraStream from './components/CameraStream';

const App = () => {
  setupIonicReact();
  const auth_token = localStorage.getItem('auth_token');
  const {get, loading} = useFetch('http://localhost:5151/api/v1/');
  const [userId, setUserId] = useState();
  let id = '';

  const tabs = [
    {
      name: 'Home',
      url: '/home',
      activeIcon: homeOutline_c,
      icon: homeOutline_c,
      component: Home,
    },
    {
      name: 'Inbox',
      url: '/inbox',
      activeIcon: history_c,
      icon: history_c,
      component: Inbox,
    },
    {
      name: 'Wallet',
      url: '/wallet',
      activeIcon: wallet_c,
      icon: wallet_c,
      component: Tab1,
    },
    {
      name: 'Account',
      url: '/profile',
      activeIcon: personCircleOutline,
      icon: personCircleOutline,
      component: Profile,
    },
  ];

  const [activeTab, setActiveTab] = useState(tabs[0].name);

  const history = useHistory();

  //page to open when a user calls user2 ,after call disconnect/fail/success return to same page
  // In the JavaScript code of the React website

  window.addEventListener("message", (event) => {
    const message = event.data;

    if (message === "navigateToPage") {
      // Perform the necessary actions to navigate to page 2
      // For example, using React Router:
      // import { useHistory } from "react-router-dom";
      // const history = useHistory();
      // history.push("/page2");
    }
  });


  useEffect(() => {
    if (localStorage.getItem('auth_token') === '') {
      history.push('/previewslides');
    }
    setupIonicReact({
      mode: 'md',
    });
  }, [activeTab]);

  useEffect(()=>{
    const lastRoutes = ['videocall','/videocall'];
    console.log('*****history.location.pathname',history.location.pathname)
    if(lastRoutes.includes(history.location.pathname)){
      history.push('profile');
    }
  },[])
  
  return (
    <IonApp>
      <IonReactRouter>
        <IonRouterOutlet>
          <Route exact path="/previewslides">
            <PreviewSlides />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          {/* <Route exact path="/videocall1">
            <CameraStream />
          </Route> */}
          <Route exact path="/videocall">
            <InputVideoCallDetails />
          </Route>
          <Route exact path="/videocallreview">
            <VideoCallReview />
          </Route>
          <IonContent>
            <IonTabs onIonTabsDidChange={e => setActiveTab(e.detail.tab)}>
              <IonRouterOutlet>
                {tabs.map((tab, index) => {
                  return (
                    <Route key={index} exact path={tab.url}>
                      <tab.component />
                    </Route>
                  );
                })}

                <Route exact path="/">
                  <Redirect to="/home" />
                </Route>
                <Route exact path="/home">
                  <Home />
                </Route>
                <Route exact path="/search">
                  <HomeSearchResults />
                </Route>
                <Route exact path="/procats">
                  <ProfessionalCategories />
                </Route>

                <Route exact path="/profile">
                  <Profile />
                </Route>
                <Route exact path="/professionalinfo">
                  <ProfessionalInfo />
                </Route>
                <Route exact path="/personalinfo">
                  <PersonalInfo />
                </Route>
                <Route exact path="/professionalswitch">
                  <ProfessionalSwitch />
                </Route>
                <Route exact path="/professionalservicerates">
                  <ProfessionalServiceRates />
                </Route>
                <Route exact path="/professionalavailability">
                  <ProfessionalAvailability />
                </Route>
                <Route exact path="/profile/:id">
                  <Profile />
                </Route>
              </IonRouterOutlet>
              <IonTabBar id="ionTabsBar" slot="bottom">
                {tabs.map((tab, barIndex) => {
                  const active = tab.name === activeTab;
                  return (
                    <IonTabButton
                      key={`tab_${barIndex}`}
                      tab={tab.name}
                      href={tab.url}>
                      <IonIcon icon={active ? tab.activeIcon : tab.icon} />
                    </IonTabButton>
                  );
                })}
              </IonTabBar>
            </IonTabs>
          </IonContent>
        </IonRouterOutlet>
      </IonReactRouter>
    </IonApp>
  );
};

export default withRouter(App);
