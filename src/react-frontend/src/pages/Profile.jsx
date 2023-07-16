import {
  IonItem,
  IonButton,
  IonLabel,
  IonCardSubtitle,
  IonAvatar,
  IonCol,
  IonContent,
  IonGrid,
  IonIcon,
  IonPage,
  IonRow,
  IonSegment,
  IonSegmentButton,
  IonChip,
  useIonToast,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/react';
import './Profile.css';
import {Header} from '../components/Header';
import Reviews from '../components/Reviews';
import Schedule from '../components/Schedule';
import liveStatusFromSchedule from '../components/liveStatusFromSchedule.jsx' 
import React, {useEffect, useRef, useState} from 'react';
import useFetch from '../hooks/useFetch';
import {timeOutline, starOutline, call, videocam, arrowDownCircleOutline} from 'ionicons/icons';
import {
  useRouteMatch,
  useParams,
  useLocation,
  useHistory,
} from 'react-router-dom';
import Avatar from 'react-avatar';
import {formatCallRate} from '../utils/utils';
import MenuModal from '../components/MenuModal';
import {VacationMode} from '../components/VacationMode';

const Profile = React.memo(
  () => {
    const pageRef = useRef();
    const auth_token = localStorage.getItem('auth_token');
    const {get, loading} = useFetch(
      'https://callingserver.onrender.com/api/v1/',
    ); //('http://localhost:5151/api/v1/');
    const [profile, setProfile] = useState({});
    const [segment, setSegment] = useState('Reviews');

    const params = useParams();
    const match = useRouteMatch();
    const location = useLocation();
    const [isProfileLive, setIsProfileLive] = useState(false);
    const [isOnline, setIsOnline] = useState(false);
    const history = useHistory();
    const [menuModalVisible, setMenuModalVisible] = useState(false);
    const [videoCallButtonToast] = useIonToast();

    // fetch profile
    const getData = () => {
      let id = params.id ? params.id : '';
      get('user/' + id, {auth_token: auth_token}).then(data => {
        setProfile({...data.body});
        localStorage.setItem('currentProfileInView', JSON.stringify(data.body));
        console.log('CurrentProfileInView user_id -> data.body._id',data.body._id)
        // online status
        liveStatusFromSchedule(data, setIsOnline);

        try {
          if (data.body.profile) setIsProfileLive(data.body.profile.status);
          else setIsProfileLive(false);
        } catch (e) {
          setIsProfileLive(false);
        }
      });
      profile.profile && console.log('vacationMode', profile.profile);
    }

    // menu modal on/off
    const handleMenuModal = () => {
      setMenuModalVisible(!menuModalVisible);
    };


    useEffect(() => {
      // rather than undefined, send blank to get current user profile.
      getData()
    }, [params, isOnline]);

    const handleSegmentChange = e => {
      setSegment(e.target.value);
    };

    function handleVideoCallButton(e) {
      isOnline
        ? history.push('/videocall')
        : videoCallButtonToast({
            message: profile.profile.vacation
              ? `User is not available`
              : `User is offline`,
            duration: 3000,
            position: 'top',
            cssClass: 'custom-toast',
            buttons: [
              {
                text: 'Dismiss',
                role: 'cancel',
              },
            ],
          });
    }

    const handlePageRefresh = (e) => {
      // Your refresh logic goes here
      setProfile({});
      setIsProfileLive(false)
      // auth_token ? page.pageNumber === 0 && getData() : history.push('/login');
      setTimeout(() => {
        e.detail.complete();
      }, 500);
      getData();
      }

    return (
      <IonPage ref={pageRef} className="profilePage">
        {profile.profile && (
          <Header
            type="profile"
            handleRight={handleMenuModal}
            title={profile.profile.handle}
            isOnline={isOnline}
          />
        )}

        <MenuModal
          modalVisible={menuModalVisible}
          profile_id_viewing={params.id}
          profile={profile}
          setModalVisible={setMenuModalVisible}
        />

        <IonContent fullscreen className="ion-padding ion-margin">
          <IonRefresher
            slot="fixed"
            onIonRefresh={(e)=> handlePageRefresh(e)}
            pullFactor={0.9}
          >
            <IonRefresherContent
              pullingIcon={arrowDownCircleOutline}
              pullingText="pull to refresh"
              refreshingSpinner="lines-small"
              // refreshingText="Refreshing..."
            >
            </IonRefresherContent>
          </IonRefresher>
          <IonGrid className="ion-padding-start ion-padding-end extra-padding ion-padding-bottom ion-margin-bottom">
            {/* <IonButton
              color="primary"
              shape="round"
              onclick={() => handleReactNativeCameraAccess()}>
              <IonIcon icon={videocam} />
              <IonLabel>&nbsp; VideoCall</IonLabel>
            </IonButton> */}
            <IonRow>
              <IonCol size="12">
                <div className="profile">
                  {!isProfileLive && (
                    <div className="warning">
                      Your profile is not active yet.
                      <IonButton color="primary" shape="round">
                        <IonLabel>Activate</IonLabel>
                      </IonButton>
                    </div>
                  )}

                  <div className="proDetails">
                    {profile.profile && (
                      <IonAvatar className="ProfileAvatar">
                        <Avatar
                          align="center"
                          size="80"
                          round="100px"
                          name={profile.fname}
                          src={
                            profile.profile.photo
                              ? profile.profile.photo
                              : profile.photo
                          }
                        />
                      </IonAvatar>
                    )}
                    <div className="proTitle">
                      <h3>
                        {profile.fname ? profile.fname : 'FirstName'}{' '}
                        {profile.lname ? profile.lname : 'LastName'}
                      </h3>

                      <div className="detailCount">
                        <IonIcon color="primary" icon={starOutline} />
                        {profile.stats && (
                          <span>
                            {profile.stats.rating_average} ({profile.otp} +){' '}
                          </span>
                        )}

                        <IonIcon color="primary" icon={timeOutline} />
                        {profile.stats && (
                          <span>{profile.stats.rating_average} Minutes </span>
                        )}
                      </div>
                      <br />
                      <IonCardSubtitle>
                        {profile.profile && profile.profile.title}
                      </IonCardSubtitle>
                    </div>
                  </div>
                </div>

                <div className="proTitle">
                  {profile.profile &&
                    profile.profile.categories.map((category, num) => {
                      return (
                        <IonChip key={num} outline="true">
                          {category.name}
                        </IonChip>
                      );
                    })}

                  {profile.profile && (
                    <>
                      <br />

                      <VacationMode />

                      {profile.profile.vacation ? (
                        <IonLabel color="medium"></IonLabel>
                      ) : (
                        <>
                          <IonButton
                            disabled={
                              profile.profile.vacation ? 'true' : 'false'
                            }
                            onClick={e => handleVideoCallButton(e)}
                            className="callButton"
                            color="primary"
                            shape="round">
                            <IonIcon icon={videocam} />
                            <IonLabel>
                              &nbsp;{formatCallRate(profile, 'video')}/min
                            </IonLabel>
                          </IonButton>
                          &nbsp;
                          <IonButton
                            disabled={
                              profile.profile.vacation ? 'true' : 'false'
                            }
                            className="callButton"
                            color="secondary"
                            shape="round">
                            <IonIcon icon={call} />
                            <IonLabel>
                              &nbsp;{formatCallRate(profile, 'audio')}/min
                            </IonLabel>
                          </IonButton>
                        </>
                      )}
                    </>
                  )}
                </div>
              </IonCol>
            </IonRow>
            <IonRow>
              <IonCol>
                <div className="proTitle">
                  <br />
                  <br />
                  <IonSegment
                    scrollable
                    value={segment}
                    onIonChange={e => handleSegmentChange(e)}>
                    <IonSegmentButton value="Reviews">
                      <IonLabel>Reviews</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="Schedule">
                      <IonLabel>Schedule</IonLabel>
                    </IonSegmentButton>
                    <IonSegmentButton value="About">
                      <IonLabel>About</IonLabel>
                    </IonSegmentButton>
                  </IonSegment>

                  {segment === 'Schedule' && (
                    <Schedule profilebody={profile.profile} />
                  )}
                  {/* {segment === 'Reviews' && <Reviews />} */}
                  {segment === 'About' && profile.profile && (
                    <IonLabel>
                      <br />
                      {profile.profile.description}
                      <br />
                      <br />
                      <a target="_blank" rel="noreferrer" href={profile.profile.website}>
                        {profile.profile.website}
                      </a>
                    </IonLabel>
                  )}
                </div>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
      </IonPage>
    );
  },
  () => true,
);

export default Profile;
