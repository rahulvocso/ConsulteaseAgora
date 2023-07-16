import {
  IonImg,
  IonContent,
  IonNote,
  IonPage,
  IonAvatar,
  IonNavLink,
} from '@ionic/react';
import {
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonRow,
  IonCol,
  IonIcon,
  useIonToast,
} from '@ionic/react';
import appLogo from '../theme/assets/app-logo.svg';
import security_c from '../theme/assets/security.svg';

import {
  cameraOutline,
  personOutline,
  callOutline,
  checkmarkCircleOutline,
  warningOutline,
} from 'ionicons/icons';

import React, {Link, useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Header} from '../components/Header';
import useFetch from '../hooks/useFetch';
import Avatar from 'react-avatar';
import './PersonalInfo.css';
import {takePhoto} from '../utils/camera';

const languagesList = [
  'Arabic',
  'Bengali',
  'Chinese',
  'English',
  'French',
  'German',
  'Gujarati',
  'Hindi',
  'Italian',
  'Japanese',
  'Korean',
  'Marathi',
  'Portuguese',
  'Punjabi',
  'Russian',
  'Spanish',
  'Tamil',
  'Telugu',
  'Turkish',
  'Urdu',
];
const ProfessionalInfo = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [data, setData] = useState({
    fname: '',
    photo: '',
    title: '',
    website: '',
    handle: '',
    description: '',
    languages: [],
  });

  const {get, post, loading} = useFetch(
    'https://callingserver.onrender.com/api/v1/',
  );

  useEffect(() => {
    // fetch current personal info
    get('user/', {auth_token: localStorage.getItem('auth_token')}).then(
      data => {
        // populate info in form
        setData({
          fname: data.body.fname,
          photo: data.body.photo,
          title: data.body.profile.title,
          handle: data.body.profile.handle,
          website: data.body.profile.website,
          description: data.body.profile.description,
          languages: data.body.profile.languages,
        });
      },
    );
  }, []);

  const handleChange = e => {
    const newData = {...data};
    newData[e.target.id] = e.target.value;
    console.log(e.target.id, '  break ', `e.detail.value`, e.target.value);
    setData(newData);
  };

  // upload to server and save in db if new image is selected...
  const handlePhotoChange = async e => {
    let photo = await takePhoto();
    const newData = {...data};
    //    console.log(photo);
    newData['photo'] = photo;
    setData(newData);
    handleUpload(photo);
  };

  // Perform the upload of image
  const handleUpload = photo => {
    try {
      const s3URL = post(
        'user/uploadImage',
        {
          image: photo,
          imageName: '',
          type: 'jpeg',
        },
        {auth_token: localStorage.getItem('auth_token')},
      ).then(response => {
        console.log(response);
        const newData = {...data};
        newData['photo'] = response.imageUrl;
        setData(newData);
      });
    } catch (error) {
      presentToast({
        message: error,
        icon: checkmarkCircleOutline,
        translucent: true,
        duration: 2000,
        color: 'primary',
      });
    }
  };

  const handleSave = res => {
    //console.log("Call the Update User API",localStorage.getItem("auth_token"))

    post(
      'user/updateProfessionalInfo',
      {
        handle: data.handle,
        title: data.title,
        description: data.description,
        website: data.website,
        languages: data.languages,
      },
      {auth_token: localStorage.getItem('auth_token')},
    ).then(data => {
      //console.log(data);
      if (data.status == 200) {
        presentToast({
          message: data.message,
          icon: checkmarkCircleOutline,
          tramslucent: true,
          duration: 2000,
          color: 'primary',
        });
        history.push('/professionalservicerates');
      } else
        presentToast({
          message: data.message,
          duration: 4000,
          icon: warningOutline,
          color: 'danger',
        });
    });
  };

  function isLanguageSelected(lang) {
    let index = data.languages.findIndex(l => {
      return lang == l;
    });
    if (index >= 0) console.log('B', index, lang);
    return index >= 0 ? true : false;
  }

  return (
    <IonPage>
      <Header
        type="accountwizard"
        title="Professional Details"
        handleRight={handleSave}
      />

      <IonContent>
        <IonRow>
          <IonCol className="personalInfo-form">
            <IonNote>
              Upload your professional photo here. Make sure it does not contain
              any text or number on it.
            </IonNote>
            <IonAvatar className="ProfileAvatar">
              <Avatar
                align="center"
                size="100"
                round="100px"
                name={data.fname}
                src={data.photo}
              />
              <IonButton
                onClick={() => handlePhotoChange()}
                shape="round"
                size="small"
                color="light">
                <IonIcon size="small" icon={cameraOutline} />
              </IonButton>
            </IonAvatar>
            <IonItem>
              <IonLabel position="floating">Profile Handle (unique)</IonLabel>
              <IonInput
                placeholder="e.g. elonmusk"
                id="handle"
                onIonChange={e => handleChange(e)}
                value={data.handle}
                minlength={6}
                maxLength={25}
                type="text"></IonInput>
            </IonItem>
            <br />
            <IonItem>
              <IonLabel position="floating">Tagline</IonLabel>
              <IonInput
                id="title"
                placeholder="e.g. Entreprenurship and angel investment"
                onIonChange={e => handleChange(e)}
                value={data.title}
                minlength={6}
                maxLength={60}
                type="text"></IonInput>
            </IonItem>
            <br />{' '}
            <IonItem>
              <IonLabel position="floating">Languages you speak</IonLabel>
              <IonSelect
                id="languages"
                //compareWith={isLanguageSelected}
                interface="popover"
                onIonChange={e => handleChange(e)}
                placeholder="Select language(s)"
                multiple={true}>
                {
                  // to be continued from here...
                  languagesList.map(lang => {
                    return (
                      <IonSelectOption selected="true" key={lang} value={lang}>
                        {lang}
                      </IonSelectOption>
                    );
                  })
                }
              </IonSelect>
            </IonItem>
            <br />
            <IonItem>
              <IonLabel position="floating">Description</IonLabel>
              <IonTextarea
                id="description"
                onIonChange={e => handleChange(e)}
                value={data.description}
                placeholder="Explain about your area of expertise and experience..."
                maxLength={254}
                autoGrow={true}></IonTextarea>
            </IonItem>
            <br />
            <IonItem>
              <IonLabel position="floating">Website</IonLabel>
              <IonInput
                placeholder="https://www.yourwebsite.com"
                onIonChange={e => handleChange(e)}
                value={data.website}
                id="website"
                minlength={6}
                maxLength={60}
                type="text"></IonInput>
            </IonItem>
            <br />
          </IonCol>
        </IonRow>
      </IonContent>
      <IonButton
        disabled={false}
        className="ion-margin"
        onClick={e => handleSave(e)}>
        Save & Continue
      </IonButton>
    </IonPage>
  );
};

export default ProfessionalInfo;
