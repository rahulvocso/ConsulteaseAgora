import {IonContent, IonNote, IonPage} from '@ionic/react';
import {
  IonIcon,
  IonRange,
  IonButton,
  IonItem,
  IonLabel,
  IonInput,
  IonRow,
  IonCol,
  useIonToast,
} from '@ionic/react';

import {useState, useEffect} from 'react';
import {useHistory} from 'react-router-dom';
import {Header} from '../components/Header';
import useFetch from '../hooks/useFetch';
import './ProfessionalServiceRates.css';

import {checkmarkCircleOutline, warningOutline} from 'ionicons/icons';

const ProfessionalServiceRates = () => {
  const history = useHistory();
  const [presentToast] = useIonToast();
  const [data, setData] = useState({audio_call: 0, video_call: 0});

  const {get, post, loading} = useFetch(
    'https://callingserver.onrender.com/api/v1/',
  );

  useEffect(() => {
    // fetch current personal info
    get('user/', {auth_token: localStorage.getItem('auth_token')}).then(
      data => {
        // populate info in form
        setData({
          audio_call: data.body.profile.rates.audio_call,
          video_call: data.body.profile.rates.video_call,
        });
      },
    );
  }, []);

  const handleChange = e => {
    const newData = {...data};
    newData[e.target.id] = e.target.value;
    setData(newData);
  };

  const handleSave = res => {
    //console.log("Call the Update User API",localStorage.getItem("auth_token"))

    post(
      'user/updateProfessionalRates',
      {
        rates: data,
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
        history.push('/professionalavailability');
      } else
        presentToast({
          message: data.message,
          duration: 4000,
          icon: warningOutline,
          color: 'danger',
        });
    });
  };

  return (
    <IonPage>
      <Header
        type="accountwizard"
        title="Calling Rates"
        handleRight={handleSave}
      />

      <IonContent>
        <IonRow>
          <IonCol className="personalInfo-form">
            <IonItem>
              <IonLabel>Audio Call Rate (INR/min) </IonLabel>
              <IonInput
                id="audio_call"
                onIonChange={e => handleChange(e)}
                min={5}
                max={1000}
                value={data.audio_call}
                type="number"></IonInput>
            </IonItem>

            <IonItem>
              <IonLabel>Video Call Rate (INR/min) </IonLabel>
              <IonInput
                id="video_call"
                onIonChange={e => handleChange(e)}
                min={10}
                max={1000}
                value={data.video_call}
                type="number"></IonInput>
            </IonItem>

            <br />
            <IonLabel>* Subject to platform commission </IonLabel>
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

export default ProfessionalServiceRates;
