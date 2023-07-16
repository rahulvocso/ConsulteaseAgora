import { IonApp, IonIcon, IonRouterOutlet, IonTabBar, IonTabButton, IonTabs } from '@ionic/react';
import { Route } from 'react-router-dom';

import {  useState } from 'react';

import { personCircle, personCircleOutline } from 'ionicons/icons';
import homeOutline_c from '../theme/assets/homeNew.svg';
import history_c from '../theme/assets/historyOutline.svg';
import wallet_c from '../theme/assets/wallet.svg';
import Home from '../pages/Home';
import Profile from '../pages/Profile';
import Tab1 from '../pages/Tab1';
import Tab2 from '../pages/Tab2';
import Login from '../pages/Login';
  
import InfiniteScrollExample from '../pages/InfiniteScrollExample';

const Tabs = () => {

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
return (
<IonTabs onIonTabsDidChange={ e => setActiveTab(e.detail.tab) }>
<IonRouterOutlet>
        <Route exact={true} path="/login">
            <Login />
          </Route>
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
        );
}
export default Tabs;