import {
  IonLabel,
  IonList,
  IonItem,
  IonIcon,
  IonModal,
  useIonAlert,
} from '@ionic/react';
import React, {useState, useEffect} from 'react';
import verified_c from '../theme/assets/verified.svg';
import appLogo from '../theme/assets/ce logo.png';

import useFetch from '../hooks/useFetch';
import {
  linkOutline,
  qrCodeOutline,
  alertCircleOutline,
  shareSocialOutline,
  personOutline,
  timeOutline,
  heartOutline,
  starOutline,
  logOutOutline,
  copyOutline,
} from 'ionicons/icons';
import {person, time, heart, star} from 'ionicons/icons';
import {useIonToast} from '@ionic/react';

import './MenuModal.css';
import {saveAs} from 'file-saver';
import {QRCode} from 'react-qrcode-logo';
import copyy from 'copy-to-clipboard';

import ShareProfile from './ShareProfile';

const MenuModal = ({
  modalVisible,
  profile,
  profile_id_viewing,
  setModalVisible = null,
}) => {
  const [data, setData] = useState({});
  const {post, loading} = useFetch(
    'https://callingserver.onrender.com/api/v1/',
  );
  const [isProfessional, setIsProfessional] = useState(false);
  const [qrModalVisible, setQrModalVisible] = useState(false);
  const [shareProfileModalVisible, setShareProfileModalVisible] =
    useState(false);

  const [presentAlert] = useIonAlert();

  const [presentCopyyProfileToast] = useIonToast();

  useEffect(() => {
    try {
      setIsProfessional(profile.profile.status);
      //console.log("try", isProfessional);
    } catch (e) {
      setIsProfessional(false);
      //console.log("catch", isProfessional);
    }
  }, [profile]);

  const presentModal = () => {
    // post("user/registerMobile",{"mobile":mobile})
    // .then(data=>{
    //     console.log(data);
    //     setData(data.body);
    // })
  };

  const handleShareProfile = e => {
    //"https://www.consultease.com/profile/" + profile._id
    let ShareProfileLink =
      'https://callingserver.onrender.com/api/v1/profile/' + profile._id;
    setShareProfileModalVisible(true);
  };
  
  const handleProfileLink = e => {
    copyy(`https://callingserver.onrender.com/api/v1/profile/${profile._id}`);
    presentCopyyProfileToast({
      message: `Profile link copied to clipboard  https://callingserver.onrender.com/api/v1/profile/  ${profile._id}`,
      duration: 1000,
      icon: copyOutline,
      position: 'top',
      cssClass: 'custom-toast',
      layout: 'stacked',
      buttons: [
        { 
          text: 'Dismiss',
          role: 'cancel',
        },
      ],
    });
  };

  const handleQrShow = e => {
    setQrModalVisible(true);
  };

  // to be continued from here..
  const handleQrDownload = e => {
    saveAs(e.target.href);
  };

  return (
    <div>
      {!profile_id_viewing && (
        <IonModal
          id="menuModal"
          showBackdrop="true"
          backdropDismiss="true"
          isOpen={modalVisible}
          initialBreakpoint={0.9}
          breakpoints={[0.9, 1]}
          onDidPresent={presentModal}>
          <IonList lines="none">
            <IonItem onClick={handleShareProfile}>
              <IonIcon color="dark" icon={shareSocialOutline} />
              <IonLabel>Share Profile</IonLabel>
            </IonItem>
            <IonItem onClick={handleProfileLink}>
              <IonIcon color="dark" icon={linkOutline} />
              <IonLabel>Profile Link</IonLabel>
            </IonItem>

            <IonItem onClick={handleQrShow}>
              <IonIcon color="dark" icon={qrCodeOutline} />
              <IonLabel>Profile QR Code</IonLabel>
            </IonItem>

            <IonItem href="/personalinfo">
              <IonIcon color="dark" icon={personOutline} />
              <IonLabel>Personal Info </IonLabel>
            </IonItem>
            <IonItem>
              <IonIcon color="dark" icon={heartOutline} />
              <IonLabel>Favourites</IonLabel>
            </IonItem>

            {isProfessional ? (
              <>
                <IonItem href="/professionalinfo">
                  <IonIcon color="dark" icon={personOutline} />
                  <IonLabel>Professional Account</IonLabel>
                </IonItem>
                <IonItem href="/professionalavailability">
                  <IonIcon color="dark" icon={timeOutline} />
                  <IonLabel>Availability Schedule</IonLabel>
                </IonItem>
                <IonItem href="/professionalservicerates">
                  <IonIcon color="dark" icon={personOutline} />
                  <IonLabel>Call Rates</IonLabel>
                </IonItem>
                <IonItem href="/profile">
                  <IonIcon color="dark" icon={starOutline} />
                  <IonLabel>Reviews</IonLabel>
                </IonItem>
                <IonItem href="/professionalverification">
                  <IonIcon color="medium" size="small" icon={verified_c} />
                  <IonLabel>Verified Badge</IonLabel>
                </IonItem>
              </>
            ) : (
              <IonItem href="/professionalswitch">
                <IonIcon color="dark" icon={personOutline} />
                <IonLabel>Switch to Professional Account</IonLabel>
              </IonItem>
            )}

            <IonItem>
              <IonIcon color="dark" icon={personOutline} />
              <IonLabel>About ConsultEase</IonLabel>
            </IonItem>

            <IonItem>
              <IonIcon color="dark" icon={logOutOutline} />
              <IonLabel>Logout</IonLabel>
            </IonItem>
          </IonList>
        </IonModal>
      )}
      {profile_id_viewing && (
        <IonModal
          id="menuModal"
          showBackdrop="true"
          backdropDismiss="true"
          isOpen={modalVisible}
          initialBreakpoint={0.3}
          breakpoints={[0.3, 0.6, 1]}
          onDidPresent={presentModal}>
          <IonList lines="none">
            <IonItem onClick={handleShareProfile}>
              <IonIcon color="dark" icon={shareSocialOutline} />
              <IonLabel>Share Profile</IonLabel>
            </IonItem>
            <IonItem onClick={handleProfileLink}>
              <IonIcon color="dark" icon={linkOutline} />
              <IonLabel>Profile Link</IonLabel>
            </IonItem>

            <IonItem onClick={handleQrShow}>
              <IonIcon color="dark" icon={qrCodeOutline} />
              <IonLabel>Profile QR Code</IonLabel>
            </IonItem>

            <IonItem>
              <IonIcon color="dark" icon={alertCircleOutline} />
              <IonLabel>Report Profile</IonLabel>
            </IonItem>
          </IonList>
        </IonModal>
      )}
      {/* *** Profile Qr Code Modal below *** */}
      <IonModal
        id="qrModal"
        showBackdrop="true"
        backdropDismiss="true"
        isOpen={qrModalVisible}
        initialBreakpoint={0.9}
        breakpoints={[0.9, 1]}
        onDidPresent={presentModal}
        onDidDismiss={() => setQrModalVisible(false)}>
        <IonList lines="none">
          <IonItem>
            <QRCode
              qrStyle="dots"
              quietZone="10"
              fgColor="#212E35"
              enableCORS="true"
              eyeRadius={[10, 10, 10, 10]}
              size="250"
              logoWidth="50"
              removeQrCodeBehindLogo="true"
              logoImage={appLogo}
              value={
                'https://callingserver.onrender.com/api/v1/profile/' +
                profile._id
              }
            />
          </IonItem>
          <IonItem>
            <h3>@{profile.profile ? profile.profile.handle : ''}</h3>
          </IonItem>
          <IonItem onClick={(e)=>handleQrDownload(e)}>
            <IonIcon color="dark" icon={alertCircleOutline} />
            <IonLabel>Download QR Code</IonLabel>
          </IonItem>
        </IonList>
      </IonModal>
      {/* *** Share Profile Modal below *** */}
      {shareProfileModalVisible && (
        <ShareProfile
          shareProfileModalVisible={shareProfileModalVisible}
          setShareProfileModalVisible={setShareProfileModalVisible}
          profile={profile}
          copyProfileLink={handleProfileLink}
        />
      )}
    </div>
  );
};

export default MenuModal;
