import React from 'react';
import './ShareProfile.css';
import {
  IonModal,
  IonList,
  IonItem,
  IonIcon,
  IonLabel,
  IonHeader,
  IonButton,
} from '@ionic/react';
//
import {
  alertCircleOutline,
  copy,
  copyOutline,
  copySharp,
  logoFacebook,
  logoInstagram,
  logoLinkedin,
  logoWhatsapp,
  mailOpen,
  mailOpenOutline,
  shareOutline,
  shareSocial,
  shareSocialOutline,
} from 'ionicons/icons';
//
// react-share imports starts
import {
  EmailShareButton,
  FacebookShareButton,
  FacebookMessengerShareButton,
  HatenaShareButton,
  InstapaperShareButton,
  LineShareButton,
  LinkedinShareButton,
  LivejournalShareButton,
  MailruShareButton,
  OKShareButton,
  PinterestShareButton,
  PocketShareButton,
  RedditShareButton,
  TelegramShareButton,
  TumblrShareButton,
  TwitterShareButton,
  ViberShareButton,
  VKShareButton,
  WhatsappShareButton,
  WorkplaceShareButton,
} from 'react-share';

import {
  EmailIcon,
  FacebookIcon,
  FacebookMessengerIcon,
  HatenaIcon,
  InstapaperIcon,
  LineIcon,
  LinkedinIcon,
  LivejournalIcon,
  MailruIcon,
  OKIcon,
  PinterestIcon,
  PocketIcon,
  RedditIcon,
  TelegramIcon,
  TumblrIcon,
  TwitterIcon,
  ViberIcon,
  VKIcon,
  WeiboIcon,
  WhatsappIcon,
  WorkplaceIcon,
} from 'react-share';
import copyy from 'copy-to-clipboard';

//react-share imports ends

const ShareProfile = ({
  shareProfileModalVisible,
  setShareProfileModalVisible,
  profile,
  copyProfileLink,
}) => {
  const socialShare = [
    {
      socialPlatform: 'Email',
      button: EmailShareButton,
      icon: EmailIcon,
    },

    {
      socialPlatform: 'WhatsApp',
      button: WhatsappShareButton,
      icon: WhatsappIcon,
    },
    {
      socialPlatform: 'Facebook',
      button: FacebookShareButton,
      icon: FacebookIcon,
    },
    {
      socialPlatform: 'Messenger',
      button: FacebookMessengerShareButton,
      icon: FacebookMessengerIcon,
    },
    {
      socialPlatform: 'Twitter',
      button: TwitterShareButton,
      icon: TwitterIcon,
    },
    {
      socialPlatform: 'LinkedIn',
      button: LinkedinShareButton,
      icon: LinkedinIcon,
    },

    {
      socialPlatform: 'Telegram',
      button: TelegramShareButton,
      icon: TelegramIcon,
    },
    {
      socialPlatform: 'Reddit',
      button: RedditShareButton,
      icon: RedditIcon,
    },
    {
      socialPlatform: 'Pinterest',
      button: PinterestShareButton,
      icon: PinterestIcon,
    },
    {
      socialPlatform: 'Tumblr',
      button: TumblrShareButton,
      icon: TumblrIcon,
    },
    {
      socialPlatform: 'Workplace',
      button: WorkplaceShareButton,
      icon: WorkplaceIcon,
    },

  ];

  function openInstagramChat() {
    const isInstagramInstalled = navigator.userAgent.indexOf('Instagram') > -1;
    
    if (isInstagramInstalled) {
      window.location.href = 'instagram://direct';
    } else if (navigator.userAgent.indexOf('Instagram') > -1){
      window.location.href = 'https://www.instagram.com/direct/inbox/';
    } else {
      window.location.href = 'https://www.instagram.com/direct/inbox/';
    }

  }

  let profileLink = 'https://callingserver.onrender.com/api/v1/' + profile._id;

  return (
    <IonModal
      id="qrModal"
      showBackdrop="true"
      backdropDismiss="true"
      isOpen={shareProfileModalVisible}
      initialBreakpoint={0.5}
      breakpoints={[0.5, 1]}
      onDidDismiss={() => setShareProfileModalVisible(false)}>
      <IonHeader>
        <IonItem className="socialHeading">
          <IonIcon icon={shareSocialOutline} color="dark" />
          <IonLabel>Share Profile</IonLabel>
        </IonItem>
      </IonHeader>

      <IonList lines="none" className="socialShare">
        <div className="copyBtn socialBtn">
          <IonButton
            color="light"
            fill="clear"
            onClick={() => copyProfileLink()}>
            <IonIcon icon={copyOutline}></IonIcon>
          </IonButton>
          <IonLabel>Copy Link</IonLabel>
        </div>

        {socialShare.map((item, index) => {
          return (
            <div key={index} className="socialBtn">
              <item.button url={profileLink}>
                <item.icon className="socialIcon" size="2rem" round={true} />
              </item.button>
              <IonLabel>{item.socialPlatform}</IonLabel>
            </div>
          );
        })}
        {/* <button onClick={openInstagramChat}>
          Instagram
          <IonIcon></IonIcon>
      </button> */}
      </IonList>
    </IonModal>
  );
};

export default ShareProfile;

/*
<div className="socialShareItem">
          <IonIcon color="primary" size="large" icon={copyOutline} />
        </div>
        <div className="socialShareItem">
          <IonIcon
            onClick={" "}
            color="primary"
            size="large"
            icon={mailOpenOutline}
          />
          <IonLabel>Messages</IonLabel>
        </div>
        <IonIcon color="primary" size="large" icon={logoWhatsapp} />
        <IonIcon color="primary" size="large" icon={logoInstagram} />
        <IonIcon color="primary" size="large" icon={logoFacebook} />
        <IonIcon color="primary" size="large" icon={logoLinkedin} />
*/
