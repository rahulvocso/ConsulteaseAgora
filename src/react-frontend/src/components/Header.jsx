import {
  IonBackButton,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonCardSubtitle,
  IonButtons,
  IonButton,
  IonLabel,
  IonIcon,
  IonModal,
  IonNote,
  IonRow,
  useIonModal,
  IonSearchbar,
} from '@ionic/react';
import {useEffect, useState} from 'react';
import {
  walletOutline,
  arrowBackOutline,
  closeOutline,
  checkmarkOutline,
  ellipsisVertical,
  searchCircle,
  search,
} from 'ionicons/icons';
import {useHistory, Link} from 'react-router-dom';
import verified_c from '../theme/assets/verified.svg';
import rupeeSign from '../theme/assets/rupeeSign.svg';

import './Header.css';
import useFetch from '../hooks/useFetch';

export const Header = ({
  profile,
  type = '',
  title = '',
  handleLeft = null,
  handleRight = null,
  pageRef,
  isOnline,
}) => {
  const history = useHistory();
  const {get, loading} = useFetch('https://callingserver.onrender.com/api/v1/');
  const auth_token = localStorage.getItem('auth_token');
  const [balance, setBalance] = useState('***');
  
  type === 'home' &&
    balance === '***' &&
    get(`wallet/getWallet`, {
      //set wallet_id empty for default user profile
      auth_token: auth_token,
    }).then(data => {
      setBalance(data.body.balance);
      console.log("auth_token",auth_token);
      console.log("data.body._id",data.body._id,);
    }).catch(error => {
      console.error("Error occurred during API call:", error);
      // Handle error here
    });

  return (
    <>
      <IonHeader>
        {type === 'profile' && (
          <IonToolbar className="profileHeader">
            <IonButtons slot="start">
              <IonButton onClick={() => history.goBack(-1)}>
                <IonIcon color="dark" size="small" icon={arrowBackOutline} />
              </IonButton>
            </IonButtons>
            {title && (
              <div>
                <div>
                  <IonTitle className="profileTitle" slot="start">
                    {title}
                  </IonTitle>
                  <IonCardSubtitle color={isOnline ? 'primary' : 'medium'}>
                    {isOnline ? `(Online)` : '(Offline) '}
                  </IonCardSubtitle>
                </div>

                <IonIcon
                  slot="start"
                  color="primary"
                  size="small"
                  icon={verified_c}
                />
              </div>
            )}
            <IonButtons slot="end">
              <IonButton onClick={handleRight}>
                <IonIcon size="small" icon={ellipsisVertical} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        )}
        {type === 'account' && (
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={handleLeft}>
                <IonIcon color="dark" size="large" icon={closeOutline} />
              </IonButton>
            </IonButtons>
            {title && (
              <>
                <IonTitle className="profileTitle" slot="start">
                  {title}
                </IonTitle>
              </>
            )}
            <IonButtons slot="end">
              <IonButton onClick={handleRight}>
                <IonIcon color="primary" size="large" icon={checkmarkOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        )}

        {type === 'accountwizard' && (
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={e => history.go(-1)}>
                <IonIcon color="dark" size="small" icon={arrowBackOutline} />
              </IonButton>
            </IonButtons>
            {title && (
              <>
                <IonTitle className="profileTitle" slot="start">
                  {title}
                </IonTitle>
              </>
            )}
            <IonButtons slot="end">
              <IonButton onClick={handleRight}>
                <IonIcon color="primary" size="large" icon={checkmarkOutline} />
              </IonButton>
            </IonButtons>
          </IonToolbar>
        )}

        {type === 'general' && (
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={handleLeft}>
                <IonIcon color="dark" size="large" icon={closeOutline} />
              </IonButton>
            </IonButtons>
            {title && (
              <>
                <IonTitle className="profileTitle" slot="start">
                  {title}
                </IonTitle>
              </>
            )}
          </IonToolbar>
        )}
        {type === 'home' && (
          <IonToolbar className='homeHeader'>
            <IonTitle slot='start'>ConsultEase</IonTitle>
            {/* <IonSearchbar
            color='#3DB271'
            showClearButton="focus"
            animated
            placeholder="Search people..."
            onClick={() => {
              history.push('/search');
              //pageRef.current.display = 'none';
            }}></IonSearchbar> */}
            <IonButton
            slot='end'
             onClick={() => {
              history.push('/search');
              //pageRef.current.display = 'none';
            }}
            > 
            <IonIcon icon={search}></IonIcon>
            </IonButton>
          
            <IonButton
            slot='end'
              onClick={() => {
                history.push('/wallet');
              }}>
              <IonLabel>₹{balance}</IonLabel>
              <IonIcon icon={walletOutline} />
            </IonButton>
          </IonToolbar>
        )}
        {type === 'videoCall' && (
          <IonToolbar>
            <IonButtons slot="start">
              <IonButton onClick={() => history.goBack(-1)}>
                <IonIcon color="dark" size="small" icon={arrowBackOutline} />
              </IonButton>
            </IonButtons>
            {title && <IonTitle slot="start">{title}</IonTitle>}
          </IonToolbar>
        )}
      </IonHeader>
    </>
  );
};

export default Header;
