
import { setupIonicReact } from '@ionic/react';
import { Redirect, Route, useHistory,withRouter } from 'react-router-dom';
import { IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { personCircle, personCircleOutline } from 'ionicons/icons';
import homeOutline_c from './theme/assets/homeNew.svg';
import history_c from './theme/assets/historyOutline.svg';
import wallet_c from './theme/assets/wallet.svg';

import Home from './pages/Home';
import Profile from './pages/Profile';
import Tab1 from './pages/Tab1';
import Tab2 from './pages/Tab2';
import Login from './pages/Login';




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
import { useEffect, useState } from 'react';
import InfiniteScrollExample from './pages/InfiniteScrollExample';

const App = () => {
  setupIonicReact({
    mode: 'md'
  });

  const tabs = [

    {
      name: "Home",
      url: "/home",
      activeIcon:homeOutline_c,
      icon: homeOutline_c,
      component: Home
    },
    {
      name: "Inbox",
      url: "/inbox",
      activeIcon: history_c,
      icon: history_c,
      component: Tab2
    },
    {
      name: "Wallet",
      url: "/notifications",
      activeIcon: wallet_c,
      icon: wallet_c,
      component: Tab1
    },
    {
      name: "Account",
      url: "/account",
      activeIcon: personCircleOutline,
      icon: personCircleOutline,
      component: InfiniteScrollExample
    }
  ];

  const [ activeTab, setActiveTab ] = useState(tabs[0].name);

  const history = useHistory();

  useEffect(()=>{

    if (localStorage.getItem("auth_token")==="")
      history.push("/login");
  

  },[])


  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs onIonTabsDidChange={ e => setActiveTab(e.detail.tab) }>
          <IonRouterOutlet>

            { tabs.map((tab, index) => {

              return (

                <Route key={ index } exact={true} path={ tab.url } component={tab.component}/>
              );
            })}
            
               <Redirect exact={true} from="/" to="/home" />
               <Route exact={true} path="/login" component={Login} />
               <Route exact={true} path="/profile" component={Profile} />
               <Route exact={true} path="/profile/:id" component={Profile} />
           
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            { tabs.map((tab, barIndex) => {

              const active = tab.name === activeTab;

              return (

                <IonTabButton key={ `tab_${ barIndex }` } tab={ tab.name } href={ tab.url }>
                  <IonIcon icon={ active ? tab.activeIcon : tab.icon } />
                </IonTabButton>
              );
            })}
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
}


export default withRouter(App);