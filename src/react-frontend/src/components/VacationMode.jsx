import {useEffect, useState} from 'react';
import {
  IonToggle,
  IonLabel,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  useIonToast,
} from '@ionic/react';
import {IonRow, IonCol, IonContent} from '@ionic/react';
import {IonSegment, IonSegmentButton} from '@ionic/react';
import useFetch from '../hooks/useFetch';
import {checkmarkCircleOutline, warningOutline} from 'ionicons/icons';

export const VacationMode = ({profile}) => {
  const [vacationMode, setVacationMode] = useState(false);
  const [overrideSchedule, setOverrideSchedule] = useState(false);
  const [alwaysOnMode, setAlwaysOnMode] = useState(false);
  const [availability, setAvailability] = useState('');

  const [presentToast] = useIonToast();

  const {get, post, loading} = useFetch(
    'https://callingserver.onrender.com/api/v1/',
  );

  useEffect(() => {
    get('user/', {auth_token: localStorage.getItem('auth_token')}).then(
      data => {
        setVacationMode(data.body.profile.vacation);
        setOverrideSchedule(data.body.profile.overrideSchedule);
        setAlwaysOnMode(data.body.profile.alwaysAvailable);
      },
    );
  }, []);
  // for updating
  // vacation
  // call me anytime settings...
  const handleModeUpdate = e => {
    if (e.target.field == 'profile.vacation') setVacationMode(e.target.checked);
    else if (e.target.field == 'profile.overrideSchedule')
      setOverrideSchedule(e.target.checked);
    else if (e.target.field == 'profile.alwaysAvailable')
      setAlwaysOnMode(e.target.checked);

    console.log('Key ', e.target.field, e.target.checked);
    post(
      'user/updateUserMeta',
      {
        key: e.target.field,
        value: e.target.checked,
      },
      {auth_token: localStorage.getItem('auth_token')},
    ).then(data => {
      //console.log(data);
      if (data.status == 200)
        presentToast({
          message: data.message,
          icon: checkmarkCircleOutline,
          tramslucent: true,
          duration: 2000,
          color: 'primary',
        });
      else
        presentToast({
          message: data.message,
          duration: 4000,
          icon: warningOutline,
          color: 'danger',
        });
    });
  };

  return (
    <div className="availabilityMode">
      <IonSegment value={availability} mode="ios">
        <IonSegmentButton value="available">
          <IonLabel>Available</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="notAvailable">
          <IonLabel>Not Available</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton value="followSchedule">
          <IonLabel>Follow schedule</IonLabel>
        </IonSegmentButton>
      </IonSegment>

      {!alwaysOnMode && !overrideSchedule && (
        <IonLabel>Choose this if you are not available to take calls.</IonLabel>
      )}
      {alwaysOnMode && overrideSchedule && (
        <IonLabel>
          You won't get any calls. Switch it back when you're ready to take
          calls.
        </IonLabel>
      )}

      <IonCard color={alwaysOnMode ? '' : 'light'}>
        <IonCardHeader>
          <IonRow>
            <IonCol className="widecol"></IonCol>
          </IonRow>
        </IonCardHeader>

        <IonCardContent>
          {!alwaysOnMode && !overrideSchedule && (
            <IonLabel>
              Choose this if you are not available to take calls.
            </IonLabel>
          )}
          {alwaysOnMode && overrideSchedule && (
            <IonLabel>
              You won't get any calls. Switch it back when you're ready to take
              calls.
            </IonLabel>
          )}
        </IonCardContent>
      </IonCard>
    </div>
  );
};
